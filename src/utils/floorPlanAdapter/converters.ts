
/**
 * Floor plan format converters
 * @module utils/floorPlanAdapter/converters
 */
import { Point } from 'fabric';
import { 
  FloorPlanMetadata, 
  Wall, 
  Room, 
  Stroke, 
  UnifiedFloorPlan 
} from '@/types/floor-plan/unifiedTypes';
import {
  FloorPlan as CoreFloorPlan,
  RoomTypeLiteral,
} from '@/types/core/floor-plan/FloorPlan';

/**
 * Convert core floor plans to unified format
 * @param corePlans Core floor plans
 * @returns Unified floor plans
 */
export const convertToUnifiedFloorPlans = (corePlans: CoreFloorPlan[]): UnifiedFloorPlan[] => {
  return corePlans.map(corePlan => ({
    id: corePlan.id,
    name: corePlan.name,
    label: corePlan.label || corePlan.name,
    walls: corePlan.walls.map(wall => ({
      id: wall.id,
      start: wall.start,
      end: wall.end,
      thickness: wall.thickness,
      color: wall.color,
      roomIds: wall.roomIds || [],
      length: Math.sqrt(
        Math.pow(wall.end.x - wall.start.x, 2) + 
        Math.pow(wall.end.y - wall.start.y, 2)
      )
    })),
    rooms: corePlan.rooms.map(room => ({
      id: room.id,
      name: room.name,
      type: room.type,
      vertices: room.vertices,
      area: room.area,
      color: room.color,
      points: room.vertices,
      level: 0,
      walls: room.wallIds || []
    })),
    strokes: corePlan.strokes || [],
    metadata: {
      createdAt: corePlan.metadata?.createdAt || new Date().toISOString(),
      updatedAt: corePlan.metadata?.updatedAt || new Date().toISOString(),
      author: corePlan.metadata?.author || 'system',
      version: corePlan.metadata?.version || '1.0.0'
    }
  }));
};

/**
 * Convert unified floor plans to core format
 * @param unifiedPlans Unified floor plans
 * @returns Core floor plans
 */
export const convertToCoreFloorPlans = (unifiedPlans: UnifiedFloorPlan[]): CoreFloorPlan[] => {
  return unifiedPlans.map(unifiedPlan => ({
    id: unifiedPlan.id,
    name: unifiedPlan.name,
    label: unifiedPlan.label || unifiedPlan.name,
    walls: unifiedPlan.walls.map(wall => ({
      id: wall.id,
      start: wall.start,
      end: wall.end,
      thickness: wall.thickness,
      color: wall.color,
      roomIds: wall.roomIds || []
    })),
    rooms: unifiedPlan.rooms.map(room => ({
      id: room.id,
      name: room.name,
      type: room.type as RoomTypeLiteral,
      vertices: room.vertices || room.points || [],
      area: room.area,
      color: room.color,
      wallIds: room.walls || []
    })),
    strokes: unifiedPlan.strokes || [],
    metadata: {
      createdAt: unifiedPlan.metadata?.createdAt || new Date().toISOString(),
      updatedAt: unifiedPlan.metadata?.updatedAt || new Date().toISOString(),
      author: unifiedPlan.metadata?.author || 'system',
      version: unifiedPlan.metadata?.version || '1.0.0'
    }
  }));
};
