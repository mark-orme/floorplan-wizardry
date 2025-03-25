
/**
 * Grid validation module
 * Provides validation functions for grid creation
 * @module gridValidation
 */
import { Canvas } from "fabric";
import { gridManager, shouldThrottleCreation } from "../gridManager";
import logger from "../logger";

/**
 * Validates the canvas and dimensions for grid creation
 * Ensures all required parameters are valid before proceeding
 * 
 * @param {Canvas} canvas - The Fabric canvas instance
 * @param {React.MutableRefObject<any[]>} gridLayerRef - Reference to store grid objects
 * @param {{ width: number, height: number }} canvasDimensions - Current canvas dimensions
 * @returns {boolean} Whether validation passes
 */
export const validateCanvasForGrid = (
  canvas: Canvas | null,
  gridLayerRef: React.MutableRefObject<any[]> | null,
  canvasDimensions: { width: number, height: number }
): boolean => {
  // Basic validation
  if (!canvas) {
    if (process.env.NODE_ENV === 'development') {
      logger.error("Canvas is null in grid validation");
    }
    return false;
  }
  
  if (!gridLayerRef) {
    if (process.env.NODE_ENV === 'development') {
      logger.error("gridLayerRef is null in grid validation");
    }
    return false;
  }

  // Ensure valid dimensions
  if (!canvasDimensions.width || !canvasDimensions.height || 
      canvasDimensions.width <= 0 || canvasDimensions.height <= 0) {
    if (process.env.NODE_ENV === 'development') {
      logger.error("Invalid dimensions in grid validation:", canvasDimensions);
    }
    return false;
  }
  
  // Check if we should throttle
  if (shouldThrottleCreation()) {
    if (process.env.NODE_ENV === 'development') {
      logger.warn("Throttling grid creation due to too many recent attempts");
    }
    return false;
  }
  
  return true;
};

/**
 * Check if the current grid creation state allows proceeding
 * Verifies that creation is not in progress and throttling is not active
 * 
 * @returns {boolean} Whether grid creation can proceed
 */
export const canProceedWithGridCreation = (): boolean => {
  // Check if creation is already in progress
  if (gridManager.creationInProgress) {
    if (process.env.NODE_ENV === 'development') {
      logger.log("Grid creation already in progress, cannot proceed");
    }
    return false;
  }
  
  // Check if we need to throttle
  if (shouldThrottleCreation()) {
    if (process.env.NODE_ENV === 'development') {
      logger.log("Grid creation throttled, cannot proceed");
    }
    return false;
  }
  
  return true;
};
