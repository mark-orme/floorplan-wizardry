
/**
 * Canvas cleanup utilities
 * Provides functions to clean up canvas resources
 * @module utils/fabric/canvasCleanup
 */

import { Canvas as FabricCanvas } from 'fabric';
import { isCanvasValid } from './canvasValidation';

/**
 * Flag to track whether canvas element has been initialized
 */
let canvasElementInitialized = false;

/**
 * Check if canvas element is initialized
 * @returns True if initialized
 */
export function isCanvasElementInitialized(): boolean {
  return canvasElementInitialized;
}

/**
 * Mark canvas as initialized
 */
export function markCanvasAsInitialized(): void {
  canvasElementInitialized = true;
}

/**
 * Check if canvas element is in DOM
 * @param canvasEl Canvas element to check
 * @returns True if in DOM
 */
export function isCanvasElementInDOM(canvasEl: HTMLCanvasElement | null): boolean {
  return Boolean(canvasEl && document.body.contains(canvasEl));
}

/**
 * Clear all objects from canvas
 * @param canvas Canvas to clear
 * @returns True if successful
 */
export function clearCanvas(canvas: FabricCanvas | null): boolean {
  if (!isCanvasValid(canvas)) return false;
  
  try {
    canvas.clear();
    canvas.renderAll();
    return true;
  } catch (e) {
    console.error('Error clearing canvas:', e);
    return false;
  }
}

/**
 * Dispose of canvas and release resources
 * @param canvas Canvas to dispose
 * @returns True if successful
 */
export function disposeCanvas(canvas: FabricCanvas | null): boolean {
  if (!canvas) return false;
  
  try {
    canvas.dispose();
    return true;
  } catch (e) {
    console.error('Error disposing canvas:', e);
    return false;
  }
}

/**
 * Remove all objects from canvas
 * @param canvas Canvas to clear objects from
 * @returns True if successful
 */
export function removeObjectsFromCanvas(canvas: FabricCanvas | null): boolean {
  if (!isCanvasValid(canvas)) return false;
  
  try {
    const objects = canvas.getObjects();
    
    if (objects.length > 0) {
      objects.forEach(obj => {
        canvas.remove(obj);
      });
      
      canvas.renderAll();
    }
    
    return true;
  } catch (e) {
    console.error('Error removing objects from canvas:', e);
    return false;
  }
}

/**
 * Reset canvas transform to identity
 * @param canvas Canvas to reset
 * @returns True if successful
 */
export function resetCanvasTransform(canvas: FabricCanvas | null): boolean {
  if (!isCanvasValid(canvas)) return false;
  
  try {
    canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
    canvas.renderAll();
    return true;
  } catch (e) {
    console.error('Error resetting canvas transform:', e);
    return false;
  }
}
