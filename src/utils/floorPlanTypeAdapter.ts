
import { FloorPlanMetadata } from '@/types/canvas-types';

export interface FloorPlan {
  id: string;
  name: string;
  description?: string;
  updated?: string;
  modified?: string;
  createdAt?: string;
  updatedAt?: string;
  metadata?: FloorPlanMetadata;
  data?: any;
  thumbnail?: string;
  width?: number;
  height?: number;
  [key: string]: any;
}

export function isFloorPlan(obj: any): obj is FloorPlan {
  return obj && typeof obj === 'object' && typeof obj.id === 'string';
}

export function ensureFloorPlanMetadata(floorPlan: Partial<FloorPlan>): FloorPlan {
  const now = new Date().toISOString();
  
  // Create a new object with default values
  return {
    id: floorPlan.id || `floor-plan-${Date.now()}`,
    name: floorPlan.name || 'Untitled Floor Plan',
    description: floorPlan.description || '',
    createdAt: floorPlan.createdAt || now,
    updatedAt: floorPlan.updatedAt || now,
    updated: floorPlan.updated || now,
    modified: floorPlan.modified || now,
    width: floorPlan.width || 800,
    height: floorPlan.height || 600,
    metadata: {
      ...(floorPlan.metadata || {}),
      createdAt: (floorPlan.metadata?.createdAt || floorPlan.createdAt || now),
      updatedAt: (floorPlan.metadata?.updatedAt || floorPlan.updatedAt || now)
    },
    ...floorPlan
  };
}

export function updateFloorPlanTimestamp(floorPlan: FloorPlan): FloorPlan {
  const now = new Date().toISOString();
  
  return {
    ...floorPlan,
    updatedAt: now,
    updated: now,
    modified: now,
    metadata: {
      ...(floorPlan.metadata || {}),
      updatedAt: now
    }
  };
}

// Adapter for different floor plan type systems
export function adaptFloorPlan(data: any): FloorPlan {
  if (isFloorPlan(data)) {
    return data;
  }
  
  // Convert various formats to our unified FloorPlan interface
  return {
    id: data.id || `floor-plan-${Date.now()}`,
    name: data.name || data.title || 'Untitled',
    description: data.description || '',
    createdAt: data.createdAt || data.created || new Date().toISOString(),
    updatedAt: data.updatedAt || data.updated || data.modified || new Date().toISOString(),
    updated: data.updated || data.modified || new Date().toISOString(),
    modified: data.modified || data.updated || new Date().toISOString(),
    width: data.width || 800,
    height: data.height || 600,
    data: data.data || data.content || {},
    metadata: data.metadata || {}
  };
}
