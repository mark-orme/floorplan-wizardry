
/**
 * Grid validation utilities
 * @module utils/grid/gridValidation
 */

import { Canvas, Object as FabricObject } from "fabric";
import { GRID_ERROR_MESSAGES } from "./errorTypes";
import logger from "@/utils/logger";

/**
 * Validate canvas for grid creation
 * @param {Canvas} canvas - The canvas to validate
 * @returns {string|null} Error message or null if valid
 */
export const validateCanvas = (canvas: Canvas): string | null => {
  if (!canvas) {
    return GRID_ERROR_MESSAGES.CANVAS_NULL;
  }
  
  if (!canvas.width || !canvas.height) {
    return GRID_ERROR_MESSAGES.CANVAS_INVALID;
  }
  
  return null;
};

/**
 * Validate grid state
 * @param {Canvas} canvas - The canvas to validate
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to grid objects
 * @returns {boolean} Whether grid state is valid
 */
export const validateGridState = (
  canvas: Canvas, 
  gridLayerRef: React.MutableRefObject<FabricObject[]>
): boolean => {
  // Check if canvas is valid
  if (!canvas) {
    logger.warn("Cannot validate grid state: Canvas is null");
    return false;
  }
  
  // Check if gridLayerRef exists and has grid objects
  if (!gridLayerRef || !gridLayerRef.current || gridLayerRef.current.length === 0) {
    logger.warn("Grid validation failed: No grid objects in reference");
    return false;
  }
  
  // Get all objects on canvas
  const canvasObjects = canvas.getObjects();
  
  // Check if any grid objects are on canvas
  const gridObjectsOnCanvas = canvasObjects.filter(obj => obj.objectType === 'grid');
  
  if (gridObjectsOnCanvas.length === 0) {
    logger.warn("Grid validation failed: No grid objects on canvas");
    return false;
  }
  
  // Check if at least some of the referenced grid objects are on canvas
  const refObjectsOnCanvas = gridLayerRef.current.filter(
    refObj => canvasObjects.some(canvasObj => canvasObj === refObj)
  );
  
  if (refObjectsOnCanvas.length === 0) {
    logger.warn("Grid validation failed: None of the referenced grid objects are on canvas");
    return false;
  }
  
  return true;
};

/**
 * Validate grid creation result
 * @param {FabricObject[]} createdGrid - Created grid objects
 * @param {Canvas} canvas - Canvas where grid was created
 * @returns {string|null} Error message or null if valid
 */
export const validateGrid = (
  createdGrid: FabricObject[],
  canvas: Canvas
): string | null => {
  // Check if grid was created
  if (!createdGrid || createdGrid.length === 0) {
    return GRID_ERROR_MESSAGES.GRID_EMPTY;
  }
  
  // Check if canvas is valid
  if (!canvas) {
    return GRID_ERROR_MESSAGES.CANVAS_NULL;
  }
  
  // Check if all grid objects are on canvas
  const canvasObjects = canvas.getObjects();
  const gridOnCanvas = createdGrid.every(gridObj => 
    canvasObjects.some(canvasObj => canvasObj === gridObj)
  );
  
  if (!gridOnCanvas) {
    return "Not all grid objects are on canvas";
  }
  
  return null;
};
