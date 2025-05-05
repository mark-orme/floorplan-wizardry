
/**
 * Floor Plan Type Adapter
 * Ensures consistent loading of FloorPlan types regardless of case sensitivity
 */
import { FloorPlan } from '@/types/FloorPlan';

/**
 * Type guard to check if an object is a FloorPlan
 */
export function isFloorPlan(obj: any): obj is FloorPlan {
  return obj && 
    typeof obj === 'object' &&
    'id' in obj &&
    'name' in obj;
}

/**
 * Safely get floor plan module regardless of casing
 */
export function getFloorPlanModule() {
  try {
    // First try with uppercase F
    return require('@/types/FloorPlan');
  } catch (e) {
    try {
      // Fall back to lowercase f
      return require('@/types/floorPlan');
    } catch (e2) {
      console.error('Could not import FloorPlan module', e2);
      throw new Error('FloorPlan module not found');
    }
  }
}

/**
 * Normalize the FloorPlan type
 * Makes sure all required properties exist
 */
export function normalizeFloorPlan(floorPlan: any): FloorPlan {
  if (!floorPlan) return null as unknown as FloorPlan;
  
  return {
    ...floorPlan,
    // Add any required fields that might be missing
    updatedAt: floorPlan.updatedAt || new Date().toISOString(),
    walls: floorPlan.walls || [],
    rooms: floorPlan.rooms || [],
    strokes: floorPlan.strokes || [],
    data: floorPlan.data || {}
  };
}

/**
 * Normalize a floor plan import path to always use the same casing
 */
export function normalizeFloorPlanImportPath(path: string): string {
  return path.replace(/[Ff][Ll][Oo][Oo][Rr][Pp][Ll][Aa][Nn]/g, 'FloorPlan');
}

/**
 * Export FloorPlan directly to provide a consistent import
 */
export { FloorPlan };
