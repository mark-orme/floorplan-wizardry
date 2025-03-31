
/**
 * Simple grid creator
 * Provides simplified grid creation functions
 * @module utils/grid/simpleGridCreator
 */

import { Canvas, Object as FabricObject } from "fabric";
import { GRID_ERROR_MESSAGES } from "./errorTypes";
import { createSimpleGrid } from "./gridRenderers";
import { isCanvasValidForGrid } from "./gridBasics";
import logger from "@/utils/logger";

/**
 * Create a reliable grid
 * Handles edge cases and ensures grid is created properly
 * 
 * @param {Canvas} canvas - The fabric canvas instance
 * @param {number} [spacing=20] - Grid spacing in pixels
 * @returns {FabricObject[]} Created grid objects
 */
export const createReliableGrid = (
  canvas: Canvas, 
  spacing: number = 20
): FabricObject[] => {
  if (!canvas) {
    logger.error(GRID_ERROR_MESSAGES.CANVAS_NULL);
    return [];
  }
  
  if (!isCanvasValidForGrid(canvas)) {
    logger.error(GRID_ERROR_MESSAGES.CANVAS_INVALID);
    return [];
  }
  
  try {
    // Clear any existing grid
    const existingGridObjects = canvas.getObjects().filter(obj => obj.objectType === 'grid');
    existingGridObjects.forEach(obj => canvas.remove(obj));
    
    // Create new grid
    const gridObjects = createSimpleGrid(canvas, { spacing });
    
    logger.info(`Created reliable grid with ${gridObjects.length} objects`);
    return gridObjects;
  } catch (error) {
    logger.error("Error creating reliable grid:", error);
    return [];
  }
};

/**
 * Ensure grid visibility
 * Makes sure grid objects are visible and properly ordered
 * 
 * @param {Canvas} canvas - The fabric canvas instance
 * @param {FabricObject[]} gridObjects - Grid objects to ensure visibility for
 * @returns {boolean} Whether the operation was successful
 */
export const ensureGridVisibility = (
  canvas: Canvas, 
  gridObjects: FabricObject[]
): boolean => {
  if (!canvas) {
    logger.error(GRID_ERROR_MESSAGES.GRID_VISIBILITY_FAILED, {
      reason: GRID_ERROR_MESSAGES.CANVAS_NULL
    });
    return false;
  }
  
  if (!gridObjects || gridObjects.length === 0) {
    logger.warn(GRID_ERROR_MESSAGES.GRID_VISIBILITY_FAILED, {
      reason: GRID_ERROR_MESSAGES.GRID_EMPTY
    });
    return false;
  }
  
  try {
    // Check if grid objects are on canvas
    const canvasObjects = canvas.getObjects();
    const gridObjectsOnCanvas = gridObjects.filter(
      gridObj => canvasObjects.some(canvasObj => canvasObj === gridObj)
    );
    
    // If no grid objects are on canvas, re-add them
    if (gridObjectsOnCanvas.length === 0) {
      logger.warn("No grid objects are on canvas, re-adding them");
      
      gridObjects.forEach(obj => {
        if (!canvas.contains(obj)) {
          canvas.add(obj);
        }
      });
    }
    
    // Send grid objects to back
    gridObjects.forEach(obj => {
      if (canvas.contains(obj)) {
        canvas.sendObjectToBack(obj);
      }
    });
    
    // Update grid opacity to ensure visibility
    gridObjects.forEach(obj => {
      if (obj.opacity !== 1) {
        obj.opacity = 1;
      }
    });
    
    // Render canvas
    canvas.renderAll();
    
    logger.info(`Ensured visibility for ${gridObjects.length} grid objects`);
    return true;
  } catch (error) {
    logger.error(GRID_ERROR_MESSAGES.GRID_VISIBILITY_FAILED, error);
    return false;
  }
};
