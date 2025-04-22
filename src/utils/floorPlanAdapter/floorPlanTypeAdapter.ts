
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
  const now = new Date().toISOString();
  
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
    metadata: {
      version: unifiedPlan.metadata?.version || '1.0',
      author: unifiedPlan.metadata?.author || 'User',
      dateCreated: unifiedPlan.metadata?.dateCreated || now,
      lastModified: unifiedPlan.metadata?.lastModified || now,
      notes: unifiedPlan.metadata?.notes || '',
      paperSize: unifiedPlan.metadata?.paperSize || 'A4',
      level: unifiedPlan.metadata?.level || unifiedPlan.level || 0,
      createdAt: unifiedPlan.metadata?.createdAt || unifiedPlan.createdAt || now,
      updatedAt: unifiedPlan.metadata?.updatedAt || unifiedPlan.updatedAt || now
    },
    userId: unifiedPlan.userId
  };
}

/**
 * Convert an app floor plan to a unified floor plan
 */
export function convertToUnifiedFloorPlan(appPlan: AppFloorPlan): UnifiedFloorPlan {
  const now = new Date().toISOString();

  return {
    id: appPlan.id || `floor-${Date.now()}`,
    name: appPlan.name || 'Untitled Floor Plan',
    label: appPlan.label || appPlan.name || 'Untitled',
    walls: appPlan.walls || [],
    rooms: (appPlan.rooms || []).map(room => ({
      ...room,
      // Ensure floorPlanId exists for compatibility
      floorPlanId: room.floorPlanId || appPlan.id || `floor-${Date.now()}`
    })),
    strokes: (appPlan.strokes || []).map(stroke => ({
      ...stroke,
      // Ensure floorPlanId exists for compatibility
      floorPlanId: stroke.floorPlanId || appPlan.id || `floor-${Date.now()}`
    })),
    canvasData: appPlan.canvasData,
    canvasJson: appPlan.canvasJson,
    createdAt: appPlan.createdAt || now,
    updatedAt: appPlan.updatedAt || now,
    gia: appPlan.gia || 0,
    level: appPlan.level || 0,
    index: appPlan.index || appPlan.level || 0,
    metadata: {
      version: appPlan.metadata?.version || '1.0',
      author: appPlan.metadata?.author || 'User',
      dateCreated: appPlan.metadata?.dateCreated || now,
      lastModified: appPlan.metadata?.lastModified || now,
      notes: appPlan.metadata?.notes || '',
      paperSize: appPlan.metadata?.paperSize || 'A4',
      level: appPlan.metadata?.level || appPlan.level || 0,
      createdAt: appPlan.metadata?.createdAt || appPlan.createdAt || now,
      updatedAt: appPlan.metadata?.updatedAt || appPlan.updatedAt || now
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
