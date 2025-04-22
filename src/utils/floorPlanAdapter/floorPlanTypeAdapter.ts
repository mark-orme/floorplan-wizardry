
/**
 * Floor Plan Type Adapter
 * Provides adapters between different FloorPlan interfaces in the application
 */
import type { FloorPlan as UnifiedFloorPlan } from '@/types/floor-plan/unifiedTypes';
import type { FloorPlan as AppFloorPlan } from '@/types/floorPlanTypes';

/**
 * Convert a unified floor plan to a compatible app floor plan
 */
export function convertToAppFloorPlan(unifiedPlan: UnifiedFloorPlan): AppFloorPlan {
  return {
    id: unifiedPlan.id,
    propertyId: unifiedPlan.userId || 'default-property',
    name: unifiedPlan.name,
    label: unifiedPlan.label,
    walls: unifiedPlan.walls,
    rooms: unifiedPlan.rooms.map(room => ({
      ...room,
      floorPlanId: room.floorPlanId || unifiedPlan.id
    })),
    strokes: unifiedPlan.strokes.map(stroke => ({
      ...stroke,
      floorPlanId: stroke.floorPlanId || unifiedPlan.id
    })),
    data: unifiedPlan.data || {},
    version: unifiedPlan.metadata?.version,
    createdAt: unifiedPlan.createdAt,
    updatedAt: unifiedPlan.updatedAt,
    level: unifiedPlan.level,
    index: unifiedPlan.index,
    gia: unifiedPlan.gia,
    canvasData: unifiedPlan.canvasData,
    canvasJson: unifiedPlan.canvasJson,
    metadata: unifiedPlan.metadata,
    userId: unifiedPlan.userId
  };
}

/**
 * Convert an app floor plan to a unified floor plan
 */
export function convertToUnifiedFloorPlan(appPlan: AppFloorPlan): UnifiedFloorPlan {
  return {
    id: appPlan.id || `floor-${Date.now()}`,
    name: appPlan.name || 'Untitled Floor Plan',
    label: appPlan.label || appPlan.name || 'Untitled',
    walls: appPlan.walls || [],
    rooms: (appPlan.rooms || []).map(room => ({
      ...room,
      floorPlanId: room.floorPlanId || appPlan.id || `floor-${Date.now()}`
    })),
    strokes: (appPlan.strokes || []).map(stroke => ({
      ...stroke,
      floorPlanId: stroke.floorPlanId || appPlan.id || `floor-${Date.now()}`
    })),
    canvasData: appPlan.canvasData,
    canvasJson: appPlan.canvasJson,
    createdAt: appPlan.createdAt || new Date().toISOString(),
    updatedAt: appPlan.updatedAt || new Date().toISOString(),
    gia: appPlan.gia || 0,
    level: appPlan.level || 0,
    index: appPlan.index || appPlan.level || 0,
    metadata: appPlan.metadata || {
      version: '1.0',
      author: 'User',
      dateCreated: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      notes: '',
      paperSize: 'A4',
      level: appPlan.level || 0,
      createdAt: appPlan.createdAt || new Date().toISOString(),
      updatedAt: appPlan.updatedAt || new Date().toISOString()
    },
    data: appPlan.data || {},
    userId: appPlan.userId || appPlan.propertyId || 'default-user'
  };
}

/**
 * Convert multiple unified floor plans to app floor plans
 */
export function convertToAppFloorPlans(unifiedPlans: UnifiedFloorPlan[]): AppFloorPlan[] {
  return unifiedPlans.map(convertToAppFloorPlan);
}

/**
 * Convert multiple app floor plans to unified floor plans
 */
export function convertToUnifiedFloorPlans(appPlans: AppFloorPlan[]): UnifiedFloorPlan[] {
  return appPlans.map(convertToUnifiedFloorPlan);
}
