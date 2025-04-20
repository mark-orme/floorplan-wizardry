
/**
 * Type converter utility
 * Provides functions to convert between different type definitions
 * @module utils/typeConverter
 */
import { 
  FloorPlan as UnifiedFloorPlan,
  Stroke as UnifiedStroke,
  Room as UnifiedRoom,
  Wall as UnifiedWall,
  asStrokeType,
  asRoomType
} from '@/types/floor-plan/unifiedTypes';

import {
  FloorPlan as LegacyFloorPlan,
  Stroke as LegacyStroke,
  Room as LegacyRoom,
  Wall as LegacyWall,
  StrokeTypeLiteral as LegacyStrokeType,
  RoomTypeLiteral as LegacyRoomType
} from '@/types/floorPlanTypes';

console.log('Loading type converter utility');

/**
 * Converts a legacy FloorPlan to a unified FloorPlan
 * Ensures all required properties are present
 * @param floorPlan Legacy floor plan
 * @returns Unified floor plan
 */
export function toUnifiedFloorPlan(floorPlan: LegacyFloorPlan): UnifiedFloorPlan {
  console.log('Converting legacy floor plan to unified format', {
    id: floorPlan.id,
    name: floorPlan.name,
    hasData: !!floorPlan.data,
    hasUserId: !!floorPlan.userId
  });
  
  // Create a new floor plan with all required properties
  return {
    id: floorPlan.id,
    name: floorPlan.name,
    label: floorPlan.label || floorPlan.name, // Ensure label is present
    walls: (floorPlan.walls || []).map(toUnifiedWall),
    rooms: (floorPlan.rooms || []).map(toUnifiedRoom),
    strokes: (floorPlan.strokes || []).map(toUnifiedStroke),
    canvasData: floorPlan.canvasData || null,
    canvasJson: floorPlan.canvasJson || null,
    createdAt: floorPlan.createdAt,
    updatedAt: floorPlan.updatedAt,
    gia: floorPlan.gia || 0,
    level: floorPlan.level || 0,
    index: floorPlan.index || 0,
    metadata: floorPlan.metadata || {},
    // Critical required properties
    data: floorPlan.data || {}, // Ensure data is present
    userId: floorPlan.userId || 'unknown' // Ensure userId is present
  };
}

/**
 * Converts a legacy Stroke to a unified Stroke
 * @param stroke Legacy stroke
 * @returns Unified stroke
 */
export function toUnifiedStroke(stroke: LegacyStroke): UnifiedStroke {
  console.log('Converting legacy stroke to unified format', {
    id: stroke.id,
    type: stroke.type
  });
  
  if (typeof stroke.type === 'string') {
    // Convert the type using the type guard
    const validType = asStrokeType(stroke.type);
    console.log(`Converted stroke type: ${stroke.type} -> ${validType}`);
    
    return {
      ...stroke,
      type: validType,
      // Ensure width is present if it's missing
      width: stroke.width || stroke.thickness
    };
  }
  
  return stroke as unknown as UnifiedStroke;
}

/**
 * Converts a legacy Room to a unified Room
 * @param room Legacy room
 * @returns Unified room
 */
export function toUnifiedRoom(room: LegacyRoom): UnifiedRoom {
  console.log('Converting legacy room to unified format', {
    id: room.id,
    type: room.type
  });
  
  if (typeof room.type === 'string') {
    // Convert the type using the type guard
    const validType = asRoomType(room.type);
    console.log(`Converted room type: ${room.type} -> ${validType}`);
    
    return {
      ...room,
      type: validType
    };
  }
  
  return room as unknown as UnifiedRoom;
}

/**
 * Converts a legacy Wall to a unified Wall
 * @param wall Legacy wall
 * @returns Unified wall
 */
export function toUnifiedWall(wall: LegacyWall): UnifiedWall {
  console.log('Converting legacy wall to unified format', {
    id: wall.id,
    hasRoomIds: !!wall.roomIds
  });
  
  // Ensure all required wall properties are present
  return {
    ...wall,
    roomIds: wall.roomIds || [] // Ensure roomIds is present
  };
}

/**
 * Converts a unified FloorPlan to a legacy FloorPlan
 * @param floorPlan Unified floor plan
 * @returns Legacy floor plan
 */
export function toLegacyFloorPlan(floorPlan: UnifiedFloorPlan): LegacyFloorPlan {
  console.log('Converting unified floor plan to legacy format', {
    id: floorPlan.id,
    name: floorPlan.name
  });
  
  // Create a legacy floor plan with all properties
  return floorPlan as unknown as LegacyFloorPlan;
}
