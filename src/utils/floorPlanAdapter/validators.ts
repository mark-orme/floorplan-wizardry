
import { FloorPlan } from '@/types/FloorPlan';

/**
 * Validates a floor plan object to ensure it has all required properties
 * @param floorPlan Floor plan object to validate
 * @returns Boolean indicating if the floor plan is valid
 */
export function isValidFloorPlan(floorPlan: any): floorPlan is FloorPlan {
  if (!floorPlan) return false;
  
  return (
    typeof floorPlan.id === 'string' &&
    typeof floorPlan.name === 'string' &&
    typeof floorPlan.data === 'object' &&
    typeof floorPlan.userId === 'string' &&
    Array.isArray(floorPlan.walls) &&
    Array.isArray(floorPlan.rooms) &&
    Array.isArray(floorPlan.strokes) &&
    typeof floorPlan.createdAt === 'string' &&
    typeof floorPlan.updatedAt === 'string' &&
    typeof floorPlan.metadata === 'object'
  );
}

/**
 * Validates an array of floor plans
 * @param floorPlans Array of floor plans to validate
 * @returns Array of valid floor plans
 */
export function validateFloorPlans(floorPlans: any[]): FloorPlan[] {
  if (!Array.isArray(floorPlans)) return [];
  
  return floorPlans.filter(isValidFloorPlan);
}
