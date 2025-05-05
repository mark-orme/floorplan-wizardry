
/**
 * Floor Plan Type Adapter
 * This utility ensures consistent loading of FloorPlan types regardless of case sensitivity
 */
import { FloorPlan as UppercaseFloorPlan } from '@/types/FloorPlan';

// Define the FloorPlan type here to avoid case-sensitive imports
export type FloorPlan = UppercaseFloorPlan;

// Function to check if an object matches the FloorPlan structure
export function isFloorPlan(obj: any): obj is FloorPlan {
  return (
    obj &&
    typeof obj === 'object' &&
    'id' in obj &&
    (typeof obj.id === 'string' || typeof obj.id === 'number')
  );
}

// Create a consistent floor plan instance regardless of casing
export function createConsistentFloorPlan(data: Partial<FloorPlan> = {}): FloorPlan {
  const now = new Date().toISOString();
  
  const floorPlan: FloorPlan = {
    id: data.id || `floor-plan-${Date.now()}`,
    name: data.name || 'New Floor Plan',
    label: data.label || data.name || 'New Floor Plan',
    walls: data.walls || [],
    rooms: data.rooms || [],
    strokes: data.strokes || [],
    metadata: {
      createdAt: now,
      updatedAt: now,
      author: '',
      version: '1.0',
      paperSize: 'A4',
      level: 0,
      ...(data.metadata || {})
    }
  };
  
  return floorPlan;
}

// Always return a floor plan object with required metadata
export function ensureFloorPlanMetadata(floorPlan: Partial<FloorPlan>): FloorPlan {
  const now = new Date().toISOString();
  
  return {
    ...floorPlan,
    id: floorPlan.id || `floor-plan-${Date.now()}`,
    name: floorPlan.name || 'Unnamed Floor Plan',
    label: floorPlan.label || floorPlan.name || 'Unnamed Floor Plan',
    walls: floorPlan.walls || [],
    rooms: floorPlan.rooms || [],
    strokes: floorPlan.strokes || [],
    metadata: {
      createdAt: now,
      updatedAt: now,
      version: '1.0',
      ...(floorPlan.metadata || {})
    }
  } as FloorPlan;
}

// Import the FloorPlan type consistently
export function getFloorPlanType() {
  return UppercaseFloorPlan;
}
