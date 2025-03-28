
/**
 * Adapters to convert between Core FloorPlan and FloorPlanType formats
 * @module utils/adapters/convertCoreFloorPlan
 */
import { FloorPlan as CoreFloorPlan, Wall as CoreWall } from '@/types/core/FloorPlan';
import { FloorPlan as FloorPlanType, Wall as FloorPlanWall } from '@/types/floorPlanTypes';

/**
 * Converts a Core FloorPlan to FloorPlanType format
 * @param fp Core FloorPlan object
 * @returns FloorPlanType formatted object
 */
export function convertCoreToFloorPlanType(fp: CoreFloorPlan): FloorPlanType {
  return {
    ...fp,
    walls: fp.walls.map((wall): FloorPlanWall => ({
      ...wall,
      startPoint: wall.start,
      endPoint: wall.end,
    })),
  };
}
