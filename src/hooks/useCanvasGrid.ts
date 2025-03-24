
/**
 * Custom hook for grid management
 * @module useCanvasGrid
 */
import { useCallback, useRef } from "react";
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { createGrid } from "@/utils/canvasGrid";
import { 
  gridManager, 
  resetGridProgress
} from "@/utils/gridManager";
import { CanvasDimensions, DebugInfoState } from "@/types/drawingTypes";

interface UseCanvasGridProps {
  gridLayerRef: React.MutableRefObject<FabricObject[]>;
  canvasDimensions: CanvasDimensions;
  setDebugInfo: React.Dispatch<React.SetStateAction<DebugInfoState>>;
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
  // Track grid creation attempts
  const attemptCountRef = useRef(0);
  const MAX_ATTEMPTS = 3;
  
  // Create grid callback with simple direct execution
  const createGridCallback = useCallback((canvas: FabricCanvas): FabricObject[] => {
    console.log("createGridCallback invoked with FORCED CREATION", {
      canvasDimensions,
      gridExists: gridLayerRef.current.length > 0,
      initialized: gridManager.initialized
    });
    
    // Basic validation
    if (!canvas) {
      console.error("Canvas is null in createGridCallback");
      return [];
    }
    
    // Force reset any stuck grid creation before attempting
    resetGridProgress();
    
    // Increment attempt counter
    attemptCountRef.current++;
    console.log(`Grid creation attempt #${attemptCountRef.current}`);
    
    console.log("Forcing grid creation with dimensions:", canvasDimensions);
    
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
        console.log(`Grid created successfully with ${grid.length} objects`);
        // Reset attempt counter on success
        attemptCountRef.current = 0;
        // Force a render
        canvas.requestRenderAll();
        
        return grid;
      } else {
        console.warn("Grid creation returned no objects");
        return [];
      }
    } catch (err) {
      console.error("Critical error in createGridCallback:", err);
      setHasError(true);
      setErrorMessage(`Grid creation failed: ${err instanceof Error ? err.message : String(err)}`);
      
      return [];
    }
  }, [canvasDimensions, gridLayerRef, setDebugInfo, setHasError, setErrorMessage]);

  return createGridCallback;
};
