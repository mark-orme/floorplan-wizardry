
/**
 * Global type check utility
 * @module utils/debug/globalTypeCheck
 */
import { FloorPlan, Wall, Room, Stroke } from '@/types/floor-plan/unifiedTypes';
import { 
  validateFloorPlan,
  validateWall, 
  validateRoom, 
  validateStroke 
} from './typeDiagnostics';

/**
 * Type validation registry
 * Contains functions to validate different types
 */
export const TypeValidationRegistry = {
  FloorPlan: validateFloorPlan,
  Wall: validateWall,
  Room: validateRoom,
  Stroke: validateStroke,
};

/**
 * Run all type validations on an object
 * @param obj Object to validate
 * @returns Results of validation
 */
export function validateObjectType(obj: any): Record<string, boolean> {
  const results: Record<string, boolean> = {};
  
  for (const [typeName, validator] of Object.entries(TypeValidationRegistry)) {
    results[typeName] = validator(obj);
  }
  
  return results;
}

/**
 * Get a human-readable description of an object's type
 * @param obj Object to describe
 * @returns Human-readable type description
 */
export function getObjectType(obj: any): string {
  const validationResults = validateObjectType(obj);
  const validTypes = Object.entries(validationResults)
    .filter(([_, isValid]) => isValid)
    .map(([typeName]) => typeName);
  
  if (validTypes.length > 0) {
    return `${validTypes.join(', ')}`;
  }
  
  return typeof obj;
}
