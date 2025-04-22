
/**
 * Floor Plan Type Adapter
 * Provides adapters between different FloorPlan interfaces in the application
 */
import type { FloorPlan, Room, Wall, Stroke, StrokeTypeLiteral, RoomTypeLiteral } from '@/types/floor-plan/unifiedTypes';
import { asStrokeType, asRoomType } from '@/types/floor-plan/unifiedTypes';

/**
 * Convert a unified floor plan to a compatible app floor plan
 */
export function convertToAppFloorPlan(unifiedPlan: FloorPlan): FloorPlan {
  const now = new Date().toISOString();
  
  return {
    id: unifiedPlan.id,
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
    createdAt: unifiedPlan.createdAt,
    updatedAt: unifiedPlan.updatedAt,
    level: unifiedPlan.level,
    index: unifiedPlan.index,
    gia: unifiedPlan.gia,
    metadata: {
      createdAt: unifiedPlan.metadata?.createdAt || now,
      updatedAt: unifiedPlan.metadata?.updatedAt || now,
      version: unifiedPlan.metadata?.version || '1.0',
      author: unifiedPlan.metadata?.author || 'User',
      notes: unifiedPlan.metadata?.notes || '',
      paperSize: unifiedPlan.metadata?.paperSize,
      level: unifiedPlan.metadata?.level,
      dateCreated: unifiedPlan.metadata?.dateCreated || now,
      lastModified: unifiedPlan.metadata?.lastModified || now
    },
    userId: unifiedPlan.userId
  };
}

/**
 * Convert an app floor plan to a unified floor plan
 */
export function convertToUnifiedFloorPlan(appPlan: any): FloorPlan {
  const now = new Date().toISOString();
  
  // Ensure ID is present
  const id = appPlan.id || `floor-${Date.now()}`;

  return {
    id,
    name: appPlan.name || 'Untitled Floor Plan',
    label: appPlan.label || appPlan.name || 'Untitled',
    walls: (appPlan.walls || []).map((wall: any) => ({
      ...wall,
      roomIds: wall.roomIds || [] // Ensure roomIds exists
    })),
    rooms: (appPlan.rooms || []).map((room: any) => ({
      ...room,
      type: asRoomType(room.type) // Ensure valid room type
    })),
    strokes: (appPlan.strokes || []).map((stroke: any) => ({
      ...stroke,
      type: asStrokeType(stroke.type), // Ensure valid stroke type
      width: stroke.width || stroke.thickness || 1 // Handle both width and thickness
    })),
    createdAt: appPlan.createdAt || now,
    updatedAt: appPlan.updatedAt || now,
    gia: appPlan.gia || 0,
    level: appPlan.level || 0,
    index: appPlan.index || appPlan.level || 0,
    metadata: {
      createdAt: appPlan.metadata?.createdAt || now,
      updatedAt: appPlan.metadata?.updatedAt || now,
      version: appPlan.metadata?.version || '1.0',
      author: appPlan.metadata?.author || 'User',
      notes: appPlan.metadata?.notes || '',
      paperSize: appPlan.metadata?.paperSize || 'A4',
      level: appPlan.metadata?.level || 0,
      dateCreated: appPlan.metadata?.dateCreated || now,
      lastModified: appPlan.metadata?.lastModified || now
    },
    data: appPlan.data || {},
    userId: appPlan.userId || appPlan.propertyId || 'default-user'
  };
}

/**
 * Convert multiple unified floor plans to app floor plans
 */
export function convertToAppFloorPlans(unifiedPlans: FloorPlan[]): FloorPlan[] {
  return unifiedPlans.map(convertToAppFloorPlan);
}

/**
 * Convert multiple app floor plans to unified floor plans
 */
export function convertToUnifiedFloorPlans(appPlans: any[]): FloorPlan[] {
  return appPlans.map(convertToUnifiedFloorPlan);
}
