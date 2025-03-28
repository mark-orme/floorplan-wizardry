
/**
 * Canvas cleanup utilities
 * @module utils/fabric/canvasCleanup
 */

import { Canvas, Object as FabricObject } from 'fabric';
import { isCanvasValid } from './canvasValidation';

/**
 * Safely remove all objects from a canvas
 * @param canvas The canvas to clear
 * @returns True if operation was successful
 */
export function safelyClearCanvas(canvas: Canvas | null): boolean {
  if (!isCanvasValid(canvas)) return false;
  
  try {
    canvas!.clear();
    canvas!.renderAll();
    return true;
  } catch (e) {
    console.error('Error clearing canvas:', e);
    return false;
  }
}

/**
 * Safely dispose of a canvas
 * @param canvas The canvas to dispose
 * @returns True if operation was successful
 */
export function safelyDisposeCanvas(canvas: Canvas | null): boolean {
  if (!canvas) return true; // Nothing to dispose
  
  try {
    canvas.dispose();
    return true;
  } catch (e) {
    console.error('Error disposing canvas:', e);
    return false;
  }
}

/**
 * Safely remove a specific object from canvas
 * @param canvas The canvas
 * @param obj The object to remove
 * @returns True if operation was successful
 */
export function safelyRemoveObject(canvas: Canvas | null, obj: FabricObject): boolean {
  if (!isCanvasValid(canvas) || !obj) return false;
  
  try {
    if (canvas!.contains(obj)) {
      canvas!.remove(obj);
      canvas!.renderAll();
      return true;
    }
    return false;
  } catch (e) {
    console.error('Error removing object:', e);
    return false;
  }
}

/**
 * Clean up grid objects from canvas
 * @param canvas The canvas
 * @param gridObjects Array of grid objects
 * @returns True if operation was successful
 */
export function cleanupGridObjects(canvas: Canvas | null, gridObjects: FabricObject[]): boolean {
  if (!isCanvasValid(canvas) || !gridObjects) return false;
  
  try {
    let success = true;
    gridObjects.forEach(obj => {
      if (canvas!.contains(obj)) {
        canvas!.remove(obj);
      } else {
        success = false;
      }
    });
    
    canvas!.renderAll();
    return success;
  } catch (e) {
    console.error('Error cleaning up grid objects:', e);
    return false;
  }
}
