
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
