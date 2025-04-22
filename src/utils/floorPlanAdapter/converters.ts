
import { FloorPlan as AppFloorPlan } from '@/types/floor-plan/floorPlanTypes';
import { FloorPlan as CoreFloorPlan } from '@/types/FloorPlan';
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
    return {
      id: unifiedPlan.id,
      name: unifiedPlan.name,
      label: unifiedPlan.label || unifiedPlan.name,
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
      metadata: {
        ...unifiedPlan.metadata,
        level: unifiedPlan.level || 0
      },
      created: unifiedPlan.createdAt,
      updated: unifiedPlan.updatedAt
    };
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
      canvasData: null,
      canvasJson: null,
      createdAt: corePlan.created || now,
      updatedAt: corePlan.updated || now,
      gia: 0, // Default GIA
      level: corePlan.metadata?.level || 0,
      index: corePlan.metadata?.level || 0,
      metadata: {
        createdAt: corePlan.created || now,
        updatedAt: corePlan.updated || now,
        version: corePlan.metadata?.version || '1.0',
        paperSize: corePlan.metadata?.paperSize || 'A4',
        level: corePlan.metadata?.level || 0,
        author: corePlan.metadata?.author || '',
        dateCreated: corePlan.created || now,
        lastModified: corePlan.updated || now,
        notes: corePlan.metadata?.notes || ''
      },
      data: {},
      userId: 'default-user' // No user ID in core format
    };
  });
}
