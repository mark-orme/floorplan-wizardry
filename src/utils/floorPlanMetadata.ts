
import { FloorPlan } from '@/types/FloorPlan';

/**
 * Ensures that a FloorPlan object has proper metadata
 * @param floorPlan The FloorPlan object to ensure metadata for
 * @returns A FloorPlan with guaranteed metadata
 */
export function ensureFloorPlanMetadata(floorPlan: Partial<FloorPlan>): FloorPlan {
  const now = new Date().toISOString();
  
  // Ensure the FloorPlan has an id and name
  const ensuredFloorPlan = {
    id: floorPlan.id || `floor-plan-${Date.now()}`,
    name: floorPlan.name || 'Untitled Floor Plan',
    width: floorPlan.width || 1000,
    height: floorPlan.height || 800,
    updatedAt: now,
    // Maintain existing properties
    ...floorPlan,
    // Ensure metadata exists
    metadata: {
      createdAt: floorPlan.metadata?.createdAt || now,
      updatedAt: now,
      // Maintain existing metadata
      ...(floorPlan.metadata || {}),
    }
  } as FloorPlan;
  
  // Ensure arrays exist
  ensuredFloorPlan.walls = ensuredFloorPlan.walls || [];
  ensuredFloorPlan.rooms = ensuredFloorPlan.rooms || [];
  ensuredFloorPlan.strokes = ensuredFloorPlan.strokes || [];
  ensuredFloorPlan.data = ensuredFloorPlan.data || {};
  
  return ensuredFloorPlan;
}

/**
 * Update the metadata of a FloorPlan
 * @param floorPlan The FloorPlan to update metadata for
 * @param metadata Partial metadata to merge
 * @returns A FloorPlan with updated metadata
 */
export function updateFloorPlanMetadata(
  floorPlan: FloorPlan, 
  metadata: Partial<FloorPlan['metadata']>
): FloorPlan {
  const now = new Date().toISOString();
  
  return {
    ...floorPlan,
    updatedAt: now,
    metadata: {
      ...floorPlan.metadata,
      ...metadata,
      updatedAt: now
    }
  };
}

/**
 * Create a minimal valid FloorPlan
 */
export function createMinimalFloorPlan(name: string = 'New Floor Plan'): FloorPlan {
  const now = new Date().toISOString();
  
  return {
    id: `floor-plan-${Date.now()}`,
    name,
    width: 1000,
    height: 800,
    updatedAt: now,
    walls: [],
    rooms: [],
    strokes: [],
    data: {},
    metadata: {
      createdAt: now,
      updatedAt: now
    }
  };
}
