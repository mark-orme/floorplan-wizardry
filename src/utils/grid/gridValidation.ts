
/**
 * Grid validation module
 * Validates grid components and dimensions for safe operations
 * @module grid/gridValidation
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

/**
 * Validate grid points are within valid range
 * Ensures grid points won't cause performance issues
 * 
 * @param {number} startX - Starting X coordinate
 * @param {number} endX - Ending X coordinate
 * @param {number} startY - Starting Y coordinate
 * @param {number} endY - Ending Y coordinate
 * @param {number} spacing - Grid line spacing
 * @param {number} maxLines - Maximum number of lines to create
 * @returns {boolean} True if grid points are valid
 */
export const validateGridPoints = (
  startX: number,
  endX: number,
  startY: number,
  endY: number,
  spacing: number,
  maxLines: number
): boolean => {
  // Check if spacing is valid
  if (!spacing || spacing <= 0) {
    logger.error("Invalid grid spacing:", spacing);
    return false;
  }
  
  // Calculate number of lines
  const horizontalLines = Math.ceil((endY - startY) / spacing);
  const verticalLines = Math.ceil((endX - startX) / spacing);
  
  // Check if we'll exceed maximum line count
  if (horizontalLines > maxLines || verticalLines > maxLines) {
    logger.warn(`Too many grid lines: ${horizontalLines} horizontal, ${verticalLines} vertical. Max: ${maxLines}`);
    return false;
  }
  
  // Check for unreasonable values that might cause performance issues
  if (endX - startX > 10000 || endY - startY > 10000) {
    logger.warn("Grid dimensions too large, may cause performance issues");
    return false;
  }
  
  return true;
};

/**
 * Check if grid needs to be recreated based on dimension changes
 * 
 * @param {Canvas} canvas - The Fabric canvas instance
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to grid objects
 * @param {{ width: number, height: number }} newDimensions - New canvas dimensions
 * @returns {boolean} True if grid should be recreated
 */
export const shouldRecreateGrid = (
  canvas: Canvas,
  gridLayerRef: React.MutableRefObject<FabricObject[]>,
  newDimensions: { width: number, height: number }
): boolean => {
  if (!gridLayerRef || !gridLayerRef.current || gridLayerRef.current.length === 0) {
    return true;
  }
  
  // Check if any grid object exists and has stored dimensions
  const firstGridObject = gridLayerRef.current[0];
  if (!firstGridObject) {
    return true;
  }
  
  // Get stored dimensions from grid object
  const storedDimensions = (firstGridObject as any).gridDimensions;
  if (!storedDimensions) {
    return true;
  }
  
  // Check if dimensions have changed significantly (more than 10%)
  const widthChange = Math.abs(storedDimensions.width - newDimensions.width) / storedDimensions.width;
  const heightChange = Math.abs(storedDimensions.height - newDimensions.height) / storedDimensions.height;
  
  return widthChange > 0.1 || heightChange > 0.1;
};
