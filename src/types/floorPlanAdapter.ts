
import type { FloorPlan } from './FloorPlan';

/**
 * Adapter for FloorPlan types to handle casing issues
 * This allows imports from both '@/types/FloorPlan' and '@/types/floorPlan'
 */

// Re-export FloorPlan type for consistent usage regardless of case
export type { FloorPlan } from './FloorPlan';

// Add any adapter functions needed to ensure compatibility
export function adaptFloorPlan(data: any): FloorPlan {
  // Add label if it doesn't exist
  if (!data.label && data.name) {
    data.label = data.name;
  }
  
  return data as FloorPlan;
}
