
/**
 * Canvas cleanup utilities
 * @module fabric/canvasCleanup
 */
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';
import { isCanvasValid } from './canvasValidation';
import logger from '@/utils/logger';

/**
 * Clear all objects from a canvas
 * @param canvas - Canvas to clear
 * @returns Number of objects cleared
 */
export const clearCanvas = (canvas: FabricCanvas | null): number => {
  if (!isCanvasValid(canvas)) return 0;
  
  try {
    const objects = canvas!.getObjects();
    const count = objects.length;
    
    canvas!.clear();
    canvas!.renderAll();
    
    return count;
  } catch (error) {
    logger.error('Error clearing canvas:', error);
    return 0;
  }
};

/**
 * Dispose of a canvas and its objects
 * @param canvas - Canvas to dispose
 */
export const disposeCanvas = (canvas: FabricCanvas | null): void => {
  if (!isCanvasValid(canvas)) return;
  
  try {
    canvas!.dispose();
    logger.info('Canvas disposed successfully');
  } catch (error) {
    logger.error('Error disposing canvas:', error);
  }
};

/**
 * Safely remove specific objects from a canvas
 * @param canvas - Canvas to clean
 * @param predicate - Function to determine which objects to remove
 * @returns Number of objects removed
 */
export const removeObjectsFromCanvas = (
  canvas: FabricCanvas | null,
  predicate: (obj: FabricObject) => boolean
): number => {
  if (!isCanvasValid(canvas)) return 0;
  
  try {
    const objects = canvas!.getObjects();
    const objectsToRemove = objects.filter(predicate);
    
    objectsToRemove.forEach(obj => {
      canvas!.remove(obj);
    });
    
    canvas!.renderAll();
    return objectsToRemove.length;
  } catch (error) {
    logger.error('Error removing objects from canvas:', error);
    return 0;
  }
};

/**
 * Reset canvas transformations to default
 * @param canvas - Canvas to reset
 */
export const resetCanvasTransform = (canvas: FabricCanvas | null): void => {
  if (!isCanvasValid(canvas)) return;
  
  try {
    // Reset zoom and pan
    canvas!.setZoom(1);
    canvas!.viewportTransform = [1, 0, 0, 1, 0, 0];
    canvas!.renderAll();
  } catch (error) {
    logger.error('Error resetting canvas transform:', error);
  }
};

/**
 * Force clean a canvas element by removing listeners
 * @param canvas - Canvas element to clean
 */
export const forceCleanCanvasElement = (canvasElement: HTMLCanvasElement | null): void => {
  if (!canvasElement) return;
  
  try {
    // Remove all event listeners
    const clone = canvasElement.cloneNode(false) as HTMLCanvasElement;
    if (canvasElement.parentNode) {
      canvasElement.parentNode.replaceChild(clone, canvasElement);
    }
    logger.info('Canvas element forcefully cleaned');
  } catch (error) {
    logger.error('Error force cleaning canvas element:', error);
  }
};

/**
 * Reset internal canvas state tracking
 */
export const resetCanvasStateTracker = (): void => {
  try {
    // Reset any global state tracking for canvases
    window.__CANVAS_TRACKER = {
      initializedCanvases: new Set(),
      canvasInitCount: 0,
      lastCanvasInitAt: Date.now()
    };
    logger.info('Canvas state tracker reset');
  } catch (error) {
    logger.error('Error resetting canvas state tracker:', error);
  }
};

/**
 * Track initialized canvas elements
 */
declare global {
  interface Window {
    __CANVAS_TRACKER: {
      initializedCanvases: Set<HTMLCanvasElement>;
      canvasInitCount: number;
      lastCanvasInitAt: number;
    };
  }
}

// Initialize the tracker if it doesn't exist
if (typeof window !== 'undefined' && !window.__CANVAS_TRACKER) {
  window.__CANVAS_TRACKER = {
    initializedCanvases: new Set(),
    canvasInitCount: 0,
    lastCanvasInitAt: Date.now()
  };
}

/**
 * Mark canvas as initialized
 * @param canvasElement - Canvas element to mark
 */
export const markCanvasAsInitialized = (canvasElement: HTMLCanvasElement): void => {
  if (typeof window === 'undefined' || !canvasElement) return;
  
  window.__CANVAS_TRACKER.initializedCanvases.add(canvasElement);
  window.__CANVAS_TRACKER.canvasInitCount++;
  window.__CANVAS_TRACKER.lastCanvasInitAt = Date.now();
};

/**
 * Check if canvas element is already initialized
 * @param canvasElement - Canvas element to check
 * @returns Whether canvas is initialized
 */
export const isCanvasElementInitialized = (canvasElement: HTMLCanvasElement | null): boolean => {
  if (typeof window === 'undefined' || !canvasElement) return false;
  
  return window.__CANVAS_TRACKER.initializedCanvases.has(canvasElement);
};

/**
 * Check if canvas element is in the DOM
 * @param canvasElement - Canvas element to check
 * @returns Whether canvas is in DOM
 */
export const isCanvasElementInDOM = (canvasElement: HTMLCanvasElement | null): boolean => {
  if (!canvasElement) return false;
  
  return document.body.contains(canvasElement);
};
