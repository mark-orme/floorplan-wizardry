
/**
 * Type Diagnostics Utilities
 * Provides validation helpers for floor plan data structures
 */

import {
  FloorPlan,
  Stroke,
  Room,
  Wall,
  asStrokeType,
  asRoomType,
  createTestFloorPlan,
  createTestStroke,
  createTestRoom,
  createTestWall
} from '@/types/floor-plan/unifiedTypes';

/**
 * Check if an object is a valid FloorPlan
 */
export function isValidFloorPlan(obj: any): obj is FloorPlan {
  if (!obj) {
    console.error('FloorPlan is null or undefined');
    return false;
  }

  const errors: string[] = [];
  
  if (!obj.id) errors.push('Missing id property');
  if (!obj.data) errors.push('Missing data property'); 
  if (!obj.userId) errors.push('Missing userId property');
  if (!obj.label) errors.push('Missing label property');
  if (!obj.metadata) errors.push('Missing metadata property');
  
  // Check the type of arrays
  if (!Array.isArray(obj.walls)) errors.push('walls is not an array');
  if (!Array.isArray(obj.rooms)) errors.push('rooms is not an array');
  if (!Array.isArray(obj.strokes)) errors.push('strokes is not an array');
  
  if (errors.length > 0) {
    console.error('FloorPlan validation errors:', errors, obj);
    return false;
  }
  
  return true;
}

/**
 * Fix a potentially invalid FloorPlan object by adding missing properties
 */
export function fixFloorPlan(obj: any): FloorPlan {
  console.log('Fixing FloorPlan object:', obj);
  return createTestFloorPlan(obj);
}

/**
 * Check if an object is a valid Stroke
 */
export function isValidStroke(obj: any): obj is Stroke {
  if (!obj) {
    console.error('Stroke is null or undefined');
    return false;
  }

  const errors: string[] = [];
  
  if (!obj.id) errors.push('Missing id property');
  if (!obj.type) errors.push('Missing type property');
  if (!obj.points) errors.push('Missing points property');
  if (!obj.color) errors.push('Missing color property');
  if (obj.thickness === undefined) errors.push('Missing thickness property');
  if (obj.width === undefined) errors.push('Missing width property');
  
  // Check if type is valid
  if (obj.type && typeof obj.type === 'string') {
    try {
      asStrokeType(obj.type);
    } catch (e) {
      errors.push(`Invalid stroke type: ${obj.type}`);
    }
  }
  
  if (errors.length > 0) {
    console.error('Stroke validation errors:', errors, obj);
    return false;
  }
  
  return true;
}

/**
 * Fix a potentially invalid Stroke object by adding missing properties
 */
export function fixStroke(obj: any): Stroke {
  console.log('Fixing Stroke object:', obj);
  return createTestStroke(obj);
}

/**
 * Check if an object is a valid Room
 */
export function isValidRoom(obj: any): obj is Room {
  if (!obj) {
    console.error('Room is null or undefined');
    return false;
  }

  const errors: string[] = [];
  
  if (!obj.id) errors.push('Missing id property');
  if (!obj.type) errors.push('Missing type property');
  if (!obj.name) errors.push('Missing name property');
  if (!obj.points) errors.push('Missing points property');
  if (!obj.color) errors.push('Missing color property');
  if (obj.area === undefined) errors.push('Missing area property');
  if (obj.level === undefined) errors.push('Missing level property');
  if (!Array.isArray(obj.walls)) errors.push('walls is not an array');
  
  // Check if type is valid
  if (obj.type && typeof obj.type === 'string') {
    try {
      asRoomType(obj.type);
    } catch (e) {
      errors.push(`Invalid room type: ${obj.type}`);
    }
  }
  
  if (errors.length > 0) {
    console.error('Room validation errors:', errors, obj);
    return false;
  }
  
  return true;
}

/**
 * Fix a potentially invalid Room object by adding missing properties
 */
export function fixRoom(obj: any): Room {
  console.log('Fixing Room object:', obj);
  return createTestRoom(obj);
}

/**
 * Log detailed type information for debugging
 */
export function logTypeInfo(obj: any, label: string = 'Object'): void {
  console.log(`Type Info for ${label}:`, {
    type: typeof obj,
    isArray: Array.isArray(obj),
    constructor: obj?.constructor?.name,
    keys: obj ? Object.keys(obj) : [],
    prototype: obj?.constructor?.prototype,
    toString: obj?.toString?.(),
  });
  
  if (obj && typeof obj === 'object') {
    console.log(`${label} properties:`, Object.entries(obj).reduce((acc, [key, value]) => {
      acc[key] = {
        type: typeof value,
        isArray: Array.isArray(value),
        isNull: value === null,
        isUndefined: value === undefined,
        sample: Array.isArray(value) ? 
          (value.length > 0 ? 
            typeof value[0] === 'object' ? 
              Object.keys(value[0]) : value[0] 
            : '[]') 
          : (typeof value === 'object' && value !== null ? Object.keys(value) : String(value).substring(0, 50))
      };
      return acc;
    }, {} as Record<string, any>));
  }
}
