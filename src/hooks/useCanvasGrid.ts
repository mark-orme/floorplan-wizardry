
/**
 * Custom hook for grid management
 * Handles grid creation, caching, and lifecycle management
 * @module useCanvasGrid
 */
import { useCallback, useRef, useEffect } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { createGrid } from "@/utils/canvasGrid";
import { resetGridProgress, gridManager } from "@/utils/gridManager";
import { 
  CanvasDimensions, 
  DebugInfoState, 
  GridCreationCallback 
} from "@/types/drawingTypes";
import { 
  scheduleGridRetry, 
  DEFAULT_RETRY_CONFIG,
  handleMaxAttemptsReached 
} from "@/utils/gridRetryUtils";
import {
  validateGridComponents,
  shouldThrottleGridCreation,
  ensureGridLayerInitialized
} from "@/utils/gridValidationUtils";
import { toast } from "sonner";

/**
 * Properties required by the useCanvasGrid hook
 * @interface UseCanvasGridProps
 */
interface UseCanvasGridProps {
  /** Reference to the grid layer objects */
  gridLayerRef: React.MutableRefObject<any[]>;
  
  /** Current canvas dimensions */
  canvasDimensions: CanvasDimensions;
  
  /** Setter for debug information state */
  setDebugInfo: React.Dispatch<React.SetStateAction<DebugInfoState>>;
  
  /** Setter for error state */
  setHasError: (value: boolean) => void;
  
  /** Setter for error message */
  setErrorMessage: (value: string) => void;
}

/**
 * Hook for managing canvas grid creation and updates
 * Provides a memoized callback for creating grid lines on the canvas
 * Handles grid creation retries and error states
 * 
 * @param {UseCanvasGridProps} props - Hook properties
 * @returns {GridCreationCallback} Memoized grid creation function
 */
