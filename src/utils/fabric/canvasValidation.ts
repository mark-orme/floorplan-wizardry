
/**
 * Canvas validation utilities
 * @module fabric/canvasValidation
 */
import { Canvas as FabricCanvas } from "fabric";
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
 * Safely validate if a canvas object is valid and not disposed
 * @param {FabricCanvas|null} canvas - Canvas to validate
 * @returns {boolean} True if canvas is valid and usable
 */
export const isCanvasValid = (canvas: FabricCanvas | null): boolean => {
  if (!canvas) return false;
  
  try {
    // Check basic properties that should exist on a valid canvas
    return typeof canvas.renderAll === 'function' && 
           typeof canvas.getWidth === 'function' &&
           typeof canvas.getHeight === 'function';
  } catch (error) {
    logger.error("Error validating canvas:", error);
    return false;
  }
};

/**
 * Check if a canvas has been disposed
 * @param {FabricCanvas|null} canvas - Canvas to check
 * @returns {boolean} True if canvas has been disposed
 */
export const isCanvasDisposed = (canvas: FabricCanvas | null): boolean => {
  if (!canvas) return true;
  
  try {
    // Try to access a common method - if it throws, canvas is likely disposed
    canvas.getWidth();
    return false;
  } catch (error) {
    return true;
  }
};

/**
 * Safely get the canvas element from a Fabric.js canvas instance
 * @param {FabricCanvas|null} canvas - Fabric.js canvas
 * @returns {HTMLCanvasElement|null} Canvas HTML element or null
 */
export const safelyGetCanvasElement = (canvas: FabricCanvas | null): HTMLCanvasElement | null => {
  if (!canvas) return null;
  
  try {
    return canvas.getElement() as HTMLCanvasElement;
  } catch (error) {
    logger.error("Error getting canvas element:", error);
    return null;
  }
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
