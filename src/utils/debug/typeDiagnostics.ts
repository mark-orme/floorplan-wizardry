
/**
 * Type diagnostics utilities
 * Provides validation and creation functions for floor plan types
 * @module utils/debug/typeDiagnostics
 */
import type { 
  FloorPlan, 
  Stroke, 
  Room, 
  Wall, 
  Point, 
  FloorPlanMetadata,
  StrokeTypeLiteral,
  RoomTypeLiteral
} from '@/types/floor-plan/unifiedTypes';

/**
 * Validate a floor plan object
 * @param floorPlan Object to validate
 * @returns Whether the object is a valid floor plan
 */
export function validateFloorPlan(floorPlan: any): floorPlan is FloorPlan {
  if (!floorPlan) return false;
  
  return (
    typeof floorPlan.id === 'string' &&
    typeof floorPlan.name === 'string' &&
    Array.isArray(floorPlan.walls) &&
    Array.isArray(floorPlan.rooms) &&
    Array.isArray(floorPlan.strokes) &&
    typeof floorPlan.createdAt === 'string' &&
    typeof floorPlan.updatedAt === 'string' &&
    typeof floorPlan.level === 'number' &&
    floorPlan.metadata !== undefined
  );
}

/**
 * Validate a stroke object
 * @param stroke Object to validate
 * @returns Whether the object is a valid stroke
 */
export function validateStroke(stroke: any): stroke is Stroke {
  if (!stroke) return false;
  
  return (
    typeof stroke.id === 'string' &&
    Array.isArray(stroke.points) &&
    typeof stroke.type === 'string' &&
    typeof stroke.color === 'string' &&
    typeof stroke.thickness === 'number'
  );
}

/**
 * Validate a room object
 * @param room Object to validate
 * @returns Whether the object is a valid room
 */
export function validateRoom(room: any): room is Room {
  if (!room) return false;
  
  return (
    typeof room.id === 'string' &&
    typeof room.name === 'string' &&
    typeof room.type === 'string' &&
    (Array.isArray(room.vertices) || Array.isArray(room.points)) &&
    typeof room.area === 'number' &&
    (typeof room.perimeter === 'undefined' || typeof room.perimeter === 'number') &&
    (room.center === undefined || (typeof room.center === 'object')) &&
    (room.labelPosition === undefined || (typeof room.labelPosition === 'object')) &&
    typeof room.color === 'string'
  );
}

/**
 * Validate a wall object
 * @param wall Object to validate
 * @returns Whether the object is a valid wall
 */
export function validateWall(wall: any): wall is Wall {
  if (!wall) return false;
  
  return (
    typeof wall.id === 'string' &&
    wall.start !== undefined &&
    wall.end !== undefined &&
    typeof wall.thickness === 'number' &&
    typeof wall.color === 'string' &&
    (Array.isArray(wall.roomIds) || wall.roomIds === undefined) &&
    (typeof wall.length === 'number' || wall.length === undefined)
  );
}

/**
 * Calculate wall length from start and end points
 */
export function calculateWallLength(start: Point, end: Point): number {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Create a complete metadata object with all required fields
 * @param partial Partial metadata to extend
 * @returns Complete metadata object
 */
export function createCompleteMetadata(partial: Partial<FloorPlanMetadata> = {}): FloorPlanMetadata {
  const now = new Date().toISOString();
  
  return {
    createdAt: partial.createdAt || now,
    updatedAt: partial.updatedAt || now,
    paperSize: partial.paperSize || 'A4',
    level: partial.level || 0,
    version: partial.version || '1.0',
    author: partial.author || 'System',
    dateCreated: partial.dateCreated || now,
    lastModified: partial.lastModified || now,
    notes: partial.notes || ''
  };
}

// Alias for backward compatibility
export const isFloorPlan = validateFloorPlan;
export const isStroke = validateStroke;
export const isRoom = validateRoom;
export const isWall = validateWall;
