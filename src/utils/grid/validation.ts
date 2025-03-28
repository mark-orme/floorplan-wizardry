
/**
 * Grid validation module
 * Validates grid components and dimensions for safe operations
 * @module grid/validation
 */
import { Canvas, Object as FabricObject } from "fabric";
import logger from "../logger";

/**
 * Validates that canvas is ready for grid creation
 * Performs essential checks on the canvas object
 * 
 * @param {Canvas} canvas - The Fabric canvas instance
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to grid objects
 * @param {{ width: number, height: number }} dimensions - Canvas dimensions
 * @returns {boolean} True if canvas is valid for grid creation
 */
export const validateCanvasForGrid = (
  canvas: Canvas,
  gridLayerRef: React.MutableRefObject<FabricObject[]>,
  dimensions: { width: number, height: number }
): boolean => {
  // Check if canvas exists
  if (!canvas) {
    logger.error("Cannot create grid: Canvas is null or undefined");
    return false;
  }
  
  // Check if gridLayerRef exists
  if (!gridLayerRef) {
    logger.error("Cannot create grid: Grid layer reference is null or undefined");
    return false;
  }
  
  // Check if canvas dimensions are valid
  if (!dimensions || !dimensions.width || !dimensions.height || 
      dimensions.width <= 0 || dimensions.height <= 0) {
    logger.error("Cannot create grid: Invalid canvas dimensions", dimensions);
    return false;
  }
  
  // Check if canvas has required methods
  if (typeof canvas.getWidth !== "function" || typeof canvas.getHeight !== "function") {
    logger.error("Cannot create grid: Canvas missing required methods");
    return false;
  }
  
  // Check if canvas width/height methods return valid values
  const canvasWidth = canvas.getWidth();
  const canvasHeight = canvas.getHeight();
  
  if (!canvasWidth || !canvasHeight || canvasWidth <= 0 || canvasHeight <= 0) {
    logger.error("Cannot create grid: Canvas reports invalid dimensions", {
      width: canvasWidth,
      height: canvasHeight
    });
    return false;
  }
  
  return true;
};
