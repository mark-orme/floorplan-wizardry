
/**
 * Custom hook for grid management
 * Handles grid creation, caching, and lifecycle management
 * @module useCanvasGrid
 */
import { useCallback, useRef, useEffect } from "react";
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { createGrid } from "@/utils/canvasGrid";
import { 
  gridManager, 
  resetGridProgress
} from "@/utils/gridManager";
import { 
  CanvasDimensions, 
  DebugInfoState, 
  GridCreationCallback 
} from "@/types/drawingTypes";

/**
 * Properties required by the useCanvasGrid hook
 * @interface UseCanvasGridProps
 */
interface UseCanvasGridProps {
  /** Reference to the grid layer objects */
  gridLayerRef: React.MutableRefObject<FabricObject[]>;
  
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
  const MAX_ATTEMPTS = 7; // Increased from 5 to 7
  const lastAttemptTimeRef = useRef<number>(0);
  const MIN_ATTEMPT_INTERVAL = 150; // Reduced from 200 to 150ms
  
  // Use the useEffect cleanup to ensure we reset the grid progress
  useEffect(() => {
    return () => {
      if (process.env.NODE_ENV === 'development') {
        console.log("Cleaning up grid creation - resetting progress flags");
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
   * @returns {FabricObject[]} Array of created grid objects
   */
  const createGridCallback = useCallback((canvas: FabricCanvas): FabricObject[] => {
    if (process.env.NODE_ENV === 'development') {
      console.log("createGridCallback invoked with FORCED CREATION", {
        canvasDimensions,
        gridExists: gridLayerRef.current.length > 0,
        initialized: gridManager.initialized
      });
    }
    
    // Basic validation
    if (!canvas) {
      if (process.env.NODE_ENV === 'development') {
        console.error("Canvas is null in createGridCallback");
      }
      return [];
    }
    
    // Throttle rapid creation attempts but reduce throttling time
    const now = Date.now();
    if (now - lastAttemptTimeRef.current < MIN_ATTEMPT_INTERVAL) {
      if (process.env.NODE_ENV === 'development') {
        console.log("Throttling grid creation - too many rapid attempts");
      }
      
      // Even if throttled, schedule a retry after the throttle interval
      setTimeout(() => {
        if (!canvas) return;
        resetGridProgress();
        createGridCallback(canvas);
      }, MIN_ATTEMPT_INTERVAL + 50);
      
      return gridLayerRef.current;
    }
    
    lastAttemptTimeRef.current = now;
    
    // Force reset any stuck grid creation before attempting
    resetGridProgress();
    
    // Increment attempt counter
    attemptCountRef.current++;
    if (process.env.NODE_ENV === 'development') {
      console.log(`Grid creation attempt #${attemptCountRef.current}`);
    }
    
    if (process.env.NODE_ENV === 'development') {
      console.log("Forcing grid creation with dimensions:", canvasDimensions);
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
      } else if (attemptCountRef.current < MAX_ATTEMPTS) {
        // Schedule a retry with exponential backoff
        const delay = Math.min(100 * Math.pow(1.5, attemptCountRef.current), 2000);
        
        if (process.env.NODE_ENV === 'development') {
          console.log(`Scheduling grid creation retry in ${delay}ms`);
        }
        
        setTimeout(() => {
          if (!canvas) return;
          resetGridProgress();
          createGridCallback(canvas);
        }, delay);
      } else {
        if (process.env.NODE_ENV === 'development') {
          console.warn("Reached maximum grid creation attempts");
        }
        
        // Additional fallback: Create basic emergency grid
        const emergencyGrid = createBasicEmergencyGrid(canvas);
        if (emergencyGrid.length > 0) {
          if (process.env.NODE_ENV === 'development') {
            console.log("Created emergency basic grid");
          }
          return emergencyGrid;
        }
      }
      
      return gridLayerRef.current;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error("Critical error in createGridCallback:", error);
      }
      setHasError(true);
      setErrorMessage(`Grid creation failed: ${error instanceof Error ? error.message : String(error)}`);
      
      // Try one more time with a delay before giving up
      if (attemptCountRef.current < MAX_ATTEMPTS) {
        setTimeout(() => {
          resetGridProgress();
          createGridCallback(canvas);
        }, 500);
      }
      
      return gridLayerRef.current;
    }
  }, [canvasDimensions, gridLayerRef, setDebugInfo, setHasError, setErrorMessage]);
  
  /**
   * Create a very basic emergency grid when all else fails
   * This is a simplified grid with minimal objects to ensure something is visible
   * 
   * @param {FabricCanvas} canvas - The Fabric canvas instance
   * @returns {FabricObject[]} Simple emergency grid objects
   */
  const createBasicEmergencyGrid = (canvas: FabricCanvas): FabricObject[] => {
    if (process.env.NODE_ENV === 'development') {
      console.log("Creating emergency basic grid");
    }
    
    const emergencyGrid: FabricObject[] = [];
    
    try {
      const width = canvas.width || 800;
      const height = canvas.height || 600;
      
      // Create a simple grid with just a few lines
      for (let x = 0; x <= width; x += 100) {
        const line = new fabric.Line([x, 0, x, height], {
          stroke: '#CCDDEE',
          selectable: false,
          evented: false,
          strokeWidth: x % 500 === 0 ? 1.5 : 0.5
        });
        canvas.add(line);
        emergencyGrid.push(line);
      }
      
      for (let y = 0; y <= height; y += 100) {
        const line = new fabric.Line([0, y, width, y], {
          stroke: '#CCDDEE',
          selectable: false,
          evented: false,
          strokeWidth: y % 500 === 0 ? 1.5 : 0.5
        });
        canvas.add(line);
        emergencyGrid.push(line);
      }
      
      // Add a scale marker
      const markerLine = new fabric.Line([width - 120, height - 30, width - 20, height - 30], {
        stroke: "#000000",
        strokeWidth: 3,
        selectable: false,
        evented: false
      });
      canvas.add(markerLine);
      emergencyGrid.push(markerLine);
      
      const markerText = new fabric.Text("1m", {
        left: width - 70,
        top: height - 45,
        fontSize: 16,
        fontWeight: 'bold',
        fill: "#000000",
        selectable: false,
        evented: false
      });
      canvas.add(markerText);
      emergencyGrid.push(markerText);
      
      canvas.requestRenderAll();
      
      // Update the grid layer ref
      gridLayerRef.current = emergencyGrid;
      
      return emergencyGrid;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error("Error creating emergency grid:", error);
      }
      return [];
    }
  };

  return createGridCallback;
};
