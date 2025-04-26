
/**
 * Floor Plan Validators
 * Validation functions for floor plan data
 * @module utils/floorPlanAdapter/validators
 */
import { FloorPlan, Wall, Room, Point } from './index';

/**
 * ValidationError class for floor plan validation errors
 */
export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

/**
 * Validate a point object
 * @param point Point to validate
 * @param context Context for error messages
 */
export function validatePoint(point: Point, context: string = 'point'): void {
  if (!point) {
    throw new ValidationError(`${context} is required`);
  }
  
  if (typeof point.x !== 'number') {
    throw new ValidationError(`${context}.x must be a number`);
  }
  
  if (typeof point.y !== 'number') {
    throw new ValidationError(`${context}.y must be a number`);
  }
  
  if (isNaN(point.x) || isNaN(point.y)) {
    throw new ValidationError(`${context} contains NaN values`);
  }
}

/**
 * Validate a wall object
 * @param wall Wall to validate
 */
export function validateWall(wall: Wall): void {
  if (!wall) {
    throw new ValidationError('Wall is required');
  }
  
  if (!wall.id) {
    throw new ValidationError('Wall must have an ID');
  }
  
  validatePoint(wall.start, 'wall.start');
  validatePoint(wall.end, 'wall.end');
  
  if (typeof wall.thickness !== 'number' || wall.thickness <= 0) {
    throw new ValidationError('Wall thickness must be a positive number');
  }
  
  if (wall.height !== undefined && (typeof wall.height !== 'number' || wall.height <= 0)) {
    throw new ValidationError('Wall height must be a positive number');
  }
}

/**
 * Validate a room object
 * @param room Room to validate
 */
export function validateRoom(room: Room): void {
  if (!room) {
    throw new ValidationError('Room is required');
  }
  
  if (!room.id) {
    throw new ValidationError('Room must have an ID');
  }
  
  if (!Array.isArray(room.walls)) {
    throw new ValidationError('Room walls must be an array');
  }
  
  if (room.walls.length < 3) {
    throw new ValidationError('Room must have at least 3 walls');
  }
  
  if (room.area !== undefined && (typeof room.area !== 'number' || room.area <= 0)) {
    throw new ValidationError('Room area must be a positive number');
  }
}

/**
 * Validate a floor plan object
 * @param floorPlan FloorPlan to validate
 */
export function validateFloorPlan(floorPlan: FloorPlan): void {
  if (!floorPlan) {
    throw new ValidationError('FloorPlan is required');
  }
  
  if (!floorPlan.id) {
    throw new ValidationError('FloorPlan must have an ID');
  }
  
  if (!floorPlan.name) {
    throw new ValidationError('FloorPlan must have a name');
  }
  
  if (!Array.isArray(floorPlan.walls)) {
    throw new ValidationError('FloorPlan walls must be an array');
  }
  
  if (!Array.isArray(floorPlan.rooms)) {
    throw new ValidationError('FloorPlan rooms must be an array');
  }
  
  // Validate all walls
  floorPlan.walls.forEach((wall, index) => {
    try {
      validateWall(wall);
    } catch (error) {
      throw new ValidationError(`Invalid wall at index ${index}: ${(error as Error).message}`);
    }
  });
  
  // Validate all rooms
  floorPlan.rooms.forEach((room, index) => {
    try {
      validateRoom(room);
    } catch (error) {
      throw new ValidationError(`Invalid room at index ${index}: ${(error as Error).message}`);
    }
  });
  
  // Check for duplicate wall IDs
  const wallIds = new Set<string>();
  for (const wall of floorPlan.walls) {
    if (wallIds.has(wall.id)) {
      throw new ValidationError(`Duplicate wall ID: ${wall.id}`);
    }
    wallIds.add(wall.id);
  }
  
  // Check for duplicate room IDs
  const roomIds = new Set<string>();
  for (const room of floorPlan.rooms) {
    if (roomIds.has(room.id)) {
      throw new ValidationError(`Duplicate room ID: ${room.id}`);
    }
    roomIds.add(room.id);
  }
  
  // Check that all room walls exist in walls array
  for (const room of floorPlan.rooms) {
    for (const wallId of room.walls) {
      if (!wallIds.has(wallId)) {
        throw new ValidationError(`Room ${room.id} references non-existent wall: ${wallId}`);
      }
    }
  }
}

/**
 * Check if a floor plan is valid
 * @param floorPlan FloorPlan to validate
 * @returns True if valid, false otherwise
 */
export function isValidFloorPlan(floorPlan: any): floorPlan is FloorPlan {
  try {
    validateFloorPlan(floorPlan as FloorPlan);
    return true;
  } catch (error) {
    return false;
  }
}
