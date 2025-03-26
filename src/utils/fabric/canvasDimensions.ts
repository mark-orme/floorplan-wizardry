
/**
 * Canvas dimensions utilities
 * @module fabric/canvasDimensions
 */
import { Canvas as FabricCanvas } from "fabric";
import logger from "@/utils/logger";
import { CanvasDimensions } from "@/types/drawingTypes";
import { DEFAULT_CANVAS_WIDTH, DEFAULT_CANVAS_HEIGHT } from "@/constants/numerics";

/**
 * Canvas dimensions constants
 */
export const CANVAS_DIMENSIONS = {
  DEFAULT_WIDTH: DEFAULT_CANVAS_WIDTH,
  DEFAULT_HEIGHT: DEFAULT_CANVAS_HEIGHT,
  MIN_WIDTH: 400,
  MIN_HEIGHT: 300,
  DIMENSION_CHANGE_TOLERANCE: 5, // Minimum pixel difference to trigger resize
  RESIZE_DEBOUNCE_MS: 500, // Debounce time for resize events
  STROKE_WIDTH: 1 // Default stroke width for canvas elements
};

/**
 * Set canvas dimensions
 * Updates both element dimensions and fabric object dimensions
 * @param {FabricCanvas} canvas - Fabric canvas instance
 * @param {number} width - New width
 * @param {number} height - New height
 * @param {Object} options - Additional options
 * @returns {boolean} True if dimensions were set successfully
 */
export const setCanvasDimensions = (
  canvas: FabricCanvas,
  width: number = CANVAS_DIMENSIONS.DEFAULT_WIDTH,
  height: number = CANVAS_DIMENSIONS.DEFAULT_HEIGHT,
  options = { cssOnly: false }
): boolean => {
  if (!canvas) return false;
  
  try {
    // Log dimensions change
    logger.debug(`Setting canvas dimensions to ${width}x${height}`);
    
    // Update fabric canvas dimensions
    canvas.setWidth(width);
    canvas.setHeight(height);
    
    // Also update CSS dimensions when not in cssOnly mode
    if (!options.cssOnly) {
      const htmlCanvas = canvas.getElement() as HTMLCanvasElement;
      htmlCanvas.style.width = `${width}px`;
      htmlCanvas.style.height = `${height}px`;
    }
    
    // Render to ensure changes take effect
    canvas.renderAll();
    
    return true;
  } catch (error) {
    logger.error("Error setting canvas dimensions:", error);
    return false;
  }
};

/**
 * Get current canvas dimensions
 * @param {FabricCanvas} canvas - Fabric canvas
 * @returns {CanvasDimensions} Canvas dimensions
 */
export const getCanvasDimensions = (canvas: FabricCanvas | null): CanvasDimensions => {
  if (!canvas) {
    return {
      width: CANVAS_DIMENSIONS.DEFAULT_WIDTH,
      height: CANVAS_DIMENSIONS.DEFAULT_HEIGHT
    };
  }
  
  try {
    return {
      width: canvas.getWidth(),
      height: canvas.getHeight()
    };
  } catch (error) {
    logger.error("Error getting canvas dimensions:", error);
    return {
      width: CANVAS_DIMENSIONS.DEFAULT_WIDTH, 
      height: CANVAS_DIMENSIONS.DEFAULT_HEIGHT
    };
  }
};

/**
 * Resize canvas to fit parent container
 * @param {FabricCanvas} canvas - Fabric canvas
 * @param {HTMLElement} container - Container element
 * @returns {boolean} True if resize was successful
 */
export const resizeCanvasToContainer = (
  canvas: FabricCanvas,
  container: HTMLElement
): boolean => {
  if (!canvas || !container) return false;
  
  try {
    const { width, height } = container.getBoundingClientRect();
    
    // Only proceed if we have valid dimensions
    if (width <= 0 || height <= 0) {
      logger.warn("Invalid container dimensions for canvas resize");
      return false;
    }
    
    // Set the canvas dimensions, updating both CSS and fabric instance
    return setCanvasDimensions(canvas, width, height);
  } catch (error) {
    logger.error("Error resizing canvas to container:", error);
    return false;
  }
};
