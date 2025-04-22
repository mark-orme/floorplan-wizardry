
/**
 * Floor Plan Type Adapter
 * Provides adapters between different FloorPlan interfaces in the application
 */
import type { FloorPlan as UnifiedFloorPlan, Room, Wall, Stroke, StrokeTypeLiteral, RoomTypeLiteral } from '@/types/floor-plan/unifiedTypes';
import type { FloorPlan as AppFloorPlan } from '@/types/floorPlanTypes';
import { asStrokeType, asRoomType } from '@/types/floor-plan/unifiedTypes';

/**
 * Convert a unified floor plan to a compatible app floor plan
 */
export function convertToAppFloorPlan(unifiedPlan: UnifiedFloorPlan): AppFloorPlan {
  const now = new Date().toISOString();
  
  return {
    id: unifiedPlan.id,
    propertyId: unifiedPlan.userId || unifiedPlan.propertyId || 'default-property',
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
  
  // Ensure ID is present
  const id = appPlan.id || `floor-${Date.now()}`;

  return {
    id,
    name: appPlan.name || 'Untitled Floor Plan',
    label: appPlan.label || appPlan.name || 'Untitled',
    walls: (appPlan.walls || []).map(wall => ({
      ...wall,
      roomIds: wall.roomIds || [] // Ensure roomIds exists
    })),
    rooms: (appPlan.rooms || []).map(room => ({
      ...room,
      type: asRoomType(room.type) // Ensure valid room type
    })),
    strokes: (appPlan.strokes || []).map(stroke => ({
      ...stroke,
      type: asStrokeType(stroke.type) // Ensure valid stroke type
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
      level: appPlan.metadata?.level || 0,
      createdAt: appPlan.metadata?.createdAt || now,
      updatedAt: appPlan.metadata?.updatedAt || now
    },
    data: appPlan.data || {},
    userId: appPlan.userId || appPlan.propertyId || 'default-user',
    propertyId: appPlan.propertyId // Keep for compatibility
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
