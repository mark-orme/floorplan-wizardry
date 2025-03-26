
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

/**
 * Get canvas element safely
 * @param canvasRef - Reference to canvas element
 * @returns Canvas element or null
 */
export const safelyGetCanvasElement = (canvasRef: React.RefObject<HTMLCanvasElement>): HTMLCanvasElement | null => {
  if (canvasRef.current) return canvasRef.current;
  
  // Try to find canvas by ID
  const canvasById = document.getElementById('fabric-canvas') as HTMLCanvasElement | null;
  if (canvasById) return canvasById;
  
  // Try to find canvas by data attribute
  const canvasByData = document.querySelector('[data-testid="canvas-element"]') as HTMLCanvasElement | null;
  if (canvasByData) return canvasByData;
  
  return null;
};

/**
 * Check if canvas is disposed
 * @param canvas - Canvas to check
 * @returns Whether canvas is disposed
 */
export const isCanvasDisposed = (canvas: FabricCanvas | null): boolean => {
  if (!canvas) return true;
  
  try {
    // Check if essential methods are still functional
    return typeof canvas.getObjects !== 'function';
  } catch (error) {
    // If accessing the method throws an error, the canvas is likely disposed
    return true;
  }
};
