
/**
 * Type diagnostic utilities
 * Helps diagnose and validate type-related issues across the codebase
 * @module utils/debug/typeDiagnostics
 */
import { 
  FloorPlan, 
  Room, 
  Wall,
  Stroke, 
  asStrokeType, 
  asRoomType 
} from '@/types/floor-plan/unifiedTypes';

/**
 * Validate that a floor plan has all required properties
 * @param plan Floor plan to validate
 * @returns Whether the floor plan is valid
 */
export function isValidFloorPlan(plan: Partial<FloorPlan>): boolean {
  if (!plan) return false;
  
  // Check required properties
  const required = [
    'id', 'name', 'label', 'walls', 'rooms', 'strokes', 
    'createdAt', 'updatedAt', 'data', 'userId'
  ];
  
  for (const prop of required) {
    if (plan[prop as keyof FloorPlan] === undefined) {
      console.error(`FloorPlan is missing required property: ${prop}`);
      return false;
    }
  }
  
  return true;
}

/**
 * Validate that a room has all required properties
 * @param room Room to validate
 * @returns Whether the room is valid
 */
export function isValidRoom(room: Partial<Room>): boolean {
  if (!room) return false;
  
  // Check required properties
  const required = ['id', 'name', 'type', 'points', 'color', 'area', 'level', 'walls'];
  
  for (const prop of required) {
    if (room[prop as keyof Room] === undefined) {
      console.error(`Room is missing required property: ${prop}`);
      return false;
    }
  }
  
  // Validate room type if present
  if (room.type && typeof room.type === 'string') {
    const validType = asRoomType(room.type);
    if (validType !== room.type) {
      console.error(`Invalid room type: ${room.type}, converted to ${validType}`);
      return false;
    }
  }
  
  return true;
}

/**
 * Validate that a wall has all required properties
 * @param wall Wall to validate
 * @returns Whether the wall is valid
 */
export function isValidWall(wall: Partial<Wall>): boolean {
  if (!wall) return false;
  
  // Check required properties
  const required = ['id', 'points', 'start', 'end', 'thickness', 'color', 'roomIds', 'length'];
  
  for (const prop of required) {
    if (wall[prop as keyof Wall] === undefined) {
      console.error(`Wall is missing required property: ${prop}`);
      return false;
    }
  }
  
  return true;
}

/**
 * Validate that a stroke has all required properties
 * @param stroke Stroke to validate
 * @returns Whether the stroke is valid
 */
export function isValidStroke(stroke: Partial<Stroke>): boolean {
  if (!stroke) return false;
  
  // Check required properties
  const required = ['id', 'points', 'type', 'color', 'thickness', 'width'];
  
  for (const prop of required) {
    if (stroke[prop as keyof Stroke] === undefined) {
      console.error(`Stroke is missing required property: ${prop}`);
      return false;
    }
  }
  
  // Validate stroke type if present
  if (stroke.type && typeof stroke.type === 'string') {
    const validType = asStrokeType(stroke.type);
    if (validType !== stroke.type) {
      console.error(`Invalid stroke type: ${stroke.type}, converted to ${validType}`);
      return false;
    }
  }
  
  return true;
}

/**
 * Validate a floor plan and report any issues
 * @param plan Floor plan to validate
 * @param context Context for error reporting
 * @returns Whether the floor plan is valid
 */
export function validateFloorPlanWithReporting(plan: Partial<FloorPlan>, context = 'unknown'): boolean {
  if (!plan) {
    console.error(`[${context}] Floor plan is null or undefined`);
    return false;
  }
  
  // Check required properties
  const required = [
    'id', 'name', 'label', 'walls', 'rooms', 'strokes', 
    'createdAt', 'updatedAt', 'data', 'userId'
  ];
  
  let isValid = true;
  
  for (const prop of required) {
    if (plan[prop as keyof FloorPlan] === undefined) {
      console.error(`[${context}] FloorPlan is missing required property: ${prop}`);
      isValid = false;
    }
  }
  
  // Validate arrays if present
  if (plan.walls) {
    for (let i = 0; i < plan.walls.length; i++) {
      if (!isValidWall(plan.walls[i])) {
        console.error(`[${context}] Invalid wall at index ${i}`);
        isValid = false;
      }
    }
  }
  
  if (plan.rooms) {
    for (let i = 0; i < plan.rooms.length; i++) {
      if (!isValidRoom(plan.rooms[i])) {
        console.error(`[${context}] Invalid room at index ${i}`);
        isValid = false;
      }
    }
  }
  
  if (plan.strokes) {
    for (let i = 0; i < plan.strokes.length; i++) {
      if (!isValidStroke(plan.strokes[i])) {
        console.error(`[${context}] Invalid stroke at index ${i}`);
        isValid = false;
      }
    }
  }
  
  return isValid;
}

// Expose to window for debugging in development
if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
  (window as any).__DEBUG_validateFloorPlan = validateFloorPlanWithReporting;
  (window as any).__DEBUG_isValidFloorPlan = isValidFloorPlan;
  (window as any).__DEBUG_isValidRoom = isValidRoom;
  (window as any).__DEBUG_isValidWall = isValidWall;
  (window as any).__DEBUG_isValidStroke = isValidStroke;
  
  console.log('Global type checkers initialized. Use window.__DEBUG_validateFloorPlan(), etc.');
}
