
/**
 * Type Adapters
 * Provides utility functions to adapt between incompatible type definitions
 * @module utils/typeAdapters
 */
import { FloorPlan as CoreFloorPlan, Wall as CoreWall } from '@/types/core/FloorPlan';
import { FloorPlan as AppFloorPlan, Wall as AppWall } from '@/types/floorPlanTypes';

/**
 * Convert a core wall to app wall format
 * @param wall Core wall
 * @returns App wall
 */
export function adaptWall(wall: CoreWall): AppWall {
  return {
    id: wall.id,
    points: wall.start && wall.end ? [wall.start, wall.end] : [],
    startPoint: wall.start,
    endPoint: wall.end,
    start: wall.start,  // Ensure both properties are present
    end: wall.end,      // Ensure both properties are present
    thickness: wall.thickness || 1, // Provide default if missing
    color: wall.color || '#000000', // Provide default if missing
    height: wall.height,
    roomIds: wall.roomIds
  };
}

/**
 * Convert a core floor plan to app floor plan format
 * @param corePlan Core floor plan
 * @returns App floor plan
 */
export function adaptFloorPlan(corePlan: CoreFloorPlan): AppFloorPlan {
  return {
    id: corePlan.id,
    name: corePlan.name,
    label: corePlan.label || corePlan.name,
    walls: corePlan.walls.map(adaptWall),
    rooms: corePlan.rooms,
    strokes: corePlan.strokes,
    index: corePlan.index || corePlan.level,
    gia: corePlan.gia,
    level: corePlan.level,
    createdAt: corePlan.createdAt,
    updatedAt: corePlan.updatedAt,
    canvasData: corePlan.canvasData,
    canvasJson: corePlan.canvasJson || null,
    metadata: corePlan.metadata
  };
}

/**
 * Convert multiple core floor plans to app floor plans
 * @param plans Array of core floor plans
 * @returns Array of app floor plans
 */
export function adaptFloorPlans(corePlans: CoreFloorPlan[]): AppFloorPlan[] {
  return corePlans.map(adaptFloorPlan);
}

/**
 * Convert multiple core floor plans to app floor plans (alias for adaptFloorPlans)
 * @param corePlans Array of core floor plans
 * @returns Array of app floor plans
 */
export const coreToAppFloorPlans = adaptFloorPlans;
