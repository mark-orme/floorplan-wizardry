
/**
 * Floor plan type adapters
 * @module utils/floorPlanAdapter/floorPlanTypeAdapter
 */
import { Point } from 'fabric';
import {
  FloorPlan,
  Wall,
  Room,
  Stroke,
  FloorPlanMetadata
} from '@/types/floor-plan/unifiedTypes';

/**
 * Convert a wall object to the unified format
 * @param wall Wall object to convert
 * @returns Unified wall format
 */
export const adaptWall = (wall: any): Wall => {
  return {
    id: wall.id || `wall-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    start: { x: wall.start?.x || 0, y: wall.start?.y || 0 },
    end: { x: wall.end?.x || 0, y: wall.end?.y || 0 },
    thickness: wall.thickness || 5,
    color: wall.color || '#000000',
    roomIds: wall.roomIds || [],
    length: Math.sqrt(
      Math.pow((wall.end?.x || 0) - (wall.start?.x || 0), 2) + 
      Math.pow((wall.end?.y || 0) - (wall.start?.y || 0), 2)
    )
  };
};

/**
 * Convert a room object to the unified format
 * @param room Room object to convert
 * @returns Unified room format
 */
export const adaptRoom = (room: any): Room => {
  return {
    id: room.id || `room-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    name: room.name || 'Unnamed Room',
    type: room.type || 'other',
    vertices: room.vertices || room.points || [],
    points: room.points || room.vertices || [],
    area: room.area || 0,
    color: room.color || '#f0f0f0',
    level: room.level || 0,
    walls: room.walls || room.wallIds || []
  };
};

/**
 * Convert a stroke object to the unified format
 * @param stroke Stroke object to convert
 * @returns Unified stroke format
 */
export const adaptStroke = (stroke: any): Stroke => {
  return {
    id: stroke.id || `stroke-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    points: stroke.points || [],
    color: stroke.color || '#000000',
    width: stroke.width || 1,
    type: stroke.type || 'annotation',
    metadata: stroke.metadata || {}
  };
};

/**
 * Convert a metadata object to the unified format
 * @param metadata Metadata object to convert
 * @returns Unified metadata format
 */
export const adaptMetadata = (metadata: any): FloorPlanMetadata => {
  return {
    createdAt: metadata.createdAt || new Date().toISOString(),
    updatedAt: metadata.updatedAt || new Date().toISOString(),
    author: metadata.author || 'system',
    version: metadata.version || '1.0.0'
  };
};

/**
 * Convert a floor plan to the unified format
 * @param floorPlan Floor plan to convert
 * @returns Unified floor plan format
 */
export const adaptFloorPlan = (floorPlan: any): FloorPlan => {
  return {
    id: floorPlan.id || `floor-plan-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    name: floorPlan.name || 'Untitled Floor Plan',
    label: floorPlan.label || floorPlan.name || 'Untitled Floor Plan',
    walls: (floorPlan.walls || []).map(adaptWall),
    rooms: (floorPlan.rooms || []).map(adaptRoom),
    strokes: (floorPlan.strokes || []).map(adaptStroke),
    metadata: adaptMetadata(floorPlan.metadata || {})
  };
};
