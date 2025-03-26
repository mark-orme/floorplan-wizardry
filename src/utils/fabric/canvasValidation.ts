
/**
 * Canvas validation utilities
 * @module fabric/canvasValidation
 */
import logger from "@/utils/logger";

// Registry to track initialized canvas elements
const initializedCanvasElements = new WeakSet<HTMLCanvasElement>();

/**
 * Check if a canvas element has been initialized
 * @param {HTMLCanvasElement} canvasElement - Canvas element to check
 * @returns {boolean} True if this canvas has been initialized
 */
export const isCanvasElementInitialized = (canvasElement: HTMLCanvasElement | null): boolean => {
  if (!canvasElement) return false;
  return initializedCanvasElements.has(canvasElement);
};

/**
 * Mark a canvas element as initialized
 * @param {HTMLCanvasElement} canvasElement - Canvas element to mark
 */
export const markCanvasAsInitialized = (canvasElement: HTMLCanvasElement): void => {
  if (!canvasElement) return;
  initializedCanvasElements.add(canvasElement);
  logger.debug("Canvas element marked as initialized");
};

/**
 * Check if a canvas element exists in the DOM
 * @param {HTMLCanvasElement} canvasElement - Canvas element to check
 * @returns {boolean} True if the element is in the DOM
 */
export const isCanvasElementInDOM = (canvasElement: HTMLCanvasElement | null): boolean => {
  if (!canvasElement) return false;
  return document.body.contains(canvasElement);
};

/**
 * Set canvas dimensions and ensure they're valid
 * @param {HTMLCanvasElement} canvasElement - Canvas element
 * @param {number} width - Width to set
 * @param {number} height - Height to set
 * @returns {boolean} True if dimensions were set successfully
 */
export const setCanvasDimensions = (
  canvasElement: HTMLCanvasElement | null,
  width: number,
  height: number
): boolean => {
  if (!canvasElement) return false;
  
  try {
    // Set width and height attributes
    canvasElement.width = width;
    canvasElement.height = height;
    
    // Also set style dimensions
    canvasElement.style.width = `${width}px`;
    canvasElement.style.height = `${height}px`;
    
    // Force a reflow
    canvasElement.getBoundingClientRect();
    
    // Verify dimensions were set
    return canvasElement.width === width && canvasElement.height === height;
  } catch (error) {
    logger.error("Error setting canvas dimensions:", error);
    return false;
  }
};

