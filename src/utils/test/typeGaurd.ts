
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
  createEmptyRoom,
  asStrokeType as coreAsStrokeType,
  asRoomType as coreAsRoomType
} from '@/types/floor-plan/unifiedTypes';

// Add extensive console logging to help debug type issues
console.log('Loading type guard utilities for tests');

/**
 * Type guard for room type
 * @param type Room type to check
 * @returns Validated room type
 */
export function asRoomType(type: unknown): RoomTypeLiteral {
  console.log('TypeGuard: Validating room type', type);
  return coreAsRoomType(type);
}

/**
 * Type guard for stroke type
 * @param type Stroke type to check
 * @returns Validated stroke type
 */
export function asStrokeType(type: unknown): StrokeTypeLiteral {
  console.log('TypeGuard: Validating stroke type', type);
  return coreAsStrokeType(type);
}

/**
 * Ensure a floor plan has all required properties
 * @param floorPlan Partial floor plan
 * @returns Complete floor plan
 */
export function ensureFloorPlan(floorPlan: Partial<FloorPlan>): FloorPlan {
  console.log('TypeGuard: Ensuring floor plan has all required properties', { 
    id: floorPlan.id,
    hasData: !!floorPlan.data,
    hasUserId: !!floorPlan.userId
  });
  
  // Add required data and userId if missing
  if (!floorPlan.data) {
    console.log('TypeGuard: Adding missing data property to floor plan');
    floorPlan.data = {};
  }
  
  if (!floorPlan.userId) {
    console.log('TypeGuard: Adding missing userId property to floor plan');
    floorPlan.userId = 'test-user';
  }
  
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
  console.log('TypeGuard: Ensuring stroke has all required properties', { 
    id: stroke.id,
    type: stroke.type
  });
  
  // Ensure type is a valid StrokeTypeLiteral
  if (stroke.type && typeof stroke.type === 'string') {
    const originalType = stroke.type;
    stroke.type = asStrokeType(stroke.type);
    console.log(`TypeGuard: Converted stroke type "${originalType}" to "${stroke.type}"`);
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
  console.log('TypeGuard: Ensuring wall has all required properties', { 
    id: wall.id,
    hasRoomIds: !!wall.roomIds
  });
  
  // Ensure roomIds is present
  if (!wall.roomIds) {
    console.log('TypeGuard: Adding missing roomIds to wall');
    wall.roomIds = [];
  }
  
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
  console.log('TypeGuard: Ensuring room has all required properties', { 
    id: room.id,
    type: room.type
  });
  
  // Ensure type is a valid RoomTypeLiteral
  if (room.type && typeof room.type === 'string') {
    const originalType = room.type;
    room.type = asRoomType(room.type);
    console.log(`TypeGuard: Converted room type "${originalType}" to "${room.type}"`);
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
  console.log('TypeGuard: Deep validating floor plan', { 
    id: floorPlan.id,
    strokeCount: floorPlan.strokes?.length || 0,
    roomCount: floorPlan.rooms?.length || 0,
    wallCount: floorPlan.walls?.length || 0
  });
  
  const validatedFloorPlan = ensureFloorPlan(floorPlan);
  
  // Validate all strokes
  validatedFloorPlan.strokes = validatedFloorPlan.strokes.map(stroke => {
    console.log('TypeGuard: Validating stroke in floor plan', { 
      id: stroke.id,
      type: stroke.type
    });
    return ensureStroke(stroke);
  });
  
  // Validate all rooms
  validatedFloorPlan.rooms = validatedFloorPlan.rooms.map(room => {
    console.log('TypeGuard: Validating room in floor plan', { 
      id: room.id,
      type: room.type
    });
    return ensureRoom(room);
  });
  
  // Validate all walls
  validatedFloorPlan.walls = validatedFloorPlan.walls.map(wall => {
    console.log('TypeGuard: Validating wall in floor plan', { 
      id: wall.id,
      hasRoomIds: !!wall.roomIds
    });
    return ensureWall(wall);
  });
  
  return validatedFloorPlan;
}
