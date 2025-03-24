
/**
 * Custom hook for grid management
 * @module useCanvasGrid
 */
import { useCallback, useRef, useEffect } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { createGrid } from "@/utils/canvasGrid";
import { gridManager, resetGridProgress, scheduleGridProgressReset } from "@/utils/gridOperations";

interface UseCanvasGridProps {
  gridLayerRef: React.MutableRefObject<any[]>;
  canvasDimensions: { width: number, height: number };
  setDebugInfo: React.Dispatch<React.SetStateAction<{
    canvasInitialized: boolean;
    gridCreated: boolean;
    dimensionsSet: boolean;
    brushInitialized: boolean;
  }>>;
  setHasError: (value: boolean) => void;
  setErrorMessage: (value: string) => void;
}

/**
 * Hook for managing canvas grid creation and updates
 * @param {UseCanvasGridProps} props - Hook properties
 * @returns Memoized grid creation function
 */
export const useCanvasGrid = ({
  gridLayerRef,
  canvasDimensions,
  setDebugInfo,
  setHasError,
  setErrorMessage
}: UseCanvasGridProps) => {
  // Track the last grid creation time to prevent rapid consecutive creations
  const lastGridCreationTimeRef = useRef(gridManager.lastCreationTime);
  const gridCreationInProgressRef = useRef(gridManager.inProgress);
  const lastDimensionsRef = useRef(gridManager.lastDimensions);
  const initialGridCreatedRef = useRef(gridManager.initialized);
  const gridCreationsCountRef = useRef(gridManager.totalCreations);
  const debounceTimerRef = useRef<number | null>(null);
  const safetyTimeoutRef = useRef<number | null>(null);
  const attemptCountRef = useRef(0);
  const MAX_ATTEMPTS = 3;
  
  // Debug effect to log grid state changes
  useEffect(() => {
    console.log("Grid hook state:", {
      initialized: initialGridCreatedRef.current,
      inProgress: gridCreationInProgressRef.current,
      objectsCount: gridLayerRef.current.length,
      dimensions: canvasDimensions
    });
  }, [canvasDimensions, gridLayerRef.current.length]);
  
  // Set up a safety reset for grid creation
  useEffect(() => {
    return () => {
      // Make sure in-progress flag is reset when component unmounts
      if (safetyTimeoutRef.current) {
        clearTimeout(safetyTimeoutRef.current);
      }
      resetGridProgress();
    };
  }, []);
  
  // Create grid callback with forced creation and retry mechanism
  const createGridCallback = useCallback((canvas: FabricCanvas) => {
    console.log("createGridCallback invoked with FORCED CREATION", {
      canvasDimensions,
      gridExists: gridLayerRef.current.length > 0,
      initialized: initialGridCreatedRef.current
    });
    
    // Basic validation
    if (!canvas) {
      console.error("Canvas is null in createGridCallback");
      return [];
    }
    
    // Clear any pending debounced grid creation
    if (debounceTimerRef.current !== null) {
      window.clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
    
    // CRITICAL FIX: Reset progress flag immediately before attempting new creation
    // This ensures we don't get stuck in "already in progress" state
    resetGridProgress();
    gridCreationInProgressRef.current = false;
    
    // Increment attempt counter
    attemptCountRef.current++;
    console.log(`Grid creation attempt #${attemptCountRef.current}`);
    
    // Set flags to indicate a grid creation is in progress
    gridCreationInProgressRef.current = true;
    gridManager.inProgress = true;
    
    // Set a safety timeout to reset the in-progress flag
    if (safetyTimeoutRef.current) {
      clearTimeout(safetyTimeoutRef.current);
    }
    
    safetyTimeoutRef.current = window.setTimeout(() => {
      console.log("Safety timeout triggered: resetting grid creation flags");
      resetGridProgress();
      gridCreationInProgressRef.current = false;
      safetyTimeoutRef.current = null;
      
      // If we haven't exceeded max attempts, try again after delay
      if (attemptCountRef.current < MAX_ATTEMPTS) {
        console.log(`Retry attempt #${attemptCountRef.current + 1} scheduled after safety timeout`);
        setTimeout(() => {
          createGridCallback(canvas);
        }, 500);
      }
    }, gridManager.safetyTimeout);
    
    console.log("Forcing grid creation with dimensions:", canvasDimensions);
    
    try {
      // Increment counter
      gridCreationsCountRef.current += 1;
      gridManager.totalCreations += 1;
      
      // Store current dimensions
      lastDimensionsRef.current = { ...canvasDimensions };
      gridManager.lastDimensions = { ...canvasDimensions };
      
      // Create the grid with direct call (no batching)
      const grid = createGrid(
        canvas, 
        gridLayerRef, 
        canvasDimensions, 
        setDebugInfo, 
        setHasError, 
        setErrorMessage
      );
      
      // Mark initial grid as created
      initialGridCreatedRef.current = true;
      gridManager.initialized = true;
      
      if (grid && grid.length > 0) {
        console.log(`Grid created successfully with ${grid.length} objects`);
        // Reset attempt counter on success
        attemptCountRef.current = 0;
        // Force a render
        canvas.requestRenderAll();
        return grid;
      } else {
        console.warn("Grid creation returned no objects");
        
        // Retry logic if we haven't exceeded max attempts
        if (attemptCountRef.current < MAX_ATTEMPTS) {
          console.log(`Scheduling retry attempt #${attemptCountRef.current + 1}`);
          
          // Use exponential backoff for retries
          const delay = Math.pow(2, attemptCountRef.current) * 200;
          
          setTimeout(() => {
            resetGridProgress();
            createGridCallback(canvas);
          }, delay);
        }
        
        return [];
      }
    } catch (err) {
      console.error("Critical error in createGridCallback:", err);
      setHasError(true);
      setErrorMessage(`Grid creation failed: ${err instanceof Error ? err.message : String(err)}`);
      
      // Retry logic if we haven't exceeded max attempts
      if (attemptCountRef.current < MAX_ATTEMPTS) {
        console.log(`Scheduling retry attempt #${attemptCountRef.current + 1} after error`);
        
        setTimeout(() => {
          resetGridProgress();
          createGridCallback(canvas);
        }, 500);
      }
      
      return [];
    } finally {
      // Reset the flags
      gridCreationInProgressRef.current = false;
      gridManager.inProgress = false;
      
      // Clear safety timeout
      if (safetyTimeoutRef.current) {
        clearTimeout(safetyTimeoutRef.current);
        safetyTimeoutRef.current = null;
      }
    }
  }, [canvasDimensions, gridLayerRef, setDebugInfo, setHasError, setErrorMessage]);

  return createGridCallback;
};
