
/**
 * Type diagnostics utilities
 * Provides utilities for validating and debugging types
 * @module utils/debug/typeDiagnostics
 */

import { 
  FloorPlan, 
  Stroke, 
  Wall, 
  Room,
  createEmptyFloorPlan,
  createEmptyStroke,
  createEmptyWall,
  createEmptyRoom
} from '@/types/floor-plan/typesBarrel';

/**
 * Check if an object has a property
 * @param obj Object to check
 * @param prop Property name
 * @returns Whether the object has the property
 */
function hasProperty(obj: any, prop: string): boolean {
  return obj && typeof obj === 'object' && prop in obj;
}

/**
 * Validates that a floor plan has all required properties
 * @param floorPlan FloorPlan to validate
 * @returns Whether the floor plan is valid
 */
export function isValidFloorPlan(floorPlan: any): floorPlan is FloorPlan {
  return (
    floorPlan &&
    typeof floorPlan === 'object' &&
    typeof floorPlan.id === 'string' &&
    typeof floorPlan.name === 'string' &&
    typeof floorPlan.label === 'string' &&
    Array.isArray(floorPlan.walls) &&
    Array.isArray(floorPlan.rooms) &&
    Array.isArray(floorPlan.strokes) &&
    typeof floorPlan.createdAt === 'string' &&
    typeof floorPlan.updatedAt === 'string' &&
    typeof floorPlan.level === 'number' &&
    typeof floorPlan.data === 'object' &&
    typeof floorPlan.userId === 'string'
  );
}

/**
 * Validates that a stroke has all required properties
 * @param stroke Stroke to validate
 * @returns Whether the stroke is valid
 */
export function isValidStroke(stroke: any): stroke is Stroke {
  return (
    stroke &&
    typeof stroke === 'object' &&
    typeof stroke.id === 'string' &&
    Array.isArray(stroke.points) &&
    typeof stroke.type === 'string' &&
    typeof stroke.color === 'string' &&
    typeof stroke.thickness === 'number' &&
    typeof stroke.width === 'number'
  );
}

/**
 * Validates that a wall has all required properties
 * @param wall Wall to validate
 * @returns Whether the wall is valid
 */
export function isValidWall(wall: any): wall is Wall {
  return (
    wall &&
    typeof wall === 'object' &&
    typeof wall.id === 'string' &&
    hasProperty(wall, 'start') &&
    hasProperty(wall, 'end') &&
    typeof wall.thickness === 'number' &&
    typeof wall.color === 'string' &&
    Array.isArray(wall.roomIds) &&
    typeof wall.length === 'number'
  );
}

/**
 * Validates that a room has all required properties
 * @param room Room to validate
 * @returns Whether the room is valid
 */
export function isValidRoom(room: any): room is Room {
  return (
    room &&
    typeof room === 'object' &&
    typeof room.id === 'string' &&
    typeof room.name === 'string' &&
    typeof room.type === 'string' &&
    Array.isArray(room.points) &&
    typeof room.color === 'string' &&
    typeof room.area === 'number' &&
    typeof room.level === 'number' &&
    Array.isArray(room.walls)
  );
}

/**
 * Reports validation failures for a floor plan
 * @param floorPlan FloorPlan to validate
 * @param context Context for error reporting
 * @returns Whether the floor plan is valid
 */
export function validateFloorPlanWithReporting(floorPlan: any, context: string = ''): floorPlan is FloorPlan {
  const issues: string[] = [];

  // Check required primitive properties
  for (const prop of ['id', 'name', 'label', 'createdAt', 'updatedAt', 'userId']) {
    if (typeof floorPlan[prop] !== 'string') {
      issues.push(`Missing or invalid ${prop}: ${floorPlan[prop]}`);
    }
  }

  // Check required numeric properties
  for (const prop of ['level', 'index', 'gia']) {
    if (typeof floorPlan[prop] !== 'number') {
      issues.push(`Missing or invalid ${prop}: ${floorPlan[prop]}`);
    }
  }

  // Check data object
  if (!floorPlan.data || typeof floorPlan.data !== 'object') {
    issues.push(`Missing or invalid data object: ${floorPlan.data}`);
  }

  // Check array properties
  for (const prop of ['walls', 'rooms', 'strokes']) {
    if (!Array.isArray(floorPlan[prop])) {
      issues.push(`Missing or invalid ${prop} array: ${floorPlan[prop]}`);
    }
  }

  // Log issues if any were found
  if (issues.length > 0) {
    console.warn(`Floor plan validation issues in ${context}:`, issues);
    console.warn('FloorPlan:', floorPlan);
    return false;
  }

  return true;
}

/**
 * Fixes a floor plan by filling in missing properties
 * @param floorPlan Partial floor plan
 * @returns Complete floor plan
 */
export function ensureFloorPlan(floorPlan: Partial<FloorPlan>): FloorPlan {
  if (isValidFloorPlan(floorPlan)) {
    return floorPlan;
  }
  
  // Create a base floor plan with defaults
  const base = createEmptyFloorPlan();
  
  // Merge the partial floor plan with the base
  return { ...base, ...floorPlan };
}

/**
 * Fixes a stroke by filling in missing properties
 * @param stroke Partial stroke
 * @returns Complete stroke
 */
export function ensureStroke(stroke: Partial<Stroke>): Stroke {
  if (isValidStroke(stroke)) {
    return stroke;
  }
  
  // Create a base stroke with defaults
  const base = createEmptyStroke();
  
  // Merge the partial stroke with the base
  return { ...base, ...stroke };
}

/**
 * Fixes a wall by filling in missing properties
 * @param wall Partial wall
 * @returns Complete wall
 */
export function ensureWall(wall: Partial<Wall>): Wall {
  if (isValidWall(wall)) {
    return wall;
  }
  
  // Create a base wall with defaults
  const base = createEmptyWall();
  
  // Merge the partial wall with the base
  return { ...base, ...stroke };
}

/**
 * Fixes a room by filling in missing properties
 * @param room Partial room
 * @returns Complete room
 */
export function ensureRoom(room: Partial<Room>): Room {
  if (isValidRoom(room)) {
    return room;
  }
  
  // Create a base room with defaults
  const base = createEmptyRoom();
  
  // Merge the partial room with the base
  return { ...base, ...room };
}

/**
 * Logs type information for debugging
 * @param obj Object to log
 * @param label Optional label
 */
export function logTypeInfo(obj: any, label: string = ''): void {
  if (process.env.NODE_ENV === 'production') {
    return;
  }
  
  console.log(`[TypeInfo] ${label || 'Object'}:`, {
    type: typeof obj,
    isArray: Array.isArray(obj),
    keys: obj && typeof obj === 'object' ? Object.keys(obj) : undefined,
    value: obj
  });
}
