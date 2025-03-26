
/**
 * Fabric canvas cleanup utilities
 * Functions for cleaning up and disposing canvas resources
 * @module fabric/canvasCleanup
 */
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import logger from "@/utils/logger";
import { isCanvasValid, safelyGetCanvasElement } from "./canvasValidation";

/**
 * State tracker for canvas cleanup
 */
const canvasStateTracker = {
  disposeCount: 0,
  cleanupCount: 0
};

/**
 * Reset canvas state tracker
 */
export const resetCanvasStateTracker = (): void => {
  canvasStateTracker.disposeCount = 0;
  canvasStateTracker.cleanupCount = 0;
};

/**
 * Safely dispose a Fabric canvas
 * Properly cleans up resources and event listeners
 * @param {FabricCanvas | null | undefined} canvas - Canvas to dispose
 * @returns {boolean} Whether the canvas was successfully disposed
 */
export const disposeCanvas = (
  canvas: FabricCanvas | null | undefined
): boolean => {
  if (!canvas) {
    return false;
  }
  
  try {
    // Check if already disposed
    if ((canvas as any)._isDisposed === true) {
      return true;
    }
    
    // Clean up objects
    canvas.clear();
    
    // Remove event listeners
    canvas.dispose();
    
    // Mark as disposed
    (canvas as any)._isDisposed = true;
    
    // Track disposal
    canvasStateTracker.disposeCount++;
    
    logger.info(`Canvas disposed successfully (total: ${canvasStateTracker.disposeCount})`);
    return true;
  } catch (error) {
    logger.error("Error disposing canvas:", error);
    return false;
  }
};

/**
 * Force clean a canvas element directly
 * Used for emergency cleanup when Fabric methods fail
 * @param {HTMLCanvasElement | null | undefined} canvasElement - Canvas element to clean
 * @returns {boolean} Whether the canvas was successfully cleaned
 */
export const forceCleanCanvasElement = (
  canvasElement: HTMLCanvasElement | null | undefined
): boolean => {
  if (!canvasElement) {
    return false;
  }
  
  try {
    // Clear canvas with native API
    const ctx = canvasElement.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    }
    
    // Remove all event listeners
    const newCanvas = canvasElement.cloneNode(false) as HTMLCanvasElement;
    if (canvasElement.parentNode) {
      canvasElement.parentNode.replaceChild(newCanvas, canvasElement);
    }
    
    // Track cleanup
    canvasStateTracker.cleanupCount++;
    
    logger.info(`Canvas element force cleaned (total: ${canvasStateTracker.cleanupCount})`);
    return true;
  } catch (error) {
    logger.error("Error force cleaning canvas element:", error);
    return false;
  }
};

/**
 * Emergency cleanup for a Fabric canvas
 * Attempts multiple strategies for thorough cleanup
 * @param {FabricCanvas | null | undefined} canvas - Canvas to clean up
 * @returns {boolean} Whether any cleanup was successful
 */
export const emergencyCanvasCleanup = (
  canvas: FabricCanvas | null | undefined
): boolean => {
  if (!canvas) {
    return false;
  }
  
  let success = false;
  
  // Try safe disposal first
  if (isCanvasValid(canvas)) {
    try {
      // Remove all objects
      canvas.clear();
      
      // Remove event handlers
      canvas.off();
      
      // Attempt dispose
      canvas.dispose();
      
      success = true;
    } catch (error) {
      logger.error("Safe disposal failed:", error);
    }
  }
  
  // Force clean the canvas element if we have access to it
  const canvasElement = safelyGetCanvasElement(canvas);
  if (canvasElement) {
    success = forceCleanCanvasElement(canvasElement) || success;
  }
  
  // Mark as disposed
  (canvas as any)._isDisposed = true;
  
  return success;
};

/**
 * Remove specific objects from canvas
 * Safely removes objects matching a predicate
 * @param {FabricCanvas | null | undefined} canvas - Canvas to remove objects from
 * @param {Function} predicate - Function to determine which objects to remove
 * @returns {number} Number of objects removed
 */
export const removeCanvasObjectsByPredicate = (
  canvas: FabricCanvas | null | undefined,
  predicate: (obj: FabricObject) => boolean
): number => {
  if (!isCanvasValid(canvas)) {
    return 0;
  }
  
  try {
    const objects = canvas!.getObjects();
    let removedCount = 0;
    
    // Remove objects in reverse order to avoid index issues
    for (let i = objects.length - 1; i >= 0; i--) {
      if (predicate(objects[i])) {
        canvas!.remove(objects[i]);
        removedCount++;
      }
    }
    
    if (removedCount > 0) {
      canvas!.requestRenderAll();
    }
    
    return removedCount;
  } catch (error) {
    logger.error("Error removing canvas objects:", error);
    return 0;
  }
};
