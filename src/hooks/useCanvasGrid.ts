
/**
 * Grid management hook for canvas
 * Handles the creation and management of grid on canvas
 * @module useCanvasGrid
 */
import { useCallback, useEffect, useRef } from "react";
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { useGridThrottling } from "./grid/useGridThrottling";
import { useGridValidation } from "./grid/useGridValidation";
import { useGridRetry } from "./grid/useGridRetry";
import { useCanvasUtilities } from "./useCanvasUtilities";
import { createSmallScaleGrid, createLargeScaleGrid } from "@/utils/grid/gridCreation";
import logger from "@/utils/logger";
import { toast } from "sonner";

interface UseCanvasGridProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  canvasDimensions: { width: number; height: number };
  zoomLevel?: number;
}

/**
 * Hook for managing canvas grid
 * Creates and maintains the grid lines on the canvas
 * 
 * @param {UseCanvasGridProps} props - Hook properties
 * @returns {Object} Grid management functions and references
 */
export const useCanvasGrid = ({
  fabricCanvasRef,
  canvasDimensions,
  zoomLevel = 1
}: UseCanvasGridProps) => {
  const gridLayerRef = useRef<FabricObject[]>([]);
  const gridInitializedRef = useRef(false);
  
  // Use specialized grid hooks
  const { shouldThrottleCreation, handleThrottledCreation, cleanup: cleanupThrottling } = useGridThrottling();
  const { validateGridComponents, ensureGridLayerInitialized } = useGridValidation();
  const { scheduleRetry, cancelRetry, resetRetryState } = useGridRetry();
  
  // Use our new canvas utilities
  const { safeCanvasOperation, isCanvasReady } = useCanvasUtilities({ fabricCanvasRef });
  
  /**
   * Create grid on the canvas with error handling
   */
  const createCanvasGrid = useCallback(() => {
    if (!fabricCanvasRef.current) {
      logger.warn("Cannot create grid: Canvas reference is null");
      return;
    }
    
    if (shouldThrottleCreation()) {
      handleThrottledCreation();
      return;
    }
    
    if (!validateGridComponents()) {
      logger.error("Grid component validation failed");
      return;
    }
    
    // Check if canvas is ready
    if (!isCanvasReady(fabricCanvasRef.current)) {
      logger.warn("Canvas is not ready for grid creation");
      scheduleRetry(() => createCanvasGrid());
      return;
    }
    
    // Use safeCanvasOperation to handle creation with error handling
    safeCanvasOperation(
      fabricCanvasRef.current,
      () => {
        const canvas = fabricCanvasRef.current!;
        
        // Clear existing grid objects
        if (gridLayerRef.current.length > 0) {
          gridLayerRef.current.forEach(obj => {
            if (canvas.contains(obj)) {
              canvas.remove(obj);
            }
          });
          gridLayerRef.current = [];
        }
        
        const width = canvasDimensions.width;
        const height = canvasDimensions.height;
        
        // Create small and large grid lines - using only 2 arguments now
        const smallGridObjects = createSmallScaleGrid(canvas, {
          color: '#e0e0e0',
          width: 0.5,
          selectable: false,
          type: 'small'
        });
        
        const largeGridObjects = createLargeScaleGrid(canvas, {
          color: '#b0b0b0',
          width: 1,
          selectable: false,
          type: 'large'
        });
        
        // Add all objects to the grid layer reference
        gridLayerRef.current = [...smallGridObjects, ...largeGridObjects];
        
        // Set grid as initialized
        gridInitializedRef.current = true;
        
        // Render the canvas
        canvas.renderAll();
      },
      "Grid creation failed, will retry"
    );
  }, [
    fabricCanvasRef, 
    canvasDimensions, 
    shouldThrottleCreation, 
    handleThrottledCreation, 
    validateGridComponents,
    isCanvasReady,
    scheduleRetry,
    safeCanvasOperation
  ]);
  
  // Create grid when canvas or dimensions change
  useEffect(() => {
    if (fabricCanvasRef.current && canvasDimensions.width > 0 && canvasDimensions.height > 0) {
      createCanvasGrid();
    }
    
    return () => {
      cancelRetry();
      cleanupThrottling();
    };
  }, [
    fabricCanvasRef, 
    canvasDimensions.width, 
    canvasDimensions.height, 
    createCanvasGrid,
    cancelRetry,
    cleanupThrottling
  ]);
  
  return {
    gridLayerRef,
    createGrid: createCanvasGrid,
    isGridInitialized: () => gridInitializedRef.current
  };
};
