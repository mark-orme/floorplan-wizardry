
/**
 * Grid validation utilities
 * @module utils/grid/gridValidation
 */
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";

/**
 * Validate canvas for grid creation
 * @param {FabricCanvas} canvas - Canvas to validate
 * @returns {boolean} True if canvas is valid
 */
export const validateCanvas = (canvas: FabricCanvas): boolean => {
  if (!canvas) return false;
  
  try {
    // Check if canvas has valid dimensions
    const width = canvas.getWidth ? canvas.getWidth() : canvas.width;
    const height = canvas.getHeight ? canvas.getHeight() : canvas.height;
    
    return Boolean(width && height && width > 0 && height > 0);
  } catch (error) {
    console.error("Error validating canvas:", error);
    return false;
  }
};

/**
 * Validate grid state
 * @param {FabricCanvas} canvas - Canvas to validate
 * @param {FabricObject[]} gridObjects - Grid objects to validate
 * @returns {boolean} True if grid state is valid
 */
export const validateGridState = (canvas: FabricCanvas, gridObjects: FabricObject[]): boolean => {
  if (!canvas || !gridObjects || !Array.isArray(gridObjects)) return false;
  
  // Check if grid has objects
  if (gridObjects.length === 0) return false;
  
  // Check if grid objects are on canvas
  const objectsOnCanvas = gridObjects.filter(obj => canvas.contains(obj));
  
  return objectsOnCanvas.length > 0;
};
