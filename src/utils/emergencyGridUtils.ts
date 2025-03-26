
/**
 * Emergency grid utilities for when standard initialization fails
 * @module emergencyGridUtils
 */
import { Canvas as FabricCanvas } from 'fabric';
import logger from '@/utils/logger';
import { GRID_SPACING } from '@/constants/numerics';
import { disposeCanvas } from './fabric/canvasCleanup';

/**
 * Clean up canvas element forcefully
 * @param element - Canvas element to clean
 */
export const forceCleanCanvasElement = (element: HTMLCanvasElement | null): void => {
  if (!element) return;
  
  try {
    // Clone and replace the element to remove all listeners
    const clone = element.cloneNode(false) as HTMLCanvasElement;
    if (element.parentNode) {
      element.parentNode.replaceChild(clone, element);
    }
    logger.info("Canvas element forcefully cleaned");
  } catch (error) {
    logger.error("Error force cleaning canvas element:", error);
  }
};

/**
 * Create an emergency grid when normal grid creation fails
 * @param canvas - Canvas to create grid on
 * @returns Success status
 */
export const createEmergencyGrid = (canvas: FabricCanvas | null): boolean => {
  if (!canvas) {
    logger.error("Cannot create emergency grid on null canvas");
    return false;
  }
  
  try {
    // Clear any existing objects
    canvas.clear();
    
    // Create a simple grid with minimal operations
    const gridSpacing = GRID_SPACING;
    const width = canvas.getWidth();
    const height = canvas.getHeight();
    
    for (let i = 0; i < width; i += gridSpacing) {
      canvas.add(new fabric.Line([i, 0, i, height], {
        stroke: '#eeeeee',
        selectable: false,
        evented: false
      }));
    }
    
    for (let i = 0; i < height; i += gridSpacing) {
      canvas.add(new fabric.Line([0, i, width, i], {
        stroke: '#eeeeee',
        selectable: false,
        evented: false
      }));
    }
    
    canvas.renderAll();
    logger.info("Emergency grid created");
    return true;
  } catch (error) {
    logger.error("Error creating emergency grid:", error);
    
    // If this fails, try to clean up
    try {
      disposeCanvas(canvas);
    } catch (e) {
      // Just log, don't throw
      logger.error("Error disposing canvas after emergency grid failure:", e);
    }
    
    return false;
  }
};
