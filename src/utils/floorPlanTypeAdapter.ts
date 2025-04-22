
/**
 * Floor Plan Type Adapter
 * Provides adapters between different FloorPlan interfaces in the application
 */
import type { FloorPlan as UnifiedFloorPlan, Room, Wall, Stroke } from '@/types/floor-plan/unifiedTypes';
import type { FloorPlan as AppFloorPlan } from '@/types/core/floor-plan/AppFloorPlan';
import { v4 as uuidv4 } from 'uuid';

/**
 * Convert unified floor plan to app floor plan format
 */
export function convertToAppFloorPlan(unifiedPlan: UnifiedFloorPlan): AppFloorPlan {
  const now = new Date().toISOString();
  
  return {
    id: unifiedPlan.id || uuidv4(),
    name: unifiedPlan.name || 'Untitled Floor Plan',
    label: unifiedPlan.label || '',
    walls: unifiedPlan.walls || [],
    rooms: unifiedPlan.rooms || [],
    strokes: unifiedPlan.strokes || [],
    canvasData: unifiedPlan.canvasData || null,
    canvasJson: unifiedPlan.canvasJson || null,
    createdAt: unifiedPlan.createdAt || now,
    updatedAt: unifiedPlan.updatedAt || now,
    metadata: {
      ...unifiedPlan.metadata,
      createdAt: unifiedPlan.metadata.createdAt || now,
      updatedAt: unifiedPlan.metadata.updatedAt || now,
    }
  } as AppFloorPlan;
}

/**
 * Convert app floor plan to unified floor plan format
 */
export function convertToUnifiedFloorPlan(appPlan: AppFloorPlan): UnifiedFloorPlan {
  const now = new Date().toISOString();
  
  return {
    id: appPlan.id || uuidv4(),
    name: appPlan.name || 'Untitled Floor Plan',
    label: appPlan.label || '',
    walls: appPlan.walls || [],
    rooms: appPlan.rooms || [],
    strokes: appPlan.strokes || [],
    createdAt: appPlan.createdAt || now,
    updatedAt: appPlan.updatedAt || now,
    gia: (appPlan as any).gia || 0,
    level: (appPlan as any).level || 0,
    index: (appPlan as any).index || 0,
    metadata: appPlan.metadata || {
      createdAt: now,
      updatedAt: now,
      paperSize: 'A4',
      level: 0,
      version: '1.0',
      author: 'System',
      notes: '',
      dateCreated: now,
      lastModified: now
    },
    data: {},
    userId: '',
    propertyId: ''
  } as UnifiedFloorPlan;
}

/**
 * Convert array of unified floor plans to app floor plans
 */
export function convertToAppFloorPlans(unifiedPlans: UnifiedFloorPlan[]): AppFloorPlan[] {
  return unifiedPlans.map(convertToAppFloorPlan);
}

/**
 * Convert array of app floor plans to unified floor plans
 */
export function convertToUnifiedFloorPlans(appPlans: AppFloorPlan[]): UnifiedFloorPlan[] {
  return appPlans.map(convertToUnifiedFloorPlan);
}
