
/**
 * Canvas validation utilities
 * @module fabric/canvasValidation
 */
import { Canvas as FabricCanvas } from 'fabric';
import logger from '@/utils/logger';

/**
 * Check if a canvas object is valid and usable
 * @param canvas - Canvas to check
 * @returns Whether canvas is valid
 */
export const isCanvasValid = (canvas: FabricCanvas | null): boolean => {
  if (!canvas) return false;
  
  try {
    // Check if the canvas has required methods
    return (
      typeof canvas.getWidth === 'function' &&
      typeof canvas.getHeight === 'function' &&
      typeof canvas.add === 'function' &&
      typeof canvas.remove === 'function' &&
      typeof canvas.getObjects === 'function'
    );
  } catch (error) {
    logger.error('Error checking canvas validity:', error);
    return false;
  }
};

/**
 * Check if canvas is empty
 * @param canvas - Canvas to check
 * @returns Whether canvas has no objects
 */
export const isCanvasEmpty = (canvas: FabricCanvas | null): boolean => {
  if (!canvas) return true;
  
  try {
    const objects = canvas.getObjects();
    return objects.length === 0;
  } catch (error) {
    logger.error('Error checking if canvas is empty:', error);
    return true;
  }
};

/**
 * Get canvas dimensions
 * @param canvas - Canvas to measure
 * @returns Canvas dimensions or null if invalid
 */
export const getCanvasDimensions = (canvas: FabricCanvas | null): { width: number; height: number } | null => {
  if (!canvas) return null;
  
  try {
    return {
      width: canvas.getWidth(),
      height: canvas.getHeight()
    };
  } catch (error) {
    logger.error('Error getting canvas dimensions:', error);
    return null;
  }
};

/**
 * Verify that the canvas is configured correctly
 * @param canvas - Canvas to verify
 * @returns Status of verification
 */
export const verifyCanvasConfiguration = (canvas: FabricCanvas | null): boolean => {
  if (!isCanvasValid(canvas)) return false;
  
  try {
    // Check various canvas configuration properties
    return (
      canvas!.selection !== undefined &&
      canvas!.viewportTransform !== undefined &&
      canvas!.backgroundColor !== undefined
    );
  } catch (error) {
    logger.error('Error verifying canvas configuration:', error);
    return false;
  }
};
