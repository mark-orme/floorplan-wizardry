
/**
 * Floor Plan Type Adapter
 * This utility ensures consistent loading of FloorPlan types regardless of case sensitivity
 */
import { FloorPlan as UppercaseFloorPlan } from '@/types/FloorPlan';
import { createPoint } from '@/utils/geometry/Point';

// Define the FloorPlan type here to avoid case-sensitive imports
export interface FloorPlanMetadata {
  createdAt: string;
  updatedAt: string;
  author?: string;
  version?: string;
  paperSize?: string;
  level?: number;
}

export interface FloorPlan extends Omit<UppercaseFloorPlan, 'metadata'> {
  metadata: FloorPlanMetadata;
}

// Function to check if an object matches the FloorPlan structure
export function isFloorPlan(obj: any): obj is FloorPlan {
  return (
    obj &&
    typeof obj === 'object' &&
    'id' in obj &&
    (typeof obj.id === 'string' || typeof obj.id === 'number') &&
    (('metadata' in obj) || obj.metadata === undefined)
  );
}

// Function to ensure an object has the FloorPlan metadata
export function ensureFloorPlanMetadata(plan: Partial<FloorPlan>): FloorPlan {
  const now = new Date().toISOString();
  
  // Create metadata if it doesn't exist
  const metadata: FloorPlanMetadata = {
    createdAt: plan.metadata?.createdAt || now,
    updatedAt: plan.metadata?.updatedAt || now,
    author: plan.metadata?.author || '',
    version: plan.metadata?.version || '1.0',
    paperSize: plan.metadata?.paperSize || 'A4',
    level: plan.metadata?.level || 0,
    ...(plan.metadata || {})
  };
  
  return {
    id: plan.id || `floor-plan-${Date.now()}`,
    name: plan.name || 'Unnamed Floor Plan',
    width: plan.width || 1000,
    height: plan.height || 800,
    level: plan.level || 1,
    updatedAt: plan.updatedAt || now,
    label: plan.label || plan.name || 'Unnamed Floor Plan',
    walls: plan.walls || [],
    rooms: plan.rooms || [],
    strokes: plan.strokes || [],
    data: plan.data || {},
    metadata
  } as FloorPlan;
}

// Create a consistent floor plan instance regardless of casing
export function createConsistentFloorPlan(data: Partial<FloorPlan> = {}): FloorPlan {
  const now = new Date().toISOString();
  
  return ensureFloorPlanMetadata({
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
  });
}

// Import the FloorPlan type consistently
export function getFloorPlanType() {
  return UppercaseFloorPlan;
}

// Use this function to adapt any floor plan object to our consistent type
export function adaptFloorPlan(data: any): FloorPlan {
  if (!data) {
    return createConsistentFloorPlan();
  }
  
  // Clone to avoid mutating the original
  const clone = JSON.parse(JSON.stringify(data));
  
  return ensureFloorPlanMetadata(clone);
}
