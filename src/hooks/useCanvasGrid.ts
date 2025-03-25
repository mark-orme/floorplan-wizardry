
/**
 * Custom hook for grid management
 * Handles grid creation, caching, and lifecycle management
 * @module useCanvasGrid
 */
import { useCallback, useEffect } from "react";
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { resetGridProgress } from "@/utils/gridManager";
import { validateGridComponents, ensureGridLayerInitialized } from "@/utils/gridValidationUtils";
import { 
  CanvasDimensions, 
  DebugInfoState, 
  GridCreationCallback 
} from "@/types/drawingTypes";
import logger from "@/utils/logger";

// Import refactored grid hooks
import { useGridCreation } from "./grid/useGridCreation";
import { useGridRetry } from "./grid/useGridRetry";
import { useGridThrottling } from "./grid/useGridThrottling";

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
  // Use the base grid creation hook
  const createBaseGrid = useGridCreation({
    gridLayerRef,
    canvasDimensions,
    setDebugInfo,
    setHasError,
    setErrorMessage
  });
  
  // Use grid throttling hook
  const { 
    shouldThrottleCreation,
    handleThrottledCreation,
    cleanup: cleanupThrottling
  } = useGridThrottling({
    gridLayerRef
  });
  
  // Use grid retry hook
  const { 
    createGridWithRetry,
    cleanup: cleanupRetry
  } = useGridRetry({
    gridLayerRef,
    createGridCallback: createBaseGrid,
    setDebugInfo,
    setHasError,
    setErrorMessage
  });
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      logger.debug("Cleaning up grid creation - resetting progress flags");
      
      // Clean up any pending operations
      cleanupThrottling();
      cleanupRetry();
      
      resetGridProgress();
    };
  }, [cleanupThrottling, cleanupRetry]);
  
  /**
   * Create grid lines on the canvas
   * This is the main public API of this hook
   * 
   * @param {FabricCanvas} canvas - The Fabric.js canvas instance
   * @returns {FabricObject[]} Array of created grid objects
   */
  const createGridCallback = useCallback((canvas: FabricCanvas): FabricObject[] => {
    logger.debug("createGridCallback invoked with dimensions:", canvasDimensions);
    
    // Validate components before proceeding
    const validation = validateGridComponents(canvas, gridLayerRef);
    if (!validation.valid) {
      return [];
    }
    
    // Ensure gridLayerRef is initialized
    ensureGridLayerInitialized(gridLayerRef);
    
    // Check if we should throttle
    if (shouldThrottleCreation()) {
      return handleThrottledCreation(canvas, createGridWithRetry);
    }
    
    // If not throttled, proceed with normal creation with retry logic
    return createGridWithRetry(canvas);
    
  }, [
    canvasDimensions, 
    gridLayerRef, 
    shouldThrottleCreation, 
    handleThrottledCreation, 
    createGridWithRetry
  ]);

  return createGridCallback;
};
