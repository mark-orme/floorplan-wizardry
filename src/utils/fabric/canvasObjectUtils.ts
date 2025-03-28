
/**
 * Canvas object utilities
 * @module utils/fabric/canvasObjectUtils
 */

import { Canvas, Object as FabricObject } from 'fabric';

/**
 * Bring an object to the front of the canvas
 * @param canvas The canvas
 * @param obj The object to bring to front
 */
export function bringToFront(canvas: Canvas, obj: FabricObject): void {
  if (!canvas || !obj) return;
  canvas.bringToFront(obj);
  canvas.renderAll();
}

/**
 * Send an object to the back of the canvas
 * @param canvas The canvas
 * @param obj The object to send to back
 */
export function sendToBack(canvas: Canvas, obj: FabricObject): void {
  if (!canvas || !obj) return;
  canvas.sendToBack(obj);
  canvas.renderAll();
}

/**
 * Center an object on the canvas
 * @param canvas The canvas
 * @param obj The object to center
 */
export function centerObject(canvas: Canvas, obj: FabricObject): void {
  if (!canvas || !obj) return;
  
  // Check if the center method exists on the object
  if (typeof (obj as any).centerH === 'function' && typeof (obj as any).centerV === 'function') {
    (obj as any).centerH();
    (obj as any).centerV();
  } else {
    // Fall back to manually centering the object
    const canvasWidth = canvas.getWidth();
    const canvasHeight = canvas.getHeight();
    
    obj.set({
      left: canvasWidth / 2,
      top: canvasHeight / 2,
      originX: 'center',
      originY: 'center'
    });
  }
  
  canvas.renderAll();
}

/**
 * Get an object by its ID
 * @param canvas The canvas
 * @param id The object ID
 * @returns The found object or null
 */
export function getObjectById(canvas: Canvas, id: string): FabricObject | null {
  if (!canvas || !id) return null;
  
  const objects = canvas.getObjects();
  const foundObj = objects.find(obj => (obj as any).id === id);
  
  return foundObj || null;
}
