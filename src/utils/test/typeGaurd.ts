
/**
 * Type guard utilities for testing
 * Provides functions to ensure test objects have proper types
 * @module utils/test/typeGaurd
 */

import {
  FloorPlan, Room, Stroke, Wall,
  StrokeTypeLiteral, RoomTypeLiteral,
  asStrokeType, asRoomType,
  createEmptyFloorPlan, createEmptyRoom,
  createEmptyStroke, createEmptyWall
} from '@/types/floor-plan/typesBarrel';

/**
 * Ensures a partial floor plan is a valid FloorPlan
 * @param floorPlan Partial floor plan
 * @returns Complete floor plan with defaults
 */
export function ensureFloorPlan(floorPlan: Partial<FloorPlan>): FloorPlan {
  // Ensure data and userId are present
  if (!floorPlan.data) floorPlan.data = {};
  if (!floorPlan.userId) floorPlan.userId = 'test-user';
  
  // Create a complete floor plan using our factory
  return createEmptyFloorPlan(floorPlan);
}

/**
 * Ensures a partial stroke is a valid Stroke
 * @param stroke Partial stroke
 * @returns Complete stroke with defaults
 */
export function ensureStroke(stroke: Partial<Stroke>): Stroke {
  // Ensure type is valid
  if (stroke.type && typeof stroke.type === 'string') {
    stroke.type = asStrokeType(stroke.type);
  }
  
  // Create a complete stroke using our factory
  return createEmptyStroke(stroke);
}

/**
 * Ensures a partial room is a valid Room
 * @param room Partial room
 * @returns Complete room with defaults
 */
export function ensureRoom(room: Partial<Room>): Room {
  // Ensure type is valid
  if (room.type && typeof room.type === 'string') {
    room.type = asRoomType(room.type);
  }
  
  // Create a complete room using our factory
  return createEmptyRoom(room);
}

/**
 * Ensures a partial wall is a valid Wall
 * @param wall Partial wall
 * @returns Complete wall with defaults
 */
export function ensureWall(wall: Partial<Wall>): Wall {
  // Ensure roomIds is present
  if (!wall.roomIds) wall.roomIds = [];
  
  // Create a complete wall using our factory
  return createEmptyWall(wall);
}

/**
 * Validates a string as a StrokeTypeLiteral
 * @param type Stroke type string
 * @returns Valid StrokeTypeLiteral
 */
export { asStrokeType };

/**
 * Validates a string as a RoomTypeLiteral
 * @param type Room type string
 * @returns Valid RoomTypeLiteral
 */
export { asRoomType };
