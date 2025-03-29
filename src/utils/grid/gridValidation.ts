
/**
 * Grid validation utilities
 * Functions for validating grid state and components
 * @module grid/gridValidation
 */
import { Canvas, Object as FabricObject } from "fabric";
import { throttledLog, throttledError } from "./consoleThrottling";

/**
 * Validate canvas for grid creation
 * Checks if canvas is ready for grid creation
 * 
 * @param {Canvas | null | undefined} canvas - The canvas to validate
 * @returns {boolean} Whether the canvas is valid
 */
export function validateCanvas(canvas: Canvas | null | undefined): boolean {
  if (!canvas) {
    throttledError("Cannot validate null canvas");
    return false;
  }
  
  if (!canvas.width || !canvas.height || canvas.width <= 0 || canvas.height <= 0) {
    throttledError("Canvas has invalid dimensions", { 
      width: canvas.width, 
      height: canvas.height 
    });
    return false;
  }
  
  return true;
}

/**
 * Check if grid objects are valid
 * 
 * @param {FabricObject[]} gridObjects - Grid objects to validate
 * @returns {boolean} Whether the grid objects are valid
 */
export function validateGridObjects(gridObjects: FabricObject[]): boolean {
  if (!Array.isArray(gridObjects)) {
    throttledError("Grid objects is not an array");
    return false;
  }
  
  if (gridObjects.length === 0) {
    throttledLog("Grid objects array is empty");
    return false;
  }
  
  // Check if all objects have the expected grid properties
  const allValid = gridObjects.every(obj => {
    return obj && typeof obj.name === 'string' && obj.name.startsWith('grid-');
  });
  
  if (!allValid) {
    throttledError("Some grid objects are invalid");
    return false;
  }
  
  return true;
}

/**
 * Validate the entire grid state
 * 
 * @param {Canvas} canvas - The canvas instance
 * @param {FabricObject[]} gridObjects - The grid objects
 * @returns {boolean} Whether the grid state is valid
 */
export function validateGridState(
  canvas: Canvas,
  gridObjects: FabricObject[]
): boolean {
  // First validate canvas
  if (!validateCanvas(canvas)) {
    return false;
  }
  
  // Then validate grid objects
  if (!validateGridObjects(gridObjects)) {
    return false;
  }
  
  // Check if grid objects exist on canvas
  const allOnCanvas = gridObjects.every(obj => canvas.contains(obj));
  
  if (!allOnCanvas) {
    throttledError("Some grid objects are not on canvas");
    return false;
  }
  
  return true;
}

/**
 * Count grid objects on canvas
 * 
 * @param {Canvas} canvas - The canvas instance
 * @returns {number} Number of grid objects on canvas
 */
export function countGridObjectsOnCanvas(canvas: Canvas): number {
  if (!validateCanvas(canvas)) {
    return 0;
  }
  
  let gridCount = 0;
  
  canvas.forEachObject(obj => {
    if (obj && typeof obj.name === 'string' && obj.name.startsWith('grid-')) {
      gridCount++;
    }
  });
  
  return gridCount;
}
