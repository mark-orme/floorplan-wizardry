
import { FloorPlan as AppFloorPlan } from '@/types/floor-plan/floorPlanTypes';
import { FloorPlan as CoreFloorPlan } from '@/types/core/floor-plan/FloorPlan';
import { FloorPlan as UnifiedFloorPlan, Wall, Room, Stroke } from '@/types/floor-plan/unifiedTypes';
import { adaptRoom, adaptStroke, adaptWall } from '@/utils/typeAdapters';

/**
 * Convert unified floor plans to core floor plans
 * @param unifiedFloorPlans Array of unified floor plans
 * @returns Array of core floor plans
 */
export function convertToCoreFloorPlans(unifiedFloorPlans: UnifiedFloorPlan[]): CoreFloorPlan[] {
  return unifiedFloorPlans.map(unifiedPlan => {
    // Convert to core floor plan format
    const corePlan: CoreFloorPlan = {
      id: unifiedPlan.id,
      name: unifiedPlan.name,
      label: unifiedPlan.label || unifiedPlan.name,
      index: unifiedPlan.index,
      walls: unifiedPlan.walls.map(wall => ({
        id: wall.id,
        start: wall.start,
        end: wall.end,
        thickness: wall.thickness,
        color: wall.color,
        roomIds: wall.roomIds
      })),
      rooms: unifiedPlan.rooms.map(room => ({
        id: room.id,
        name: room.name,
        type: room.type,
        vertices: room.vertices,
        area: room.area,
        color: room.color
      })),
      strokes: [],
      canvasData: unifiedPlan.canvasData,
      canvasJson: unifiedPlan.canvasJson,
      createdAt: unifiedPlan.createdAt,
      updatedAt: unifiedPlan.updatedAt,
      gia: unifiedPlan.gia,
      level: unifiedPlan.level,
      metadata: {
        createdAt: unifiedPlan.metadata.createdAt,
        updatedAt: unifiedPlan.metadata.updatedAt,
        paperSize: unifiedPlan.metadata.paperSize,
        level: unifiedPlan.metadata.level
      }
    };
    
    return corePlan;
  });
}

/**
 * Convert core floor plans to unified floor plans
 * @param coreFloorPlans Array of core floor plans
 * @returns Array of unified floor plans
 */
export function convertToUnifiedFloorPlans(coreFloorPlans: CoreFloorPlan[]): UnifiedFloorPlan[] {
  return coreFloorPlans.map(corePlan => {
    const now = new Date().toISOString();
    
    // Convert to unified floor plan format
    return {
      id: corePlan.id,
      name: corePlan.name,
      label: corePlan.label || corePlan.name,
      walls: corePlan.walls.map(wall => adaptWall({
        ...wall,
        floorPlanId: corePlan.id
      })),
      rooms: corePlan.rooms.map(room => adaptRoom({
        ...room,
        floorPlanId: corePlan.id
      })),
      strokes: [], // Core format doesn't have strokes
      canvasData: corePlan.canvasData,
      canvasJson: corePlan.canvasJson,
      createdAt: corePlan.createdAt || now,
      updatedAt: corePlan.updatedAt || now,
      gia: corePlan.gia || 0,
      level: corePlan.level || 0,
      index: corePlan.index || corePlan.level || 0,
      metadata: {
        createdAt: corePlan.metadata?.createdAt || now,
        updatedAt: corePlan.metadata?.updatedAt || now,
        version: '1.0',
        paperSize: corePlan.metadata?.paperSize || 'A4',
        level: corePlan.metadata?.level || 0,
        author: 'User',
        dateCreated: corePlan.createdAt || now,
        lastModified: corePlan.updatedAt || now,
        notes: ''
      },
      data: {},
      userId: 'default-user' // No user ID in core format
    };
  });
}
