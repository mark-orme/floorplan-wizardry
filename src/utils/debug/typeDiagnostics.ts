
/**
 * Type diagnostics utilities
 * Provides functions for validating and troubleshooting types
 * @module utils/debug/typeDiagnostics
 */
import { 
  FloorPlan, 
  Stroke, 
  Room, 
  Wall,
  isValidFloorPlan,
  isValidStroke, 
  isValidRoom 
} from '@/types/floor-plan/unifiedTypes';

// Re-export the validator functions with aliases to maintain compatibility
export { 
  isValidFloorPlan, 
  isValidStroke, 
  isValidRoom 
};

/**
 * Validate a wall object
 * @param wall - Wall to validate
 * @returns Whether wall is valid
 */
export function isValidWall(wall: any): boolean {
  if (!wall) return false;
  
  return (
    typeof wall.id === 'string' &&
    Array.isArray(wall.points) &&
    typeof wall.start === 'object' &&
    typeof wall.start.x === 'number' &&
    typeof wall.start.y === 'number' &&
    typeof wall.end === 'object' &&
    typeof wall.end.x === 'number' &&
    typeof wall.end.y === 'number' &&
    typeof wall.thickness === 'number' &&
    typeof wall.color === 'string' &&
    Array.isArray(wall.roomIds) &&
    typeof wall.length === 'number'
  );
}

/**
 * Validate a floor plan with detailed reporting
 * @param floorPlan - Floor plan to validate
 * @param source - Source of validation for logging
 * @returns Whether floor plan is valid
 */
export function validateFloorPlanWithReporting(floorPlan: any, source: string = 'unknown'): boolean {
  if (!floorPlan) {
    console.error(`[${source}] FloorPlan validation failed: undefined or null`);
    return false;
  }
  
  // Check required properties
  const requiredProps = [
    'id', 'name', 'label', 'walls', 'rooms', 'strokes', 
    'createdAt', 'updatedAt', 'gia', 'level', 'data', 'userId'
  ];
  
  for (const prop of requiredProps) {
    if (floorPlan[prop] === undefined) {
      console.error(`[${source}] FloorPlan validation failed: missing ${prop} property`);
      console.warn('FloorPlan structure:', Object.keys(floorPlan));
      return false;
    }
  }
  
  // Check array properties
  const arrayProps = ['walls', 'rooms', 'strokes'];
  for (const prop of arrayProps) {
    if (!Array.isArray(floorPlan[prop])) {
      console.error(`[${source}] FloorPlan validation failed: ${prop} is not an array`);
      return false;
    }
  }
  
  // Specific checks for data and userId
  if (typeof floorPlan.data !== 'object') {
    console.error(`[${source}] FloorPlan validation failed: data is not an object`);
    return false;
  }
  
  if (typeof floorPlan.userId !== 'string') {
    console.error(`[${source}] FloorPlan validation failed: userId is not a string`);
    return false;
  }
  
  return true;
}

/**
 * Log detailed type information about an object
 * @param obj - Object to log
 * @param label - Label for logging
 */
export function logTypeInfo(obj: any, label: string = 'Object'): void {
  console.group(`Type info for ${label}`);
  
  if (!obj) {
    console.log('Object is null or undefined');
    console.groupEnd();
    return;
  }
  
  // Basic type info
  console.log('Type:', typeof obj);
  console.log('Constructor:', obj.constructor?.name);
  
  // If it's an object, log its keys and their types
  if (typeof obj === 'object' && obj !== null) {
    console.log('Keys:', Object.keys(obj));
    
    console.group('Properties');
    for (const key in obj) {
      const value = obj[key];
      console.log(`${key}:`, typeof value, Array.isArray(value) ? 'Array' : '', value);
    }
    console.groupEnd();
    
    // Special handling for arrays
    if (Array.isArray(obj) && obj.length > 0) {
      console.group('Array item sample');
      console.log('First item:', obj[0]);
      console.log('First item type:', typeof obj[0]);
      console.groupEnd();
    }
  }
  
  // Check for common interfaces
  console.group('Interface checks');
  console.log('Is FloorPlan:', isValidFloorPlan(obj));
  console.log('Is Stroke:', isValidStroke(obj));
  console.log('Is Room:', isValidRoom(obj));
  console.log('Is Wall:', isValidWall(obj));
  console.groupEnd();
  
  console.groupEnd();
}
