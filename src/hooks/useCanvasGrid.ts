
/**
 * Custom hook for grid management
 * Handles grid creation, caching, and lifecycle management
 * @module useCanvasGrid
 */
import { useCallback, useRef } from "react";
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
  const MAX_ATTEMPTS = 3;
  
  /**
   * Create grid lines on the canvas
   * This is a memoized callback to ensure consistent grid creation
   * Will reset progress and force new grid creation
   * 
   * @param {FabricCanvas} canvas - The Fabric.js canvas instance
   * @returns {FabricObject[]} Array of created grid objects (lines)
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
      } else {
        if (process.env.NODE_ENV === 'development') {
          console.warn("Grid creation returned no objects");
        }
        return [];
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error("Critical error in createGridCallback:", error);
      }
      setHasError(true);
      setErrorMessage(`Grid creation failed: ${error instanceof Error ? error.message : String(error)}`);
      
      return [];
    }
  }, [canvasDimensions, gridLayerRef, setDebugInfo, setHasError, setErrorMessage]);

  return createGridCallback;
};