export const useCanvasGrid = ({
  gridLayerRef,
  canvasDimensions,
  setDebugInfo,
  setHasError,
  setErrorMessage
}: UseCanvasGridProps): GridCreationCallback => {
  // Track grid creation attempts
  const attemptCountRef = useRef<number>(0);
  const lastAttemptTimeRef = useRef<number>(0);
  const creationTimeoutRef = useRef<number | null>(null);
  
  // Use the useEffect cleanup to ensure we reset the grid progress
  useEffect(() => {
    return () => {
      if (process.env.NODE_ENV === 'development') {
        console.log("Cleaning up grid creation - resetting progress flags");
      }
      
      // Clear any pending timeouts
      if (creationTimeoutRef.current !== null) {
        clearTimeout(creationTimeoutRef.current);
        creationTimeoutRef.current = null;
      }
      
      resetGridProgress();
    };
  }, []);
  
  /**
   * Create grid lines on the canvas
   * This is a memoized callback to ensure consistent grid creation
   * Will reset progress and force new grid creation
   * 
   * @param {FabricCanvas} canvas - The Fabric.js canvas instance
   * @returns {any[]} Array of created grid objects
   */
  const createGridCallback = useCallback((canvas: FabricCanvas): any[] => {
    if (process.env.NODE_ENV === 'development') {
      console.log("createGridCallback invoked with FORCED CREATION", {
        canvasDimensions,
        gridExists: gridLayerRef?.current?.length > 0,
        initialized: (canvas as any).initialized
      });
    }
    
    // If we've hit too many consecutive resets, delay grid creation
    if (gridManager.consecutiveResets > gridManager.maxConsecutiveResets) {
      if (process.env.NODE_ENV === 'development') {
        console.warn("Delaying grid creation due to too many resets");
      }
      
      // Clear any existing timeout
      if (creationTimeoutRef.current !== null) {
        clearTimeout(creationTimeoutRef.current);
      }
      
      // Schedule delayed creation
      creationTimeoutRef.current = window.setTimeout(() => {
        if (!canvas) return;
        
        // Only try again if reset counter has been reduced
        if (gridManager.consecutiveResets < gridManager.maxConsecutiveResets) {
          resetGridProgress();
          createGridCallback(canvas);
        } else {
          toast.error("Grid creation is temporarily paused. Please wait a moment.", {
            id: "grid-throttled",
            duration: 3000
          });
        }
      }, 2000); // Give a longer timeout to allow things to settle
      
      return gridLayerRef.current;
    }
    
    // Validate components before proceeding
    const validation = validateGridComponents(canvas, gridLayerRef);
    if (!validation.valid) {
      return [];
    }
    
    // Ensure gridLayerRef is initialized
    ensureGridLayerInitialized(gridLayerRef);
    
    // Throttle rapid creation attempts
    if (shouldThrottleGridCreation(lastAttemptTimeRef.current, DEFAULT_RETRY_CONFIG.minAttemptInterval)) {
      if (process.env.NODE_ENV === 'development') {
        console.log("Throttling grid creation - too many rapid attempts");
      }
      
      // Clear any existing timeout
      if (creationTimeoutRef.current !== null) {
        clearTimeout(creationTimeoutRef.current);
      }
      
      // Even if throttled, schedule a retry after the throttle interval
      creationTimeoutRef.current = window.setTimeout(() => {
        if (!canvas) return;
        resetGridProgress();
        createGridCallback(canvas);
      }, DEFAULT_RETRY_CONFIG.minAttemptInterval + 200); // Increased from 50ms to 200ms
      
      return gridLayerRef.current;
    }
    
    // Update last attempt time
    lastAttemptTimeRef.current = Date.now();
    
    // Force reset any stuck grid creation before attempting
    resetGridProgress();
    
    // Increment attempt counter
    attemptCountRef.current++;
    if (process.env.NODE_ENV === 'development') {
      console.log(`Grid creation attempt #${attemptCountRef.current}`);
    }
    
    try {
      // Create the grid by direct call to canvasGrid.ts
      const grid = createGrid(
        canvas, 
        gridLayerRef, 
        canvasDimensions, 
        setDebugInfo, 
        setHasError, 
        setErrorMessage
      );
      
      if (grid && grid.length > 0) {
        if (process.env.NODE_ENV === 'development') {
          console.log(`Grid created successfully with ${grid.length} objects`);
        }
        // Reset attempt counter on success
        attemptCountRef.current = 0;
        // Force a render
        canvas.requestRenderAll();
        
        return grid;
      } else if (attemptCountRef.current < DEFAULT_RETRY_CONFIG.maxAttempts) {
        // Schedule a retry with exponential backoff
        const timeoutId = scheduleGridRetry(canvas, attemptCountRef, createGridCallback, DEFAULT_RETRY_CONFIG);
        creationTimeoutRef.current = timeoutId;
      } else {
        // Handle max attempts reached with emergency grid
        return handleMaxAttemptsReached(
          canvas,
          gridLayerRef,
          setDebugInfo,
          setHasError,
          setErrorMessage
        );
      }
      
      return gridLayerRef.current;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error("Critical error in createGridCallback:", error);
      }
      setHasError(true);
      setErrorMessage(`Grid creation failed: ${error instanceof Error ? error.message : String(error)}`);
      
      // Try one more time with a delay before giving up
      if (attemptCountRef.current < DEFAULT_RETRY_CONFIG.maxAttempts) {
        // Clear any existing timeout
        if (creationTimeoutRef.current !== null) {
          clearTimeout(creationTimeoutRef.current);
        }
        
        creationTimeoutRef.current = window.setTimeout(() => {
          resetGridProgress();
          createGridCallback(canvas);
        }, 800); // Increased from 500ms to 800ms
      }
      
      return gridLayerRef.current;
    }
  }, [canvasDimensions, gridLayerRef, setDebugInfo, setHasError, setErrorMessage]);

  return createGridCallback;
};
