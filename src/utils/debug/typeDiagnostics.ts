
/**
 * Type Diagnostics Utilities
 * Provides diagnostic tools for debugging type issues
 * @module utils/debug/typeDiagnostics
 */
import { FloorPlan, Room, Stroke, Wall } from '@/types/floor-plan/unifiedTypes';

/**
 * Log detailed type information for debugging
 * @param value Value to log
 * @param label Optional label to identify the log
 */
export function logTypeInfo(value: any, label = 'TypeInfo'): void {
  if (process.env.NODE_ENV === 'production') return;
  
  const typeInfo = {
    value: value,
    typeof: typeof value,
    constructor: value && value.constructor ? value.constructor.name : 'none',
    keys: value ? Object.keys(value) : [],
    isArray: Array.isArray(value),
    isObject: value !== null && typeof value === 'object' && !Array.isArray(value)
  };
  
  console.log(`[${label}]`, typeInfo);
}

/**
 * Validate if an object is a valid FloorPlan
 * @param plan Object to validate
 * @returns True if valid, false otherwise
 */
export function isValidFloorPlan(plan: any): plan is FloorPlan {
  return (
    plan &&
    typeof plan === 'object' &&
    typeof plan.id === 'string' &&
    typeof plan.name === 'string' &&
    Array.isArray(plan.walls) &&
    Array.isArray(plan.rooms) &&
    Array.isArray(plan.strokes) &&
    typeof plan.userId === 'string' &&
    typeof plan.data === 'object'
  );
}

/**
 * Validate if an object is a valid Room
 * @param room Object to validate
 * @returns True if valid, false otherwise
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
 * Validate if an object is a valid Wall
 * @param wall Object to validate
 * @returns True if valid, false otherwise
 */
export function isValidWall(wall: any): wall is Wall {
  return (
    wall &&
    typeof wall === 'object' &&
    typeof wall.id === 'string' &&
    wall.start &&
    typeof wall.start.x === 'number' &&
    typeof wall.start.y === 'number' &&
    wall.end &&
    typeof wall.end.x === 'number' &&
    typeof wall.end.y === 'number' &&
    typeof wall.thickness === 'number' &&
    typeof wall.color === 'string' &&
    Array.isArray(wall.roomIds) &&
    typeof wall.length === 'number'
  );
}

/**
 * Validate if an object is a valid Stroke
 * @param stroke Object to validate
 * @returns True if valid, false otherwise
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
 * Validate a floor plan with detailed reporting
 * @param plan Object to validate
 * @param source Source of the validation call for logging
 * @returns True if valid, false with error logs otherwise
 */
export function validateFloorPlanWithReporting(plan: any, source = 'unknown'): boolean {
  if (!plan) {
    console.error(`[${source}] FloorPlan validation failed: Plan is null or undefined`);
    return false;
  }
  
  // Check for required properties
  const requiredProps = ['id', 'name', 'walls', 'rooms', 'strokes', 'data', 'userId'];
  const missingProps = requiredProps.filter(prop => !(prop in plan));
  
  if (missingProps.length > 0) {
    console.error(`[${source}] FloorPlan validation failed: Missing properties: ${missingProps.join(', ')}`);
    console.error(`Available properties: ${Object.keys(plan).join(', ')}`);
    return false;
  }
  
  // Validate property types
  const validTypes = 
    typeof plan.id === 'string' &&
    typeof plan.name === 'string' &&
    Array.isArray(plan.walls) &&
    Array.isArray(plan.rooms) &&
    Array.isArray(plan.strokes) &&
    typeof plan.data === 'object' &&
    typeof plan.userId === 'string';
  
  if (!validTypes) {
    console.error(`[${source}] FloorPlan validation failed: Property types are incorrect`);
    console.error({
      id: typeof plan.id,
      name: typeof plan.name,
      walls: Array.isArray(plan.walls),
      rooms: Array.isArray(plan.rooms),
      strokes: Array.isArray(plan.strokes),
      data: typeof plan.data,
      userId: typeof plan.userId
    });
    return false;
  }
  
  return true;
}
