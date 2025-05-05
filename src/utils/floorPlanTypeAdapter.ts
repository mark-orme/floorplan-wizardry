
/**
 * Adapter functions for floor plan type conversions
 * This resolves case sensitivity issues with FloorPlan vs floorPlan imports
 */

import type { FloorPlan as UppercaseFloorPlan } from '@/types/FloorPlan';
import type { FloorPlan as LowercaseFloorPlan } from '@/types/floorPlan';

// Create a unified FloorPlan type that works with both import patterns
export type UnifiedFloorPlan = UppercaseFloorPlan & LowercaseFloorPlan;

/**
 * Normalize a floor plan object to ensure it has all required properties
 * This helps resolve issues with missing properties like metadata
 */
export function normalizeFloorPlan(floorPlan: Partial<UnifiedFloorPlan>): UnifiedFloorPlan {
  // Ensure the floorPlan has an id
  const id = floorPlan.id || crypto.randomUUID();
  
  // Ensure the floorPlan has a name
  const name = floorPlan.name || floorPlan.label || 'Untitled Floor Plan';
  
  // Ensure timestamps exist
  const now = new Date().toISOString();
  const createdAt = floorPlan.createdAt || floorPlan.created || now;
  const updatedAt = floorPlan.updatedAt || floorPlan.updated || floorPlan.modified || now;
  
  // Ensure metadata exists with required properties
  const metadata = {
    createdAt,
    updatedAt,
    name,
    ...(floorPlan.metadata || {})
  };
  
  // Return a normalized floor plan with all required properties
  return {
    id,
    name,
    label: name,
    createdAt,
    updatedAt,
    created: createdAt,
    updated: updatedAt,
    modified: updatedAt,
    width: floorPlan.width || 1000,
    height: floorPlan.height || 800,
    level: floorPlan.level || 0,
    metadata,
    ...floorPlan
  } as UnifiedFloorPlan;
}

/**
 * Import a FloorPlan type in a case-insensitive way
 * This helps resolve issues with case-sensitive imports
 */
export function getFloorPlanType() {
  try {
    // Try the uppercase version first
    return require('@/types/FloorPlan').FloorPlan;
  } catch (e) {
    try {
      // Try the lowercase version
      return require('@/types/floorPlan').FloorPlan;
    } catch (e2) {
      // Create a minimal default type if both fail
      return {
        id: '',
        name: '',
        metadata: {}
      };
    }
  }
}
