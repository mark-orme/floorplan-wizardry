
/**
 * Hook for creating and managing grid objects on canvas
 * Handles the core grid creation functionality
 * @module useGridCreation
 */
import { useCallback } from "react";
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { createGrid } from "@/utils/canvasGrid";
import { resetGridProgress } from "@/utils/gridManager";
import { 
  CanvasDimensions, 
  DebugInfoState
} from "@/types/drawingTypes";
import logger from "@/utils/logger";

/**
 * Props for the useGridCreation hook
 * @interface UseGridCreationProps
 */
interface UseGridCreationProps {
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
 * Result type for the useGridCreation hook
 * @interface UseGridCreationResult
 */
interface UseGridCreationResult {
  (canvas: FabricCanvas): FabricObject[];
}

/**
 * Hook for grid creation operations
 * Manages the creation of grid lines and objects on the canvas
 * 
 * @param {UseGridCreationProps} props - Hook properties
 * @returns {UseGridCreationResult} Memoized grid creation function
 */
export const useGridCreation = ({
  gridLayerRef,
  canvasDimensions,
  setDebugInfo,
  setHasError,
  setErrorMessage
}: UseGridCreationProps): UseGridCreationResult => {
  
  /**
   * Create grid lines on the canvas
   * @param {FabricCanvas} canvas - The Fabric.js canvas instance
   * @returns {FabricObject[]} Array of created grid objects
   */
  const createGridCallback = useCallback((canvas: FabricCanvas): FabricObject[] => {
    if (process.env.NODE_ENV === 'development') {
      logger.debug("createGridCallback invoked with canvas dimensions", {
        canvasDimensions,
        gridExists: gridLayerRef?.current?.length > 0,
        initialized: (canvas as any).initialized
      });
    }
    
    // Force reset any stuck grid creation before attempting
    resetGridProgress();
    
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
          logger.debug(`Grid created successfully with ${grid.length} objects`);
        }
        
        // Force a render
        canvas.requestRenderAll();
        
        // Add debug info
        setDebugInfo(prev => ({
          ...prev,
          gridCreated: true,
          gridObjectCount: grid.length,
          lastGridCreationTime: new Date().toISOString()
        }));
      }
      
      return grid || gridLayerRef.current;
      
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        logger.error("Critical error in createGridCallback:", error);
      }
      setHasError(true);
      setErrorMessage(`Grid creation failed: ${error instanceof Error ? error.message : String(error)}`);
      
      return gridLayerRef.current;
    }
  }, [canvasDimensions, gridLayerRef, setDebugInfo, setHasError, setErrorMessage]);

  return createGridCallback;
};
