
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
  const { safeCanvasOperation, isCanvasReady } = useCanvasUtilities();
  
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
        
        // Create small and large grid lines
        const smallGridObjects = createSmallScaleGrid(canvas, width, height);
        const largeGridObjects = createLargeScaleGrid(canvas, width, height);
        
        // Add all objects to the canvas
        [...smallGridObjects, ...largeGridObjects].forEach(obj => {
          canvas.add(obj);
        });
        
        // Order the grid - small grid at back, large grid in front
        smallGridObjects.forEach(obj => canvas.sendObjectToBack(obj));
        
        // Store all grid objects in the ref
        gridLayerRef.current = [...smallGridObjects, ...largeGridObjects];
        
        // Update initialization state
        gridInitializedRef.current = true;
        
        // Force a canvas render
        canvas.requestRenderAll();
        
        logger.info(`Grid created with ${gridLayerRef.current.length} objects`);
      },
      "Failed to create grid"
    ) || scheduleRetry(() => createCanvasGrid()); // Schedule retry if operation failed
  }, [
    fabricCanvasRef, 
    canvasDimensions, 
    shouldThrottleCreation, 
    handleThrottledCreation, 
    validateGridComponents,
    safeCanvasOperation,
    isCanvasReady,
    scheduleRetry
  ]);
  
  /**
   * Update grid visibility based on zoom level
   */
  const updateGridVisibility = useCallback(() => {
    if (!fabricCanvasRef.current || gridLayerRef.current.length === 0) return;
    
    safeCanvasOperation(
      fabricCanvasRef.current,
      () => {
        const canvas = fabricCanvasRef.current!;
        
        // Filter grid objects by type
        const smallGridLines = gridLayerRef.current.filter(obj => 
          obj.type === 'line' && obj.strokeWidth && obj.strokeWidth < 1
        );
        
        const largeGridLines = gridLayerRef.current.filter(obj => 
          obj.type === 'line' && obj.strokeWidth && obj.strokeWidth >= 1
        );
        
        // Show/hide small grid based on zoom level
        const showSmallGrid = zoomLevel >= 0.8;
        
        smallGridLines.forEach(line => {
          line.visible = showSmallGrid;
        });
        
        // Always show large grid
        largeGridLines.forEach(line => {
          line.visible = true;
        });
        
        // Render the changes
        canvas.requestRenderAll();
      },
      "Failed to update grid visibility"
    );
  }, [fabricCanvasRef, zoomLevel, safeCanvasOperation]);
  
  // Create grid when canvas or dimensions change
  useEffect(() => {
    ensureGridLayerInitialized();
    
    if (fabricCanvasRef.current && !gridInitializedRef.current) {
      createCanvasGrid();
    }
  }, [fabricCanvasRef, createCanvasGrid, ensureGridLayerInitialized]);
  
  // Update grid when dimensions change
  useEffect(() => {
    if (fabricCanvasRef.current && gridInitializedRef.current) {
      createCanvasGrid();
    }
  }, [canvasDimensions, createCanvasGrid]);
  
  // Update grid visibility when zoom changes
  useEffect(() => {
    updateGridVisibility();
  }, [zoomLevel, updateGridVisibility]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      resetRetryState();
      cancelRetry();
      cleanupThrottling();
      
      // Remove grid objects from canvas if canvas ref is still valid
      if (fabricCanvasRef.current) {
        gridLayerRef.current.forEach(obj => {
          if (fabricCanvasRef.current?.contains(obj)) {
            fabricCanvasRef.current.remove(obj);
          }
        });
      }
      gridLayerRef.current = [];
    };
  }, [fabricCanvasRef, cancelRetry, resetRetryState, cleanupThrottling]);
  
  return {
    gridLayerRef,
    createGrid: createCanvasGrid,
    updateGridVisibility,
    isGridInitialized: gridInitializedRef.current
  };
};
