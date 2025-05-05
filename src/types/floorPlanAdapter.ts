
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
  
  // Ensure metadata exists
  if (!data.metadata) {
    data.metadata = {};
  }
  
  return data as FloorPlan;
}

// Case insensitive import helper
export function getFloorPlanModule() {
  try {
    return require('./FloorPlan');
  } catch (e) {
    try {
      return require('./floorPlan');
    } catch (e2) {
      console.error('Could not import FloorPlan module', e2);
      throw new Error('FloorPlan module not found');
    }
  }
}

// Add helper to normalize case-sensitive import paths
export function normalizeFloorPlanPath(path: string): string {
  // Convert any floor plan path to the canonical version
  if (path.toLowerCase().includes('floorplan')) {
    return path.replace(/[Ff][Ll][Oo][Oo][Rr][Pp][Ll][Aa][Nn]/g, 'FloorPlan');
  }
  return path;
}

// Add special FloorPlan type compatibility checking
export function isFloorPlanCompatible(obj: any): boolean {
  // Check if object has the minimum required properties to be a FloorPlan
  return obj && typeof obj === 'object' && 
    ('id' in obj) && 
    ('name' in obj || 'label' in obj);
}
