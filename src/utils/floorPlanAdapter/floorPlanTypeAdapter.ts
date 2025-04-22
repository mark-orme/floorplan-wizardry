
/**
 * Floor Plan Type Adapter
 * Provides adapters between different FloorPlan interfaces in the application
 */
import type { FloorPlan as UnifiedFloorPlan, Room, Wall, Stroke, StrokeTypeLiteral, RoomTypeLiteral } from '@/types/floor-plan/unifiedTypes';
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
      // Only add floorPlanId if not already present
      floorPlanId: wall.floorPlanId || unifiedPlan.id
    })),
    rooms: unifiedPlan.rooms.map(room => ({
      ...room,
      // Only add floorPlanId if not already present
      floorPlanId: room.floorPlanId || unifiedPlan.id
    })),
    strokes: unifiedPlan.strokes.map(stroke => ({
      ...stroke,
      // Only add floorPlanId if not already present
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
      paperSize: unifiedPlan.metadata?.paperSize,
      level: unifiedPlan.metadata?.level,
      createdAt: unifiedPlan.metadata?.createdAt,
      updatedAt: unifiedPlan.metadata?.updatedAt
    },
    userId: unifiedPlan.userId
  };
}

/**
 * Convert an app floor plan to a unified floor plan
 */
export function convertToUnifiedFloorPlan(appPlan: AppFloorPlan): UnifiedFloorPlan {
  const now = new Date().toISOString();
  
  // Use the adaptFloorPlan function to ensure all required properties are present
  return adaptFloorPlan({
    id: appPlan.id || `floor-${Date.now()}`,
    name: appPlan.name || 'Untitled Floor Plan',
    label: appPlan.label || appPlan.name || 'Untitled',
    walls: appPlan.walls || [],
    rooms: appPlan.rooms || [],
    strokes: appPlan.strokes || [],
    canvasData: appPlan.canvasData,
    canvasJson: appPlan.canvasJson,
    createdAt: appPlan.createdAt || now,
    updatedAt: appPlan.updatedAt || now,
    gia: appPlan.gia || 0,
    level: appPlan.level || 0,
    index: appPlan.index || appPlan.level || 0,
    metadata: appPlan.metadata ? adaptMetadata({
      version: appPlan.metadata.version,
      author: appPlan.metadata.author,
      dateCreated: appPlan.metadata.dateCreated,
      lastModified: appPlan.metadata.lastModified,
      notes: appPlan.metadata.notes,
      paperSize: appPlan.metadata.paperSize,
      level: appPlan.metadata.level,
      createdAt: appPlan.metadata.createdAt,
      updatedAt: appPlan.metadata.updatedAt
    }) : undefined,
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
