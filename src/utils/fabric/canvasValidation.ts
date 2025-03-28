
/**
 * Canvas validation utilities
 * @module utils/fabric/canvasValidation
 */

import { Canvas, FabricObject } from 'fabric';

// Type for object IDs
export type ObjectId = string;

/**
 * Validates if a string is a valid object ID
 * @param id The ID to validate
 * @returns True if the ID is valid
 */
export function isValidObjectId(id: string): boolean {
  return typeof id === 'string' && id.length > 0;
}

/**
 * Check if an object exists in the canvas
 * @param canvas The fabric canvas
 * @param id Object ID to check
 * @returns True if the object exists
 */
export function doesObjectExist(canvas: Canvas, id: ObjectId): boolean {
  if (!canvas || !id) return false;
  const obj = canvas.getObjects().find((o: any) => o.id === id);
  return !!obj;
}

/**
 * Get an object by ID from the canvas
 * @param canvas The fabric canvas
 * @param id Object ID to find
 * @returns The found object or null
 */
export function getObjectById(canvas: Canvas, id: ObjectId): FabricObject | null {
  if (!canvas || !id) return null;
  const obj = canvas.getObjects().find((o: any) => o.id === id);
  return obj || null;
}

/**
 * Safely get an object by ID from the canvas with type checking
 * @param canvas The fabric canvas
 * @param id Object ID to find
 * @returns The found object or null
 */
export function safeGetObjectById(canvas: Canvas, id: ObjectId): FabricObject | null {
  return getObjectById(canvas, id);
}

/**
 * Validates if a canvas is valid and ready for operations
 * @param canvas The canvas to validate
 * @returns True if the canvas is valid
 */
export function isCanvasValid(canvas: Canvas | null): boolean {
  return !!canvas && !!(canvas as any)._objects;
}

/**
 * Safely check if canvas contains an object
 * @param canvas The canvas
 * @param obj The object to check
 * @returns True if canvas contains the object
 */
export function safeCanvasContains(canvas: Canvas | null, obj: FabricObject): boolean {
  if (!isCanvasValid(canvas) || !obj) return false;
  return canvas!.contains(obj);
}

/**
 * Check if canvas is empty (no objects)
 * @param canvas The canvas to check
 * @returns True if canvas is empty
 */
export function isCanvasEmpty(canvas: Canvas | null): boolean {
  if (!isCanvasValid(canvas)) return true;
  return canvas!.getObjects().length === 0;
}

/**
 * Verify canvas configuration
 * @param canvas The canvas to verify
 * @returns True if canvas configuration is valid
 */
export function verifyCanvasConfiguration(canvas: Canvas | null): boolean {
  if (!isCanvasValid(canvas)) return false;
  
  const width = canvas!.getWidth();
  const height = canvas!.getHeight();
  
  // Check basic dimensions
  if (!width || !height || width < 10 || height < 10) {
    return false;
  }
  
  return true;
}

/**
 * Safely get canvas element
 * @param canvas The fabric canvas
 * @returns The HTML canvas element or null
 */
export function safelyGetCanvasElement(canvas: Canvas | null): HTMLCanvasElement | null {
  if (!isCanvasValid(canvas)) return null;
  return canvas!.getElement() as HTMLCanvasElement;
}

/**
 * Check if canvas is disposed
 * @param canvas The canvas to check
 * @returns True if canvas is disposed
 */
export function isCanvasDisposed(canvas: Canvas | null): boolean {
  if (!canvas) return true;
  
  try {
    // Try to access a property that should always exist
    const objects = canvas.getObjects();
    return false; // If we get here, canvas is not disposed
  } catch (e) {
    return true; // Error means canvas is likely disposed
  }
}
