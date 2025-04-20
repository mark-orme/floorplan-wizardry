
/**
 * Type Diagnostics
 * Provides utilities for debugging type issues
 * @module utils/typeDiagnostics
 */

import { 
  Stroke, 
  Wall, 
  Room, 
  FloorPlan,
  StrokeTypeLiteral,
  RoomTypeLiteral
} from '@/types/floor-plan/unifiedTypes';

/**
 * Log detailed type information to the console
 * @param obj Object to inspect
 * @param name Name of the object for logging
 */
export function logTypeInfo(obj: any, name: string): void {
  console.log(`Type info for ${name}:`, {
    value: obj,
    type: typeof obj,
    keys: obj ? Object.keys(obj) : [],
    isNull: obj === null,
    isUndefined: obj === undefined
  });
}

/**
 * Validate a Stroke object and log any issues
 * @param stroke Stroke to validate
 * @returns Whether the stroke is valid
 */
export function validateStroke(stroke: any): boolean {
  if (!stroke) {
    console.error('Stroke is null or undefined');
    return false;
  }
  
  const issues = [];
  
  if (!stroke.id) issues.push('Missing id');
  if (!stroke.points || !Array.isArray(stroke.points)) issues.push('Invalid points array');
  if (!stroke.type) issues.push('Missing type');
  
  // Use our type guard to check if the type is valid
  if (stroke.type && typeof stroke.type === 'string') {
    const validTypes = [
      'line', 'polyline', 'wall', 'door', 'window', 
      'furniture', 'annotation', 'freehand', 'straight',
      'room', 'dimension', 'text', 'other'
    ];
    
    if (!validTypes.includes(stroke.type)) {
      issues.push(`Invalid type: "${stroke.type}". Valid types are: ${validTypes.join(', ')}`);
    }
  }
  
  if (issues.length > 0) {
    console.error(`Stroke validation failed:`, issues, stroke);
    return false;
  }
  
  return true;
}

/**
 * Validate a Wall object and log any issues
 * @param wall Wall to validate
 * @returns Whether the wall is valid
 */
export function validateWall(wall: any): boolean {
  if (!wall) {
    console.error('Wall is null or undefined');
    return false;
  }
  
  const issues = [];
  
  if (!wall.id) issues.push('Missing id');
  if (!wall.start || typeof wall.start.x !== 'number') issues.push('Invalid start point');
  if (!wall.end || typeof wall.end.x !== 'number') issues.push('Invalid end point');
  if (!wall.roomIds || !Array.isArray(wall.roomIds)) issues.push('Missing roomIds array');
  if (typeof wall.length !== 'number') issues.push('Missing length property');
  
  if (issues.length > 0) {
    console.error(`Wall validation failed:`, issues, wall);
    return false;
  }
  
  return true;
}

/**
 * Validate a Room object and log any issues
 * @param room Room to validate
 * @returns Whether the room is valid
 */
export function validateRoom(room: any): boolean {
  if (!room) {
    console.error('Room is null or undefined');
    return false;
  }
  
  const issues = [];
  
  if (!room.id) issues.push('Missing id');
  if (!room.name) issues.push('Missing name');
  if (!room.type) issues.push('Missing type');
  if (!room.points || !Array.isArray(room.points)) issues.push('Invalid points array');
  
  // Use our type guard to check if the type is valid
  if (room.type && typeof room.type === 'string') {
    const validTypes = ['living', 'bedroom', 'kitchen', 'bathroom', 'office', 'other'];
    
    if (!validTypes.includes(room.type)) {
      issues.push(`Invalid type: "${room.type}". Valid types are: ${validTypes.join(', ')}`);
    }
  }
  
  if (issues.length > 0) {
    console.error(`Room validation failed:`, issues, room);
    return false;
  }
  
  return true;
}

/**
 * Validate a FloorPlan object and log any issues
 * @param floorPlan FloorPlan to validate
 * @returns Whether the floor plan is valid
 */
export function validateFloorPlan(floorPlan: any): boolean {
  if (!floorPlan) {
    console.error('FloorPlan is null or undefined');
    return false;
  }
  
  const issues = [];
  
  if (!floorPlan.id) issues.push('Missing id');
  if (!floorPlan.name) issues.push('Missing name');
  if (!floorPlan.walls || !Array.isArray(floorPlan.walls)) issues.push('Invalid walls array');
  if (!floorPlan.rooms || !Array.isArray(floorPlan.rooms)) issues.push('Invalid rooms array');
  if (!floorPlan.strokes || !Array.isArray(floorPlan.strokes)) issues.push('Invalid strokes array');
  
  // Required properties check
  if (floorPlan.data === undefined) issues.push('Missing data property');
  if (!floorPlan.userId) issues.push('Missing userId property');
  
  if (issues.length > 0) {
    console.error(`FloorPlan validation failed:`, issues, floorPlan);
    return false;
  }
  
  // Validate nested objects
  let valid = true;
  
  floorPlan.walls.forEach((wall: any, index: number) => {
    const isValid = validateWall(wall);
    if (!isValid) {
      console.error(`Invalid wall at index ${index}`);
      valid = false;
    }
  });
  
  floorPlan.rooms.forEach((room: any, index: number) => {
    const isValid = validateRoom(room);
    if (!isValid) {
      console.error(`Invalid room at index ${index}`);
      valid = false;
    }
  });
  
  floorPlan.strokes.forEach((stroke: any, index: number) => {
    const isValid = validateStroke(stroke);
    if (!isValid) {
      console.error(`Invalid stroke at index ${index}`);
      valid = false;
    }
  });
  
  return valid;
}

/**
 * Global registration of type validators
 * Registers validators on the global window object for debugging from the console
 */
export function registerTypeValidators(): void {
  if (typeof window !== 'undefined') {
    (window as any).__DEBUG_validateStroke = validateStroke;
    (window as any).__DEBUG_validateWall = validateWall;
    (window as any).__DEBUG_validateRoom = validateRoom;
    (window as any).__DEBUG_validateFloorPlan = validateFloorPlan;
    (window as any).__DEBUG_logTypeInfo = logTypeInfo;
    
    console.info('Global type checkers initialized. Use window.__DEBUG_validateFloorPlan(), etc.');
  }
}

// Initialize type validators in development environment
if (process.env.NODE_ENV !== 'production') {
  registerTypeValidators();
}
