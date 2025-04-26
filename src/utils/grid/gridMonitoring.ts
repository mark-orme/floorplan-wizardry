
/**
 * Grid monitoring utilities
 * Monitors and repairs grid when issues occur
 * @module grid/gridMonitoring
 */
import { Canvas, Object as FabricObject } from "fabric";
import logger from "../logger";
import { createBasicEmergencyGrid } from "../gridCreationUtils";
import { toast } from "sonner";

// Define interface for grid status result
interface GridStatus {
  gridObjectCount: number;
  objectsOnCanvas: number;
  percentOnCanvas: number;
  status: 'ok' | 'degraded' | 'error';
  needsRepair: boolean;
}

/**
 * Force grid repair
 * @param canvas Canvas to repair
 * @param gridLayerRef Reference to grid objects
 * @returns Success status
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
 * @param canvas Canvas to check
 * @param gridLayerRef Reference to grid objects
 * @returns Grid status
 */
export const checkGridImmediately = (
  canvas: Canvas, 
  gridLayerRef: React.MutableRefObject<FabricObject[]>
): GridStatus => {
  if (!canvas) {
    return { 
      status: 'error', 
      message: 'Canvas not available',
      gridObjectCount: 0,
      objectsOnCanvas: 0,
      percentOnCanvas: 0,
      needsRepair: false
    };
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
 * @param canvas Canvas to monitor
 * @param gridLayerRef Reference to grid objects
 * @returns Cleanup function
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
