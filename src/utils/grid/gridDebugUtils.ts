
/**
 * Grid debugging utilities
 * @module utils/grid/gridDebugUtils
 */
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import logger from "@/utils/logger";
import { createBasicEmergencyGrid } from "../gridCreationUtils";

/**
 * Dump grid state to console
 * 
 * @param {FabricCanvas} canvas - The Fabric.js canvas instance
 * @param {FabricObject[]} gridObjects - Array of grid objects
 * @returns {object} Grid state diagnostics
 */
export const dumpGridState = (
  canvas: FabricCanvas | null,
  gridObjects: FabricObject[]
): Record<string, any> => {
  if (!canvas) {
    const result = { hasCanvas: false, gridExists: false };
    logger.warn("Cannot dump grid state: Canvas is null", result);
    return result;
  }
  
  const state = {
    hasCanvas: true,
    canvasDimensions: { width: canvas.width, height: canvas.height },
    gridObjects: gridObjects.length,
    canvasObjects: canvas.getObjects().length,
    gridObjectsOnCanvas: 0,
    visibleObjects: 0
  };
  
  // Count grid objects on canvas
  const canvasObjects = canvas.getObjects();
  
  state.gridObjectsOnCanvas = gridObjects.filter(obj => 
    canvasObjects.includes(obj)
  ).length;
  
  state.visibleObjects = gridObjects.filter(obj => 
    obj.visible && canvasObjects.includes(obj)
  ).length;
  
  logger.info("Grid state diagnostics:", state);
  console.log("Grid state diagnostics:", state);
  
  return state;
};

/**
 * Force create grid
 * 
 * @param {FabricCanvas} canvas - The Fabric.js canvas instance
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to grid objects
 * @returns {FabricObject[]} Created grid objects
 */
export const forceCreateGrid = (
  canvas: FabricCanvas,
  gridLayerRef: React.MutableRefObject<FabricObject[]>
): FabricObject[] => {
  try {
    logger.info("Force creating grid");
    
    // Clear existing grid
    gridLayerRef.current.forEach(obj => {
      if (canvas.contains(obj)) {
        canvas.remove(obj);
      }
    });
    
    // Create new grid
    const gridObjects = createBasicEmergencyGrid(canvas);
    
    // Store grid objects in ref
    gridLayerRef.current = gridObjects;
    
    canvas.requestRenderAll();
    
    logger.info(`Force created grid with ${gridObjects.length} objects`);
    return gridObjects;
  } catch (error) {
    logger.error("Error force creating grid:", error);
    return [];
  }
};
