
/**
 * Grid debugging utilities
 * Helps identify and resolve grid rendering issues
 * @module gridDebugUtils
 */
import { Canvas, Object as FabricObject } from "fabric";
import logger from "../logger";

/**
 * Dump grid state to console for debugging
 * @param canvas - The fabric canvas
 * @param gridLayerRef - Reference to grid objects
 */
export const dumpGridState = (
  canvas: Canvas | null,
  gridLayerRef: React.MutableRefObject<FabricObject[]> | null
): void => {
  // Print canvas information
  console.log("===== GRID DEBUG INFO =====");
  
  if (!canvas) {
    console.log("Canvas: NULL");
    return;
  }
  
  // Canvas dimensinos and state
  console.log("Canvas dimensions:", {
    width: canvas.getWidth(),
    height: canvas.getHeight(),
    clientWidth: canvas.getElement()?.clientWidth,
    clientHeight: canvas.getElement()?.clientHeight
  });
  
  console.log("Canvas state:", {
    objectCount: canvas.getObjects().length,
    isDrawingMode: canvas.isDrawingMode,
    initialized: (canvas as any).initialized || false
  });
  
  // Grid object information
  if (!gridLayerRef) {
    console.log("Grid layer reference: NULL");
    return;
  }
  
  // Check grid objects
  console.log("Grid objects:", {
    count: gridLayerRef.current.length,
    onCanvas: gridLayerRef.current.filter(obj => canvas.contains(obj)).length
  });
  
  // Sample a grid object if available
  if (gridLayerRef.current.length > 0) {
    const sampleObject = gridLayerRef.current[0];
    console.log("Sample grid object:", {
      type: sampleObject.type,
      visible: sampleObject.visible,
      selectable: sampleObject.selectable,
      stroke: (sampleObject as any).stroke
    });
  }
  
  console.log("=========================");
};

/**
 * Attempt to recover grid by recreating it with emergency measures
 * @param canvas - The fabric canvas
 * @param gridLayerRef - Reference to grid objects
 * @param createGridFn - Function to create grid
 * @returns Whether recovery was successful
 */
export const attemptGridRecovery = (
  canvas: Canvas | null,
  gridLayerRef: React.MutableRefObject<FabricObject[]>,
  createGridFn: (canvas: Canvas) => FabricObject[]
): boolean => {
  if (!canvas) {
    logger.error("Cannot recover grid: Canvas is null");
    return false;
  }
  
  try {
    // Clear any existing grid
    if (gridLayerRef.current.length > 0) {
      gridLayerRef.current.forEach(obj => {
        if (canvas.contains(obj)) {
          canvas.remove(obj);
        }
      });
      gridLayerRef.current = [];
    }
    
    // Create new grid
    const gridObjects = createGridFn(canvas);
    
    // Check success
    if (gridObjects && gridObjects.length > 0) {
      // Render canvas
      canvas.requestRenderAll();
      logger.info(`Grid recovery successful: Created ${gridObjects.length} objects`);
      return true;
    } else {
      logger.error("Grid recovery failed: No objects created");
      return false;
    }
  } catch (error) {
    logger.error("Error during grid recovery:", error);
    return false;
  }
};
