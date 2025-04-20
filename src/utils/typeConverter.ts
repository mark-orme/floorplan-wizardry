
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

/**
 * Converts a legacy FloorPlan to a unified FloorPlan
 * Ensures all required properties are present
 * @param floorPlan Legacy floor plan
 * @returns Unified floor plan
 */
export function toUnifiedFloorPlan(floorPlan: LegacyFloorPlan): UnifiedFloorPlan {
  console.log('Converting legacy floor plan to unified format');
  
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
    data: floorPlan.data,
    userId: floorPlan.userId
  };
}

/**
 * Converts a legacy Stroke to a unified Stroke
 * @param stroke Legacy stroke
 * @returns Unified stroke
 */
export function toUnifiedStroke(stroke: LegacyStroke): UnifiedStroke {
  if (typeof stroke.type === 'string') {
    // Convert the type using the type guard
    console.log(`Converting stroke type: ${stroke.type}`);
    const validType = asStrokeType(stroke.type);
    
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
  if (typeof room.type === 'string') {
    // Convert the type using the type guard
    console.log(`Converting room type: ${room.type}`);
    const validType = asRoomType(room.type);
    
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
  // Ensure all required wall properties are present
  return {
    ...wall,
    roomIds: wall.roomIds || []
  };
}

/**
 * Converts a unified FloorPlan to a legacy FloorPlan
 * @param floorPlan Unified floor plan
 * @returns Legacy floor plan
 */
export function toLegacyFloorPlan(floorPlan: UnifiedFloorPlan): LegacyFloorPlan {
  console.log('Converting unified floor plan to legacy format');
  
  // Create a legacy floor plan with all properties
  return floorPlan as unknown as LegacyFloorPlan;
}
