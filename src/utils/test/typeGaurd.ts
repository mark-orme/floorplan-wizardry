
/**
 * Type Guard Utilities for Tests
 * Provides utilities for ensuring correct types in tests
 * @module utils/test/typeGaurd
 */

import {
  FloorPlan,
  Stroke,
  Wall,
  Room,
  StrokeTypeLiteral,
  RoomTypeLiteral,
  createEmptyFloorPlan,
  createEmptyStroke,
  createEmptyWall,
  createEmptyRoom
} from '@/types/floor-plan/typesBarrel';

/**
 * Type guard for room type
 * @param type Room type to check
 * @returns Validated room type
 */
export function asRoomType(type: unknown): RoomTypeLiteral {
  const validTypes: RoomTypeLiteral[] = [
    'living', 'bedroom', 'kitchen', 'bathroom', 'office', 'other'
  ];
  
  return validTypes.includes(type as RoomTypeLiteral) 
    ? (type as RoomTypeLiteral) 
    : 'other';
}

/**
 * Type guard for stroke type
 * @param type Stroke type to check
 * @returns Validated stroke type
 */
export function asStrokeType(type: unknown): StrokeTypeLiteral {
  const validTypes: StrokeTypeLiteral[] = [
    'line', 'polyline', 'wall', 'room', 'freehand', 
    'door', 'window', 'furniture', 'annotation', 'straight', 'other'
  ];
  
  return validTypes.includes(type as StrokeTypeLiteral) 
    ? (type as StrokeTypeLiteral) 
    : 'other';
}

/**
 * Ensure a floor plan has all required properties
 * @param floorPlan Partial floor plan
 * @returns Complete floor plan
 */
export function ensureFloorPlan(floorPlan: Partial<FloorPlan>): FloorPlan {
  // Add required data and userId if missing
  if (!floorPlan.data) floorPlan.data = {};
  if (!floorPlan.userId) floorPlan.userId = 'test-user';
  
  return {
    ...createEmptyFloorPlan(),
    ...floorPlan
  };
}

/**
 * Ensure a stroke has all required properties
 * @param stroke Partial stroke
 * @returns Complete stroke
 */
export function ensureStroke(stroke: Partial<Stroke>): Stroke {
  // Ensure type is a valid StrokeTypeLiteral
  if (stroke.type && typeof stroke.type === 'string') {
    stroke.type = asStrokeType(stroke.type);
  }
  
  return {
    ...createEmptyStroke(),
    ...stroke
  };
}

/**
 * Ensure a wall has all required properties
 * @param wall Partial wall
 * @returns Complete wall
 */
export function ensureWall(wall: Partial<Wall>): Wall {
  // Ensure roomIds is present
  if (!wall.roomIds) wall.roomIds = [];
  
  return {
    ...createEmptyWall(),
    ...wall
  };
}

/**
 * Ensure a room has all required properties
 * @param room Partial room
 * @returns Complete room
 */
export function ensureRoom(room: Partial<Room>): Room {
  // Ensure type is a valid RoomTypeLiteral
  if (room.type && typeof room.type === 'string') {
    room.type = asRoomType(room.type);
  }
  
  return {
    ...createEmptyRoom(),
    ...room
  };
}

/**
 * Deep check to ensure all room and stroke types are valid in a floor plan
 * @param floorPlan Floor plan to validate
 * @returns Validated floor plan
 */
export function deepValidateFloorPlan(floorPlan: Partial<FloorPlan>): FloorPlan {
  const validatedFloorPlan = ensureFloorPlan(floorPlan);
  
  // Validate all strokes
  validatedFloorPlan.strokes = validatedFloorPlan.strokes.map(ensureStroke);
  
  // Validate all rooms
  validatedFloorPlan.rooms = validatedFloorPlan.rooms.map(ensureRoom);
  
  // Validate all walls
  validatedFloorPlan.walls = validatedFloorPlan.walls.map(ensureWall);
  
  return validatedFloorPlan;
}
