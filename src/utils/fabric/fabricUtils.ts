
/**
 * Fabric.js utility functions
 * @module fabric/fabricUtils
 */
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';
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
 * Check if a Fabric object is selectable
 * @param object - Object to check
 * @returns Whether object is selectable
 */
export const isObjectSelectable = (object: FabricObject | null): boolean => {
  if (!object) return false;
  
  try {
    return object.selectable === true;
  } catch (error) {
    logger.error('Error checking object selectability:', error);
    return false;
  }
};

/**
 * Dispose of a Fabric object safely
 * @param object - Object to dispose
 */
export const safeDisposeObject = (object: FabricObject | null): void => {
  if (!object) return;
  
  try {
    // Remove from canvas if it has one
    const canvas = object.canvas;
    if (canvas) {
      canvas.remove(object);
    }
    
    // Clear object references
    object.dispose();
  } catch (error) {
    logger.error('Error disposing object:', error);
  }
};

/**
 * Safely attach keyboard event handlers to a canvas
 * @param canvas - Canvas to attach handlers to
 * @param handlers - Event handler map
 * @returns Function to remove handlers
 */
export const attachKeyboardHandlers = (
  canvas: FabricCanvas | null,
  handlers: Record<string, (e: KeyboardEvent) => void>
): (() => void) => {
  if (!canvas) return () => {};
  
  const handleKeyDown = (e: KeyboardEvent) => {
    const key = e.key.toLowerCase();
    if (handlers[key]) {
      handlers[key](e);
    }
  };
  
  window.addEventListener('keydown', handleKeyDown);
  
  return () => {
    window.removeEventListener('keydown', handleKeyDown);
  };
};
