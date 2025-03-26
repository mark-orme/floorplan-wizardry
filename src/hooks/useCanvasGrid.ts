
/**
 * Custom hook for grid management
 * Handles grid creation, caching, and lifecycle management
 * @module useCanvasGrid
 */
import { useCallback, useEffect } from "react";
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { resetGridProgress } from "@/utils/gridManager";
import { CanvasDimensions } from "@/types/drawingTypes";
import { DebugInfoState } from "@/types/debugTypes";
import logger from "@/utils/logger";

// Import refactored grid hooks
import { useGridCreation } from "./grid/useGridCreation";
import { useGridRetry } from "./grid/useGridRetry";
import { useGridThrottling } from "./grid/useGridThrottling";
import { useGridValidation } from "./grid/useGridValidation";
import { useGridSafety } from "./grid/useGridSafety";

/**
 * Type for grid creation callback function
 */
export type GridCreationCallback = (canvas: FabricCanvas) => FabricObject[];

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
  // Use grid validation hook
  const { 
    validateGridComponents, 
    ensureGridLayerInitialized 
  } = useGridValidation({ 
    setDebugInfo 
  });
  
  // Use grid safety hook
  const { safeGridOperation } = useGridSafety();
  
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
    
    // PATCH 2: Add additional validation for canvas
    if (!canvas) {
      logger.error("createGrid: Canvas is null or undefined");
      return gridLayerRef.current;
    }
    
    // Extra Validation: Check if canvas has required methods
    if (typeof canvas.getWidth !== "function" || typeof canvas.getHeight !== "function") {
      logger.error("🛑 createGrid: Invalid canvas instance - missing getWidth/getHeight methods");
      return gridLayerRef.current;
    }
    
    // PATCH 2: Check for valid dimensions
    const canvasWidth = canvas.getWidth() || canvas.width;
    const canvasHeight = canvas.getHeight() || canvas.height;
    
    if (!canvasWidth || !canvasHeight || canvasWidth === 0 || canvasHeight === 0) {
      logger.warn("createGrid: Canvas has zero width/height — skipping grid creation", {
        width: canvasWidth,
        height: canvasHeight
      });
      return gridLayerRef.current;
    }
    
    return safeGridOperation(() => {
      try {
        // Validate components before proceeding
        if (!validateGridComponents(canvas, gridLayerRef)) {
          return gridLayerRef.current;
        }
        
        // Ensure gridLayerRef is initialized
        ensureGridLayerInitialized(gridLayerRef);
        
        // Check if we should throttle
        if (shouldThrottleCreation()) {
          return handleThrottledCreation(canvas, createGridWithRetry);
        }
        
        // If not throttled, proceed with normal creation with retry logic
        const gridObjects = createGridWithRetry(canvas);
        
        // PATCH 3: Force render after grid creation
        if (gridObjects.length > 0) {
          logger.info(`Grid created with ${gridObjects.length} objects, forcing render`);
          canvas.requestRenderAll();
        }
        
        return gridObjects;
      } catch (error) {
        logger.error("Error in grid creation:", error);
        setHasError(true);
        setErrorMessage("Error creating grid: " + (error instanceof Error ? error.message : String(error)));
        return gridLayerRef.current;
      }
    }, 'create-grid', gridLayerRef.current);
    
  }, [
    canvasDimensions, 
    gridLayerRef, 
    validateGridComponents,
    ensureGridLayerInitialized,
    shouldThrottleCreation, 
    handleThrottledCreation, 
    createGridWithRetry,
    safeGridOperation,
    setHasError,
    setErrorMessage
  ]);

  return createGridCallback;
};
