
/**
 * Hook for handling canvas dimension changes
 * @module grid-management/useDimensionChangeHandler
 */
import { useEffect } from "react";
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import logger from "@/utils/logger";

/**
 * Props for the useDimensionChangeHandler hook
 * @interface UseDimensionChangeHandlerProps
 */
interface UseDimensionChangeHandlerProps {
  /** Current canvas dimensions */
  canvasDimensions: { width: number; height: number };
  /** Reference to Fabric canvas */
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  /** Reference to grid layer objects */
  gridLayerRef: React.MutableRefObject<FabricObject[]>;
  /** Function to create grid elements */
  createGrid: (canvas: FabricCanvas) => FabricObject[];
  /** Timestamp of last creation attempt */
  lastAttemptTime: number;
  /** Function to update last attempt timestamp */
  updateLastAttemptTime: (time: number) => void;
}

/**
 * Hook for handling dimension changes and grid recreation
 * @param {UseDimensionChangeHandlerProps} props - Hook properties
 * @returns {void}
 */
export const useDimensionChangeHandler = ({
  canvasDimensions,
  fabricCanvasRef,
  gridLayerRef,
  createGrid,
  lastAttemptTime,
  updateLastAttemptTime
}: UseDimensionChangeHandlerProps): void => {
  // Update grid when canvas dimensions change
  useEffect(() => {
    // Skip if dimensions are zero or invalid
    if (!canvasDimensions.width || !canvasDimensions.height || 
        canvasDimensions.width <= 0 || canvasDimensions.height <= 0) {
      return;
    }
    
    // Skip if canvas not yet initialized
    if (!fabricCanvasRef.current) {
      return;
    }
    
    logger.info("Canvas dimensions changed, updating grid");
    
    const now = Date.now();
    
    // Rate limit grid creation (at most once per second)
    if (now - lastAttemptTime < 1000) {
      logger.debug("Skipping grid creation - throttled");
      return;
    }
    
    // Update timestamp
    updateLastAttemptTime(now);
    
    // Remove old grid objects
    if (gridLayerRef.current.length > 0) {
      logger.debug(`Removing ${gridLayerRef.current.length} old grid objects`);
      
      // Get canvas instance
      const canvas = fabricCanvasRef.current;
      
      // Remove each grid object
      gridLayerRef.current.forEach(obj => {
        if (canvas && canvas.contains(obj)) {
          canvas.remove(obj);
        }
      });
      
      // Clear reference
      gridLayerRef.current = [];
    }
    
    // Create new grid with updated dimensions
    if (fabricCanvasRef.current) {
      try {
        const canvas = fabricCanvasRef.current;
        
        // Ensure canvas dimensions are updated
        if (canvas.width !== canvasDimensions.width || 
            canvas.height !== canvasDimensions.height) {
          canvas.setDimensions({
            width: canvasDimensions.width,
            height: canvasDimensions.height
          });
        }
        
        // Create new grid
        const newGridObjects = createGrid(canvas);
        gridLayerRef.current = newGridObjects;
        
        logger.info(`Created ${newGridObjects.length} new grid objects after dimension change`);
      } catch (error) {
        logger.error("Error creating grid after dimension change:", error);
      }
    }
  }, [
    canvasDimensions.width, 
    canvasDimensions.height, 
    fabricCanvasRef, 
    gridLayerRef,
    createGrid,
    lastAttemptTime,
    updateLastAttemptTime
  ]);
};
