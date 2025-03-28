
/**
 * Type Adapters
 * Provides utility functions to adapt between incompatible type definitions
 * @module utils/typeAdapters
 */
import { FloorPlan as CoreFloorPlan, Wall as CoreWall } from '@/types/core/FloorPlan';
import { FloorPlan as AppFloorPlan, Wall as AppWall } from '@/types/floorPlanTypes';

/**
 * Convert a core floor plan to app floor plan format
 * @param plan Core floor plan
 * @returns App floor plan
 */
export function adaptFloorPlan(corePlan: CoreFloorPlan): AppFloorPlan {
  return {
    ...corePlan,
    walls: corePlan.walls.map((wall: CoreWall) => ({
      ...wall,
      startPoint: wall.start,
      endPoint: wall.end,
      start: wall.start,  // Ensure both properties are present
      end: wall.end       // Ensure both properties are present
    })) as AppWall[],
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

// Export alias for backward compatibility
export const coreToAppFloorPlans = adaptFloorPlans;
