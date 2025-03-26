
/**
 * Fabric canvas dimension utilities
 * Functions for setting and managing canvas dimensions
 * @module fabric/canvasDimensions
 */
import { Canvas as FabricCanvas } from "fabric";
import logger from "@/utils/logger";
import { CANVAS_DIMENSIONS } from "./environment";

/**
 * Canvas dimensions interface
 * @interface CanvasDimensions
 */
export interface CanvasDimensions {
  /** Width of the canvas in pixels */
  width: number;
  /** Height of the canvas in pixels */
  height: number;
}

/**
 * Set canvas dimensions with proper scaling
 * @param {FabricCanvas} canvas - Fabric canvas instance
 * @param {number} width - Desired width in pixels
 * @param {number} height - Desired height in pixels
 * @param {boolean} adjustZoom - Whether to adjust zoom for resizing
 * @returns {boolean} Whether dimensions were successfully set
 */
export const setCanvasDimensions = (
  canvas: FabricCanvas,
  width: number,
  height: number,
  adjustZoom: boolean = false
): boolean => {
  if (!canvas) {
    logger.error("Cannot set dimensions: Canvas is null or undefined");
    return false;
  }
  
  try {
    // Get current dimensions for comparison
    const currentWidth = canvas.getWidth();
    const currentHeight = canvas.getHeight();
    
    // Only update if dimensions actually changed
    if (
      Math.abs(currentWidth - width) > CANVAS_DIMENSIONS.DIMENSION_CHANGE_TOLERANCE || 
      Math.abs(currentHeight - height) > CANVAS_DIMENSIONS.DIMENSION_CHANGE_TOLERANCE
    ) {
      // Set dimensions with appropriate scaling option
      canvas.setDimensions({ width, height }, { cssOnly: !adjustZoom });
      
      logger.info(`Canvas dimensions updated: ${width}x${height}`);
      return true;
    } else {
      logger.debug("Canvas dimensions unchanged");
      return false;
    }
  } catch (error) {
    logger.error("Error setting canvas dimensions:", error);
    return false;
  }
};

/**
 * Get current canvas dimensions
 * @param {FabricCanvas} canvas - Fabric canvas instance
 * @returns {CanvasDimensions | null} Canvas dimensions or null if canvas is invalid
 */
export const getCanvasDimensions = (canvas: FabricCanvas): CanvasDimensions | null => {
  if (!canvas) {
    return null;
  }
  
  try {
    return {
      width: canvas.getWidth(),
      height: canvas.getHeight()
    };
  } catch (error) {
    logger.error("Error getting canvas dimensions:", error);
    return null;
  }
};

/**
 * Calculate dimensions to fit canvas in container
 * @param {HTMLElement} container - Container element
 * @returns {CanvasDimensions} Calculated dimensions
 */
export const calculateCanvasDimensions = (container: HTMLElement): CanvasDimensions => {
  if (!container) {
    logger.warn("Cannot calculate dimensions: Container is null or undefined");
    return {
      width: CANVAS_DIMENSIONS.DEFAULT_WIDTH,
      height: CANVAS_DIMENSIONS.DEFAULT_HEIGHT
    };
  }
  
  // Get container dimensions
  const containerWidth = container.clientWidth;
  const containerHeight = container.clientHeight;
  
  // Apply minimum dimensions
  const width = Math.max(containerWidth, CANVAS_DIMENSIONS.MIN_WIDTH);
  const height = Math.max(containerHeight, CANVAS_DIMENSIONS.MIN_HEIGHT);
  
  return { width, height };
};
