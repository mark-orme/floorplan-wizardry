
/**
 * Canvas validation utilities
 * @module utils/fabric/canvasValidation
 */

import { FabricObject } from 'fabric';

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
export function doesObjectExist(canvas: any, id: ObjectId): boolean {
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
export function getObjectById(canvas: any, id: ObjectId): FabricObject | null {
  if (!canvas || !id) return null;
  const obj = canvas.getObjects().find((o: any) => o.id === id);
  return obj || null;
}
