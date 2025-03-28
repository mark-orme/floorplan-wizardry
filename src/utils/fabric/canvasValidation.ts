
/**
 * Canvas validation utilities
 * Functions to safely check and access canvas objects
 * @module utils/fabric/canvasValidation
 */
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';

/**
 * ObjectId type for fabric objects
 */
export type ObjectId = string;

/**
 * Validates if a string is a valid object ID
 * @param id The ID to validate
 * @returns True if the ID is valid
 */
export function isValidObjectId(id: string | undefined): boolean {
  return typeof id === 'string' && id.length > 0;
}

/**
 * Check if an object exists in canvas by ID
 * @param canvas Canvas to check
 * @param id Object ID
 * @returns True if object exists
 */
export function doesObjectExist(canvas: FabricCanvas | null, id: ObjectId): boolean {
  if (!canvas) return false;
  return getObjectById(canvas, id) !== null;
}

/**
 * Get an object by ID
 * @param canvas Canvas to search
 * @param id Object ID
 * @returns Object or null if not found
 */
export function getObjectById(canvas: FabricCanvas | null, id: ObjectId): FabricObject | null {
  if (!canvas || !id) return null;
  
  const objects = canvas.getObjects();
  return objects.find(obj => (obj as any).id === id) || null;
}

/**
 * Safely get object by ID with checks
 * @param canvas Canvas to search
 * @param id Object ID
 * @returns Object or null if not found or invalid
 */
export function safeGetObjectById(canvas: FabricCanvas | null, id: ObjectId): FabricObject | null {
  if (!canvas || !isValidObjectId(id)) return null;
  return getObjectById(canvas, id);
}

/**
 * Check if canvas is valid
 * @param canvas Canvas to check
 * @returns True if canvas is valid and initialized
 */
export function isCanvasValid(canvas: FabricCanvas | null): boolean {
  return Boolean(canvas && !canvas.disposed && canvas.getContext());
}

/**
 * Safely check if canvas contains an object
 * @param canvas Canvas to check
 * @param obj Object to check for
 * @returns True if canvas contains object
 */
export function safeCanvasContains(canvas: FabricCanvas | null, obj: FabricObject | null): boolean {
  if (!canvas || !obj) return false;
  
  try {
    return canvas.contains(obj);
  } catch (e) {
    console.error('Error checking if canvas contains object:', e);
    return false;
  }
}

/**
 * Check if canvas is empty
 * @param canvas Canvas to check
 * @returns True if canvas has no objects
 */
export function isCanvasEmpty(canvas: FabricCanvas | null): boolean {
  if (!isCanvasValid(canvas)) return true;
  return canvas.getObjects().length === 0;
}

/**
 * Verify canvas configuration
 * @param canvas Canvas to verify
 * @returns True if canvas has valid configuration
 */
export function verifyCanvasConfiguration(canvas: FabricCanvas | null): boolean {
  if (!canvas) return false;
  
  try {
    return Boolean(
      canvas.width &&
      canvas.height &&
      canvas.getContext() &&
      !canvas.disposed
    );
  } catch (e) {
    console.error('Error verifying canvas configuration:', e);
    return false;
  }
}

/**
 * Safely get canvas HTML element
 * @param canvas Canvas to get element from
 * @returns Canvas element or null
 */
export function safelyGetCanvasElement(canvas: FabricCanvas | null): HTMLCanvasElement | null {
  if (!canvas) return null;
  
  try {
    return canvas.getElement() as HTMLCanvasElement;
  } catch (e) {
    console.error('Error getting canvas element:', e);
    return null;
  }
}

/**
 * Check if canvas is disposed
 * @param canvas Canvas to check
 * @returns True if canvas is disposed
 */
export function isCanvasDisposed(canvas: FabricCanvas | null): boolean {
  if (!canvas) return true;
  
  try {
    return Boolean(canvas.disposed);
  } catch (e) {
    console.error('Error checking if canvas is disposed:', e);
    return true;
  }
}
