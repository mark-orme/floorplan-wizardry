
/**
 * Adapter functions for floor plan type conversions
 * This is required by imports in src/types/floor-plan/index.ts
 */

import { FloorPlan } from '@/types/floorPlan';

interface RawFloorPlanData {
  walls?: unknown[];
  rooms?: unknown[];
  strokes?: unknown[];
  metadata?: {
    createdAt?: string;
    updatedAt?: string;
    level?: number;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

/**
 * Convert a raw object to a typed FloorPlan
 */
export const toTypedFloorPlan = (rawData: RawFloorPlanData): FloorPlan => {
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
  } as FloorPlan;
};
