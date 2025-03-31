
/**
 * Hook specifically for grid creation with robust error handling
 * @module hooks/grid/useGridCreation
 */
import { useCallback } from "react";
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { toast } from "sonner";
import logger from "@/utils/logger";
import { createGrid } from "@/utils/canvasGrid";

interface UseGridCreationProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  gridLayerRef: React.MutableRefObject<FabricObject[]>;
  gridInitializedRef: React.MutableRefObject<boolean>;
  lastGridCreationAttemptRef: React.MutableRefObject<number>;
}

/**
 * Hook for creating and managing canvas grid
 * Includes better error handling and recovery strategies
 */
export const useGridCreation = ({
  fabricCanvasRef,
  gridLayerRef,
  gridInitializedRef,
  lastGridCreationAttemptRef
}: UseGridCreationProps) => {
  /**
   * Create grid on canvas with robust error handling
   */
  const createCanvasGrid = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) {
      logger.warn("Cannot create grid: Canvas is null");
      return;
    }
    
    // Rate limit grid creation attempts
    const now = Date.now();
    if (now - lastGridCreationAttemptRef.current < 500) {
      logger.debug("Grid creation attempted too frequently, skipping");
      return;
    }
    
    lastGridCreationAttemptRef.current = now;
    
    // Check dimensions
    if (!canvas.width || !canvas.height || canvas.width === 0 || canvas.height === 0) {
      logger.error("Cannot create grid: Canvas has invalid dimensions", {
        width: canvas.width,
        height: canvas.height
      });
      return;
    }
    
    logger.info("Creating grid...", {
      width: canvas.width,
      height: canvas.height,
      isInitialized: gridInitializedRef.current
    });
    
    // Clear previous grid if it exists
    if (gridLayerRef.current.length > 0) {
      logger.info(`Clearing ${gridLayerRef.current.length} previous grid objects`);
      try {
        gridLayerRef.current.forEach(obj => {
          if (canvas.contains(obj)) {
            canvas.remove(obj);
          }
        });
        gridLayerRef.current = [];
      } catch (error) {
        logger.error("Error clearing previous grid:", error);
      }
    }
    
    // Create grid with error handling
    try {
      const gridObjects = createGrid(canvas, { debug: true });
      
      // Store grid objects and mark as initialized
      if (gridObjects && gridObjects.length > 0) {
        gridLayerRef.current = gridObjects;
        gridInitializedRef.current = true;
        logger.info(`Grid created successfully with ${gridObjects.length} objects`);
        
        // Send grid to back
        gridObjects.forEach(obj => {
          canvas.sendToBack(obj);
        });
        
        // Force render
        canvas.requestRenderAll();
      } else {
        logger.error("Grid creation failed: No grid objects created");
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      logger.error("Grid creation error:", errorMsg);
      console.error("Grid creation error:", error);
      
      // Only show toast on first failure
      if (!gridInitializedRef.current) {
        toast.error("Could not initialize grid");
      }
    }
  }, [fabricCanvasRef, gridLayerRef, gridInitializedRef, lastGridCreationAttemptRef]);

  return {
    createCanvasGrid
  };
};
