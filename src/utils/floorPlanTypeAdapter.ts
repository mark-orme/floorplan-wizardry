
import { FloorPlan } from '@/types/fabric-unified';

/**
 * Check if an object is a FloorPlan
 */
export function isFloorPlan(obj: any): obj is FloorPlan {
  return (
    obj &&
    typeof obj === 'object' &&
    'id' in obj &&
    'name' in obj
  );
}

/**
 * Create an empty FloorPlan object
 */
export function createEmptyFloorPlan(): FloorPlan {
  return {
    id: '',
    name: 'New Floor Plan',
    created: new Date().toISOString(),
    updated: new Date().toISOString(),
    width: 800,
    height: 600
  };
}

/**
 * Export the FloorPlan type
 */
export type { FloorPlan };
