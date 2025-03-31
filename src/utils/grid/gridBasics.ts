
/**
 * Grid basics utilities
 * @module utils/grid/gridBasics
 */

import { Canvas, Object as FabricObject } from "fabric";
import { GRID_ERROR_MESSAGES } from "./errorTypes";
import { createSimpleGrid } from "./gridRenderers";
import logger from "@/utils/logger";

/**
 * Create a basic grid
 * @param {Canvas} canvas - The fabric canvas instance
 * @param {number} [spacing=20] - Grid spacing in pixels
 * @returns {FabricObject[]} Created grid objects
 */
export const createBasicGrid = (
  canvas: Canvas, 
  spacing: number = 20
): FabricObject[] => {
  return createSimpleGrid(canvas, { spacing });
};

/**
 * Clear all grid objects from the canvas
 * @param {Canvas} canvas - The fabric canvas instance
 * @returns {number} Number of grid objects removed
 */
export const clearGrid = (canvas: Canvas): number => {
  if (!canvas) {
    logger.error(GRID_ERROR_MESSAGES.CANVAS_NULL);
    return 0;
  }
  
  // Find all grid objects
  const gridObjects = canvas.getObjects().filter(obj => obj.objectType === 'grid');
  
  // Remove them from the canvas
  gridObjects.forEach(obj => {
    canvas.remove(obj);
  });
  
  // Render the canvas
  canvas.renderAll();
  
  logger.info(`Cleared ${gridObjects.length} grid objects`);
  return gridObjects.length;
};

/**
 * Check if canvas is valid for grid creation
 * @param {Canvas | null} canvas - The fabric canvas instance
 * @returns {boolean} Whether the canvas is valid
 */
export const isCanvasValidForGrid = (canvas: Canvas | null): boolean => {
  if (!canvas) {
    return false;
  }
  
  // Check canvas dimensions
  if (!canvas.width || !canvas.height || canvas.width <= 0 || canvas.height <= 0) {
    return false;
  }
  
  return true;
};

/**
 * Reorder grid objects to be at the back of the canvas
 * @param {Canvas} canvas - The fabric canvas instance
 * @param {FabricObject[]} gridObjects - Grid objects to reorder
 * @returns {boolean} Whether reordering was successful
 */
export const reorderGridObjects = (
  canvas: Canvas, 
  gridObjects: FabricObject[]
): boolean => {
  if (!canvas) {
    logger.error(GRID_ERROR_MESSAGES.CANVAS_NULL);
    return false;
  }
  
  if (!gridObjects || gridObjects.length === 0) {
    logger.warn("No grid objects to reorder");
    return false;
  }
  
  try {
    // Send all grid objects to the back of the canvas
    gridObjects.forEach(obj => {
      if (canvas.contains(obj)) {
        canvas.sendObjectToBack(obj);
      }
    });
    
    // Render the canvas
    canvas.renderAll();
    
    logger.info(`Reordered ${gridObjects.length} grid objects to back`);
    return true;
  } catch (error) {
    logger.error("Error reordering grid objects:", error);
    return false;
  }
};
