
/**
 * Fabric canvas validation utilities
 * Functions for validating canvas state and elements
 * @module fabric/canvasValidation
 */
import { Canvas as FabricCanvas } from "fabric";
import logger from "@/utils/logger";

/**
 * Check if a canvas is valid and ready for operations
 * @param {FabricCanvas | null | undefined} canvas - Canvas to validate
 * @returns {boolean} Whether the canvas is valid
 */
export const isCanvasValid = (canvas: FabricCanvas | null | undefined): boolean => {
  if (!canvas) {
    return false;
  }
  
  try {
    // Check if the canvas has been disposed
    if ((canvas as any)._isDisposed === true) {
      return false;
    }
    
    // Check if the canvas element still exists
    const canvasElement = canvas.getElement() as HTMLCanvasElement;
    if (!canvasElement || !canvasElement.getContext) {
      return false;
    }
    
    // Check if the canvas has a valid rendering context
    const ctx = canvasElement.getContext('2d');
    if (!ctx) {
      return false;
    }
    
    return true;
  } catch (error) {
    logger.error("Error validating canvas:", error);
    return false;
  }
};

/**
 * Safely get the canvas element with validation
 * @param {FabricCanvas | null | undefined} canvas - Canvas to get element from
 * @returns {HTMLCanvasElement | null} Canvas element or null if invalid
 */
export const safelyGetCanvasElement = (
  canvas: FabricCanvas | null | undefined
): HTMLCanvasElement | null => {
  if (!isCanvasValid(canvas)) {
    return null;
  }
  
  try {
    return canvas!.getElement() as HTMLCanvasElement;
  } catch (error) {
    logger.error("Error getting canvas element:", error);
    return null;
  }
};

/**
 * Check if a canvas has been disposed
 * @param {FabricCanvas | null | undefined} canvas - Canvas to check
 * @returns {boolean} Whether the canvas has been disposed
 */
export const isCanvasDisposed = (canvas: FabricCanvas | null | undefined): boolean => {
  if (!canvas) {
    return true;
  }
  
  return (canvas as any)._isDisposed === true;
};

/**
 * Check if a canvas element is still attached to the DOM
 * @param {HTMLCanvasElement | null | undefined} canvasElement - Canvas element to check
 * @returns {boolean} Whether the canvas element is attached to the DOM
 */
export const isCanvasElementInDOM = (
  canvasElement: HTMLCanvasElement | null | undefined
): boolean => {
  if (!canvasElement) {
    return false;
  }
  
  return document.body.contains(canvasElement);
};

/**
 * Check if a canvas can be safely used for drawing
 * Comprehensive validation of canvas readiness
 * @param {FabricCanvas | null | undefined} canvas - Canvas to validate
 * @returns {boolean} Whether the canvas is ready for drawing
 */
export const canvasIsReadyForDrawing = (
  canvas: FabricCanvas | null | undefined
): boolean => {
  if (!isCanvasValid(canvas)) {
    return false;
  }
  
  try {
    // Additional checks for drawing readiness
    const canvasElement = canvas!.getElement() as HTMLCanvasElement;
    
    // Check if canvas has non-zero dimensions
    if (canvasElement.width === 0 || canvasElement.height === 0) {
      return false;
    }
    
    // Check if canvas has valid drawing brush
    if (canvas!.isDrawingMode && !canvas!.freeDrawingBrush) {
      return false;
    }
    
    return true;
  } catch (error) {
    logger.error("Error checking canvas drawing readiness:", error);
    return false;
  }
};
