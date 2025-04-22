
/**
 * Floor Plan Type Adapter
 * Provides adapters between different FloorPlan interfaces in the application
 */
import type { FloorPlan as UnifiedFloorPlan } from '@/types/floor-plan/unifiedTypes';
import type { FloorPlan as AppFloorPlan } from '@/types/floorPlanTypes';
import { adaptFloorPlan, adaptMetadata } from '@/utils/typeAdapters';

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
    walls: unifiedPlan.walls.map(wall => ({
      ...wall,
      floorPlanId: wall.floorPlanId || unifiedPlan.id
    })),
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
    metadata: adaptMetadata(unifiedPlan.metadata),
    userId: unifiedPlan.userId
  };
}

/**
 * Convert an app floor plan to a unified floor plan
 */
export function convertToUnifiedFloorPlan(appPlan: AppFloorPlan): UnifiedFloorPlan {
  const now = new Date().toISOString();

  return adaptFloorPlan({
    id: appPlan.id || `floor-${Date.now()}`,
    name: appPlan.name || 'Untitled Floor Plan',
    label: appPlan.label || appPlan.name || 'Untitled',
    walls: appPlan.walls || [],
    rooms: (appPlan.rooms || []),
    strokes: (appPlan.strokes || []),
    canvasData: appPlan.canvasData,
    canvasJson: appPlan.canvasJson,
    createdAt: appPlan.createdAt || now,
    updatedAt: appPlan.updatedAt || now,
    gia: appPlan.gia || 0,
    level: appPlan.level || 0,
    index: appPlan.index || appPlan.level || 0,
    metadata: appPlan.metadata,
    data: appPlan.data || {},
    userId: appPlan.userId || appPlan.propertyId || 'default-user'
  });
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
