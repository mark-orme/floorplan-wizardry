
/**
 * Fabric.js utility functions
 * @module utils/fabric
 */
import { Canvas as FabricCanvas } from 'fabric';
import logger from '@/utils/logger';

/**
 * Set canvas dimensions with proper scaling
 * @param canvas - Fabric canvas instance
 * @param width - New width
 * @param height - New height
 */
export const setCanvasDimensions = (canvas: FabricCanvas, width: number, height: number) => {
  if (!canvas) return;
  
  // The API has changed in latest Fabric.js - let's fix it for compatibility
  try {
    // Try the newer version API first (with dimensions object)
    canvas.setDimensions({ width, height });
  } catch (e) {
    console.error('Error setting canvas dimensions:', e);
    try {
      // Fallback to older API if needed
      (canvas as any).setDimensions(width, height);
    } catch (e2) {
      console.error('Failed to set canvas dimensions with fallback method:', e2);
    }
  }

  canvas.requestRenderAll();
};

/**
 * Clear all objects from canvas
 * @param canvas - Fabric canvas instance
 * @param preserveGrid - Whether to preserve grid objects
 */
export const clearCanvas = (canvas: FabricCanvas, preserveGrid: boolean = false) => {
  if (!canvas) return;
  
  if (preserveGrid) {
    // Remove all objects except those with gridObject property
    const objects = canvas.getObjects().filter(obj => !(obj as any).gridObject);
    if (objects.length > 0) {
      canvas.remove(...objects);
    }
  } else {
    // Remove all objects
    canvas.clear();
  }
  
  canvas.requestRenderAll();
};

/**
 * Enable selection mode on canvas
 * @param canvas - Fabric canvas instance
 */
export const enableSelection = (canvas: FabricCanvas) => {
  if (!canvas) return;
  
  canvas.selection = true;
  canvas.defaultCursor = 'default';
  canvas.hoverCursor = 'move';
  
  canvas.getObjects().forEach(obj => {
    if (!(obj as any).gridObject) {
      obj.selectable = true;
      (obj as any).evented = true;
    }
  });
  
  canvas.requestRenderAll();
};

/**
 * Disable selection mode on canvas
 * @param canvas - Fabric canvas instance
 */
export const disableSelection = (canvas: FabricCanvas) => {
  if (!canvas) return;
  
  canvas.selection = false;
  canvas.defaultCursor = 'crosshair';
  
  canvas.getObjects().forEach(obj => {
    obj.selectable = false;
    (obj as any).evented = false;
  });
  
  canvas.requestRenderAll();
};
