
/**
 * Simplified FloorPlan type adapter with proper exports
 */

/**
 * FloorPlan interface
 */
export interface FloorPlan {
  id: string;
  name: string;
  created: string;
  updated: string;
  width: number;
  height: number;
  level?: number;
}

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
