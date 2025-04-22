
/**
 * Type Diagnostics Utilities
 * Provides functions to check and debug typescript types
 */
import { FloorPlanMetadata } from '@/types/floor-plan/unifiedTypes';

/**
 * Create a complete metadata object with all required fields
 * @param partial Partial metadata to merge
 * @returns Complete metadata object
 */
export function createCompleteMetadata(partial: Partial<FloorPlanMetadata> = {}): FloorPlanMetadata {
  const now = new Date().toISOString();
  
  return {
    createdAt: partial.createdAt || now,
    updatedAt: partial.updatedAt || now,
    paperSize: partial.paperSize || 'A4',
    level: partial.level || 0,
    version: partial.version || '1.0',
    author: partial.author || 'System',
    notes: partial.notes || '',
    dateCreated: partial.dateCreated || now,
    lastModified: partial.lastModified || now
  };
}

/**
 * Type checker for debugging purposes
 * @param value Value to check
 * @param expectedType Expected type name
 * @returns True if value matches expected type
 */
export function checkTypeMatch<T>(value: any, expectedType: string): boolean {
  const actualType = typeof value;
  const isMatch = actualType === expectedType;
  
  if (!isMatch) {
    console.warn(`Type mismatch: Expected ${expectedType}, got ${actualType}`);
  }
  
  return isMatch;
}

/**
 * Validate object against interface properties
 * @param obj Object to validate
 * @param requiredKeys Array of required property names
 * @returns True if all required properties exist
 */
export function validateRequiredProperties(obj: any, requiredKeys: string[]): boolean {
  const missingKeys = requiredKeys.filter(key => !(key in obj));
  
  if (missingKeys.length > 0) {
    console.warn(`Missing required properties: ${missingKeys.join(', ')}`);
    return false;
  }
  
  return true;
}

/**
 * Utility to check if an object conforms to a FloorPlan shape
 * @param obj Object to check
 * @returns True if object has FloorPlan shape
 */
export function isFloorPlanShape(obj: any): boolean {
  return validateRequiredProperties(obj, [
    'id', 'name', 'walls', 'rooms', 'strokes', 
    'createdAt', 'updatedAt', 'metadata', 'data', 'userId'
  ]);
}
