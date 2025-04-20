
/**
 * Type diagnostics utilities
 * Validates object types with reporting
 * @module utils/debug/typeDiagnostics
 */
import type { FloorPlan, Room, Stroke, Wall } from '@/types/floor-plan/typesBarrel';

/**
 * Checks if a floor plan object is valid
 * @param floorPlan Floor plan to validate
 * @returns Whether the floor plan is valid
 */
export function isValidFloorPlan(floorPlan: any): floorPlan is FloorPlan {
  if (!floorPlan) return false;
  if (typeof floorPlan.id !== 'string') return false;
  if (typeof floorPlan.name !== 'string') return false;
  if (typeof floorPlan.label !== 'string') return false;
  if (!Array.isArray(floorPlan.walls)) return false;
  if (!Array.isArray(floorPlan.rooms)) return false;
  if (!Array.isArray(floorPlan.strokes)) return false;
  // Required properties check
  if (!floorPlan.data) return false;
  if (!floorPlan.userId) return false;
  
  return true;
}

/**
 * Checks if a room object is valid
 * @param room Room to validate
 * @returns Whether the room is valid
 */
export function isValidRoom(room: any): room is Room {
  if (!room) return false;
  if (typeof room.id !== 'string') return false;
  if (typeof room.name !== 'string') return false;
  if (!Array.isArray(room.points)) return false;
  // Make sure type is a valid RoomTypeLiteral
  const validRoomTypes = ['living', 'kitchen', 'bedroom', 'bathroom', 'dining', 'office', 'hallway', 'other'];
  if (!validRoomTypes.includes(room.type)) return false;
  
  return true;
}

/**
 * Checks if a stroke object is valid
 * @param stroke Stroke to validate
 * @returns Whether the stroke is valid
 */
export function isValidStroke(stroke: any): stroke is Stroke {
  if (!stroke) return false;
  if (typeof stroke.id !== 'string') return false;
  if (!Array.isArray(stroke.points)) return false;
  // Make sure type is a valid StrokeTypeLiteral
  const validStrokeTypes = ['line', 'curve', 'straight', 'freehand', 'polyline'];
  if (!validStrokeTypes.includes(stroke.type)) return false;
  
  return true;
}

/**
 * Checks if a wall object is valid
 * @param wall Wall to validate
 * @returns Whether the wall is valid
 */
export function isValidWall(wall: any): wall is Wall {
  if (!wall) return false;
  if (typeof wall.id !== 'string') return false;
  if (!wall.start || typeof wall.start.x !== 'number' || typeof wall.start.y !== 'number') return false;
  if (!wall.end || typeof wall.end.x !== 'number' || typeof wall.end.y !== 'number') return false;
  if (!Array.isArray(wall.points)) return false;
  if (!Array.isArray(wall.roomIds)) return false;
  if (typeof wall.length !== 'number') return false;
  
  return true;
}

/**
 * Validates a floor plan with detailed reporting
 * @param floorPlan Floor plan to validate
 * @param context Context for logging
 * @returns Whether the floor plan is valid
 */
export function validateFloorPlanWithReporting(floorPlan: any, context = 'validation'): boolean {
  if (!floorPlan) {
    console.error(`[${context}] Floor plan is null or undefined`);
    return false;
  }
  
  let isValid = true;
  const errors: string[] = [];
  
  // Check required properties
  if (typeof floorPlan.id !== 'string') {
    errors.push('id is missing or not a string');
    isValid = false;
  }
  
  if (typeof floorPlan.name !== 'string') {
    errors.push('name is missing or not a string');
    isValid = false;
  }
  
  if (typeof floorPlan.label !== 'string') {
    errors.push('label is missing or not a string');
    isValid = false;
  }
  
  if (!Array.isArray(floorPlan.walls)) {
    errors.push('walls is missing or not an array');
    isValid = false;
  }
  
  if (!Array.isArray(floorPlan.rooms)) {
    errors.push('rooms is missing or not an array');
    isValid = false;
  }
  
  if (!Array.isArray(floorPlan.strokes)) {
    errors.push('strokes is missing or not an array');
    isValid = false;
  }
  
  if (!floorPlan.data) {
    errors.push('data is missing');
    isValid = false;
  }
  
  if (!floorPlan.userId) {
    errors.push('userId is missing');
    isValid = false;
  }
  
  // Log errors if any
  if (!isValid) {
    console.error(`[${context}] Floor plan validation failed:`, errors);
  }
  
  return isValid;
}
