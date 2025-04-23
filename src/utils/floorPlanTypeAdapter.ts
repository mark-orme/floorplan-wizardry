
/**
 * Adapter functions for floor plan type conversions
 * This is required by imports in src/types/floor-plan/index.ts
 */

import { FloorPlan } from '@/types/floorPlan';

/**
 * Convert a raw object to a typed FloorPlan
 */
export const toTypedFloorPlan = (rawData: any): FloorPlan => {
  return {
    ...rawData,
    walls: rawData.walls || [],
    rooms: rawData.rooms || [],
    strokes: rawData.strokes || [],
    metadata: {
      ...rawData.metadata,
      createdAt: rawData.metadata?.createdAt || new Date().toISOString(),
      updatedAt: rawData.metadata?.updatedAt || new Date().toISOString(),
      level: rawData.metadata?.level || 0
    }
  };
};
