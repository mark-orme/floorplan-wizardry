
/**
 * Grid monitoring utilities
 * Monitors and repairs grid when issues occur
 * @module grid/gridMonitoring
 */
import { Canvas, Object as FabricObject } from "fabric";
import logger from "../logger";
import { handleGridCreationError } from "./errorHandling";
import { toast } from "sonner";
import { createBasicEmergencyGrid } from "../gridCreationUtils";

/**
 * Force grid repair
 * @param {Canvas} canvas - Canvas to repair
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to grid objects
 * @returns {boolean} Success status
 */
export const forceGridRepair = (
  canvas: Canvas, 
  gridLayerRef: React.MutableRefObject<FabricObject[]>
): boolean => {
  try {
    logger.info("Forcing grid repair");
    
    // Remove existing grid objects
    if (gridLayerRef.current.length > 0) {
      gridLayerRef.current.forEach(obj => {
        try {
          if (canvas.contains(obj)) {
            canvas.remove(obj);
          }
        } catch (error) {
          // Ignore errors when removing objects
        }
      });
      gridLayerRef.current = [];
    }
    
    // Create new grid
    const newGrid = createBasicEmergencyGrid(canvas);
    
    // Store in reference
    gridLayerRef.current = newGrid;
    
    // Force render
    canvas.requestRenderAll();
    
    logger.info(`Grid repaired with ${newGrid.length} objects`);
    return true;
  } catch (error) {
    logger.error("Grid repair failed:", error);
    return false;
  }
};

/**
 * Check grid immediately
 * @param {Canvas} canvas - Canvas to check
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to grid objects
 * @returns {Object} Grid status
 */
export const checkGridImmediately = (
  canvas: Canvas, 
  gridLayerRef: React.MutableRefObject<FabricObject[]>
): Record<string, any> => {
  if (!canvas) {
    return { status: 'error', message: 'Canvas not available' };
  }
  
  const gridObjects = gridLayerRef.current;
  const gridObjectCount = gridObjects.length;
  const objectsOnCanvas = gridObjects.filter(obj => canvas.contains(obj)).length;
  
  const status = {
    gridObjectCount,
    objectsOnCanvas,
    percentOnCanvas: gridObjectCount > 0 ? Math.round((objectsOnCanvas / gridObjectCount) * 100) : 0,
    status: objectsOnCanvas === gridObjectCount ? 'ok' : 'degraded',
    needsRepair: objectsOnCanvas < gridObjectCount
  };
  
  if (status.needsRepair) {
    logger.warn("Grid check found issues", status);
  }
  
  return status;
};

/**
 * Setup grid monitoring
 * @param {Canvas} canvas - Canvas to monitor
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to grid objects
 * @returns {Function} Cleanup function
 */
export const setupGridMonitoring = (
  canvas: Canvas, 
  gridLayerRef: React.MutableRefObject<FabricObject[]>
): () => void => {
  logger.info("Setting up grid monitoring");
  
  // Check grid initially
  checkGridImmediately(canvas, gridLayerRef);
  
  // Set up monitoring interval
  const intervalId = setInterval(() => {
    const status = checkGridImmediately(canvas, gridLayerRef);
    
    // If grid needs repair
    if (status.needsRepair && status.objectsOnCanvas === 0) {
      logger.warn("Grid monitoring found missing grid, repairing");
      forceGridRepair(canvas, gridLayerRef);
      toast.info("Grid has been repaired");
    }
  }, 10000); // Check every 10 seconds
  
  // Return cleanup function
  return () => {
    clearInterval(intervalId);
  };
};
