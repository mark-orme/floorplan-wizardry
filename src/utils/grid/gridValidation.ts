
/**
 * Grid validation utilities
 * @module grid/gridValidation
 */

import { Canvas } from "fabric";
import logger from "../logger";

/**
 * Validate canvas for grid creation
 * Ensures the canvas is in a valid state for creating a grid
 * 
 * @param {Canvas} canvas - Canvas to validate
 * @returns {boolean} Whether canvas is valid
 */
export const validateCanvas = (canvas: Canvas): boolean => {
  // Check if canvas exists
  if (!canvas) {
    logger.error("Canvas validation failed: No canvas provided");
    console.error("Canvas validation failed: No canvas provided");
    return false;
  }
  
  // Check if canvas has valid dimensions
  if (!canvas.width || !canvas.height || canvas.width <= 0 || canvas.height <= 0) {
    logger.error(`Canvas validation failed: Invalid dimensions (${canvas.width}x${canvas.height})`);
    console.error(`Canvas validation failed: Invalid dimensions (${canvas.width}x${canvas.height})`);
    return false;
  }
  
  // Check if canvas is disposed - using correct property 'disposed' instead of 'isDisposed'
  if (canvas.disposed) {
    logger.error("Canvas validation failed: Canvas is disposed");
    console.error("Canvas validation failed: Canvas is disposed");
    return false;
  }
  
  return true;
};

/**
 * Validate grid state
 * Checks if grid objects are correctly attached to the canvas
 * 
 * @param {Canvas} canvas - Canvas to check
 * @param {Array} gridObjects - Grid objects to validate
 * @returns {Object} Validation result
 */
export const validateGridState = (canvas: Canvas, gridObjects: any[]): { 
  valid: boolean; 
  onCanvas: number; 
  missing: number;
  details: string;
} => {
  if (!canvas || !gridObjects) {
    return { 
      valid: false, 
      onCanvas: 0, 
      missing: 0,
      details: "Invalid canvas or grid objects"
    };
  }
  
  // Count objects on canvas
  const onCanvas = gridObjects.filter(obj => obj && canvas.contains(obj)).length;
  const missing = gridObjects.length - onCanvas;
  
  // Grid is valid if at least 90% of objects are on canvas
  const valid = onCanvas >= gridObjects.length * 0.9;
  
  return {
    valid,
    onCanvas,
    missing,
    details: `Grid has ${onCanvas}/${gridObjects.length} objects on canvas`
  };
};
