
import { v4 as uuidv4 } from 'uuid';
import { FloorPlan, FloorPlanMetadata } from '@/types/canvas-types';

/**
 * Ensure a floor plan has all required metadata
 * @param floorPlan Partial floor plan to ensure metadata for
 * @returns Floor plan with complete metadata
 */
export function ensureFloorPlanMetadata(floorPlan: Partial<FloorPlan> = {}): FloorPlan {
  const now = new Date().toISOString();
  const id = floorPlan.id || uuidv4();
  const name = floorPlan.name || `Floor Plan ${Math.floor(Math.random() * 1000)}`;
  
  // Create metadata object with required fields
  const metadata: FloorPlanMetadata = {
    id,
    name,
    createdAt: floorPlan.createdAt || now,
    updatedAt: floorPlan.updatedAt || now,
    
    // Handle legacy fields for compatibility
    created: floorPlan.created || floorPlan.createdAt || now,
    modified: floorPlan.modified || floorPlan.updatedAt || now,
    updated: floorPlan.updated || floorPlan.updatedAt || now,
    
    // Optional fields
    description: floorPlan.description || '',
    thumbnail: floorPlan.thumbnail || '',
    size: floorPlan.size || 0,
    width: floorPlan.width || 800,
    height: floorPlan.height || 600,
    index: floorPlan.index || 0,
  };
  
  // Return the complete floor plan
  return {
    id,
    name,
    ...floorPlan,
    ...metadata,
  } as FloorPlan;
}

/**
 * Export adapter functions to handle FloorPlan types properly
 * This allows imports from both '@/types/FloorPlan' and '@/types/floorPlan' to work
 */
export const floorPlanAdapter = {
  ensureMetadata: ensureFloorPlanMetadata,
  createEmpty: (): FloorPlan => ensureFloorPlanMetadata({}),
  fromPartial: (partial: Partial<FloorPlan>) => ensureFloorPlanMetadata(partial),
};

// Re-export the ensureFloorPlanMetadata function for backward compatibility
export { ensureFloorPlanMetadata };
