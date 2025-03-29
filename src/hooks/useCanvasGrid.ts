
/**
 * Grid management hook for canvas
 * Handles the creation and management of grid on canvas
 * @module useCanvasGrid
 */
import { useCallback, useEffect, useRef } from "react";
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { createCompleteGrid, createBasicEmergencyGrid } from "@/utils/gridCreationUtils";
import { arrangeGridElementsWithRetry } from "@/utils/useCanvasLayerOrdering";
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
  const lastGridCreationAttemptRef = useRef(0);
  
  /**
   * Create grid on the canvas with error handling
   */
  const createCanvasGrid = useCallback(() => {
    if (!fabricCanvasRef.current) {
      logger.warn("Cannot create grid: Canvas reference is null");
      return;
    }
    
    const canvas = fabricCanvasRef.current;
    
    // Throttle grid creation attempts
    const now = Date.now();
    if (now - lastGridCreationAttemptRef.current < 1000) {
      logger.debug("Grid creation throttled");
      return;
    }
    lastGridCreationAttemptRef.current = now;
    
    try {
      logger.info("Creating grid on canvas");
      console.log("Creating grid on canvas");
      
      // Check if canvas has valid dimensions
      if (!canvas.width || !canvas.height || canvas.width === 0 || canvas.height === 0) {
        logger.error("Grid creation failed: Canvas has zero dimensions");
        console.error("Grid creation failed: Canvas has zero dimensions", {
          width: canvas.width,
          height: canvas.height
        });
        return;
      }
      
      // Clear existing grid objects
      if (gridLayerRef.current.length > 0) {
        gridLayerRef.current.forEach(obj => {
          if (canvas.contains(obj)) {
            canvas.remove(obj);
          }
        });
        gridLayerRef.current = [];
      }
      
      // Create complete grid
      const gridObjects = createCompleteGrid(canvas);
      
      // If grid creation failed, try emergency grid
      if (!gridObjects || gridObjects.length === 0) {
        logger.warn("Complete grid creation failed, trying emergency grid");
        console.warn("Complete grid creation failed, trying emergency grid");
        
        const emergencyGrid = createBasicEmergencyGrid(canvas, gridLayerRef);
        if (emergencyGrid.length > 0) {
          gridInitializedRef.current = true;
          logger.info(`Created emergency grid with ${emergencyGrid.length} objects`);
          console.log(`Created emergency grid with ${emergencyGrid.length} objects`);
        } else {
          logger.error("Both regular and emergency grid creation failed");
          console.error("Both regular and emergency grid creation failed");
          toast.error("Failed to create grid. Please try refreshing the application.");
        }
      } else {
        // Store grid objects in the ref
        gridLayerRef.current = gridObjects;
        gridInitializedRef.current = true;
        
        // Log success
        logger.info(`Grid created with ${gridObjects.length} objects`);
        console.log(`Grid created with ${gridObjects.length} objects`);
        
        // Ensure proper ordering
        arrangeGridElementsWithRetry(canvas, gridLayerRef);
      }
      
      // Force render to ensure grid is visible
      canvas.requestRenderAll();
      
    } catch (error) {
      logger.error("Error creating grid:", error);
      console.error("Error creating grid:", error);
      
      // Try emergency grid on error
      try {
        if (fabricCanvasRef.current) {
          const emergencyGrid = createBasicEmergencyGrid(fabricCanvasRef.current, gridLayerRef);
          if (emergencyGrid.length > 0) {
            gridInitializedRef.current = true;
          }
        }
      } catch (emergencyError) {
        logger.error("Emergency grid creation also failed:", emergencyError);
        console.error("Emergency grid creation also failed:", emergencyError);
      }
    }
  }, [fabricCanvasRef]);
  
  // Create grid when canvas or dimensions change
  useEffect(() => {
    if (fabricCanvasRef.current && 
        canvasDimensions.width > 0 && 
        canvasDimensions.height > 0) {
      // Small delay to ensure canvas is fully initialized
      const timer = setTimeout(() => {
        createCanvasGrid();
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [
    fabricCanvasRef,
    canvasDimensions.width,
    canvasDimensions.height,
    createCanvasGrid
  ]);
  
  // Force grid recreation when zoom changes significantly
  useEffect(() => {
    if (gridInitializedRef.current && fabricCanvasRef.current) {
      // Only recreate grid on significant zoom changes
      if (zoomLevel <= 0.5 || zoomLevel >= 2) {
        createCanvasGrid();
      }
    }
  }, [zoomLevel, createCanvasGrid]);
  
  return {
    gridLayerRef,
    createGrid: createCanvasGrid,
    isGridInitialized: () => gridInitializedRef.current
  };
};
