
/**
 * Type Diagnostics Utilities
 * Provides validation helpers for floor plan data structures
 */

import {
  FloorPlan,
  Stroke,
  Room,
  Wall,
  StrokeTypeLiteral,
  RoomTypeLiteral,
  asStrokeType,
  asRoomType
} from '@/types/floor-plan/typesBarrel';

// Export these validation functions
export function validateFloorPlan(floorPlan: any): boolean {
  if (!floorPlan) return false;
  if (!floorPlan.id) return false;
  if (!floorPlan.data) return false;  
  if (!floorPlan.userId) return false;
  return true;
}

export function validateRoom(room: any): boolean {
  if (!room) return false;
  if (!room.id) return false;
  if (!room.type) return false;
  return true;
}

export function validateStroke(stroke: any): boolean {
  if (!stroke) return false;
  if (!stroke.id) return false;
  if (!stroke.type) return false;
  return true;
}

export function validateWall(wall: any): boolean {
  if (!wall) return false;
  if (!wall.id) return false;
  if (!wall.roomIds) return false;
  return true;
}

/**
 * Validates a floor plan with detailed reporting
 * @param floorPlan Floor plan to validate
 * @param source Source of the validation (for debugging)
 * @returns Whether the floor plan is valid
 */
export function validateFloorPlanWithReporting(floorPlan: any, source: string = 'unknown'): boolean {
  if (!floorPlan) {
    console.error(`[${source}] FloorPlan is null or undefined`);
    return false;
  }

  const errors: string[] = [];
  
  if (!floorPlan.id) errors.push('Missing id property');
  if (!floorPlan.data) errors.push('Missing data property'); 
  if (!floorPlan.userId) errors.push('Missing userId property');
  
  if (errors.length > 0) {
    console.error(`[${source}] FloorPlan validation errors:`, errors, floorPlan);
    return false;
  }
  
  return true;
}

/**
 * Validates a room with detailed reporting
 * @param room Room to validate
 * @param source Source of the validation (for debugging)
 * @returns Whether the room is valid
 */
export function validateRoomWithReporting(room: any, source: string = 'unknown'): boolean {
  if (!room) {
    console.error(`[${source}] Room is null or undefined`);
    return false;
  }

  const errors: string[] = [];
  
  if (!room.id) errors.push('Missing id property');
  if (!room.type) errors.push('Missing type property');
  
  // Validate type is a valid RoomTypeLiteral
  if (room.type && typeof room.type === 'string') {
    try {
      asRoomType(room.type);
    } catch (e) {
      errors.push(`Invalid room type: ${room.type}`);
    }
  }
  
  if (errors.length > 0) {
    console.error(`[${source}] Room validation errors:`, errors, room);
    return false;
  }
  
  return true;
}

/**
 * Validates a stroke with detailed reporting
 * @param stroke Stroke to validate
 * @param source Source of the validation (for debugging)
 * @returns Whether the stroke is valid
 */
export function validateStrokeWithReporting(stroke: any, source: string = 'unknown'): boolean {
  if (!stroke) {
    console.error(`[${source}] Stroke is null or undefined`);
    return false;
  }

  const errors: string[] = [];
  
  if (!stroke.id) errors.push('Missing id property');
  if (!stroke.type) errors.push('Missing type property');
  
  // Validate type is a valid StrokeTypeLiteral
  if (stroke.type && typeof stroke.type === 'string') {
    try {
      asStrokeType(stroke.type);
    } catch (e) {
      errors.push(`Invalid stroke type: ${stroke.type}`);
    }
  }
  
  if (errors.length > 0) {
    console.error(`[${source}] Stroke validation errors:`, errors, stroke);
    return false;
  }
  
  return true;
}

/**
 * Validates a wall with detailed reporting
 * @param wall Wall to validate
 * @param source Source of the validation (for debugging)
 * @returns Whether the wall is valid
 */
export function validateWallWithReporting(wall: any, source: string = 'unknown'): boolean {
  if (!wall) {
    console.error(`[${source}] Wall is null or undefined`);
    return false;
  }

  const errors: string[] = [];
  
  if (!wall.id) errors.push('Missing id property');
  if (!wall.roomIds) errors.push('Missing roomIds property');
  
  if (errors.length > 0) {
    console.error(`[${source}] Wall validation errors:`, errors, wall);
    return false;
  }
  
  return true;
}
