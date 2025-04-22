
/**
 * Type Adapters
 * Utilities for adapting between different type systems and ensuring type safety
 */
import type { FloorPlan as UnifiedFloorPlan, Room as UnifiedRoom, Stroke as UnifiedStroke, Wall as UnifiedWall } from '@/types/floor-plan/unifiedTypes';
import type { FloorPlan as AppFloorPlan, Room as AppRoom, Stroke as AppStroke, Wall as AppWall } from '@/types/floorPlanTypes';
import type { FloorPlanMetadata } from '@/types/floor-plan/metadataTypes';
import type { Point } from '@/types/core/Point';

// Room Type Literals
export type RoomTypeLiteral = 'living' | 'kitchen' | 'bedroom' | 'bathroom' | 'hallway' | 'unknown';

// Stroke Type Literals
export type StrokeTypeLiteral = 'wall' | 'door' | 'window' | 'annotation' | 'measurement' | 'unknown';

/**
 * Safely cast a string to a RoomTypeLiteral
 * @param type Type string to convert
 * @returns A valid RoomTypeLiteral
 */
export function asRoomType(type: string | RoomTypeLiteral): RoomTypeLiteral {
  const validTypes: RoomTypeLiteral[] = ['living', 'kitchen', 'bedroom', 'bathroom', 'hallway', 'unknown'];
  return validTypes.includes(type as RoomTypeLiteral) ? (type as RoomTypeLiteral) : 'unknown';
}

/**
 * Safely cast a string to a StrokeTypeLiteral
 * @param type Type string to convert
 * @returns A valid StrokeTypeLiteral
 */
export function asStrokeType(type: string | StrokeTypeLiteral): StrokeTypeLiteral {
  const validTypes: StrokeTypeLiteral[] = ['wall', 'door', 'window', 'annotation', 'measurement', 'unknown'];
  return validTypes.includes(type as StrokeTypeLiteral) ? (type as StrokeTypeLiteral) : 'unknown';
}

/**
 * Adapt a floor plan to the unified interface
 * @param plan Floor plan data
 * @returns Adapted floor plan
 */
export function adaptFloorPlan(plan: any): UnifiedFloorPlan {
  const now = new Date().toISOString();
  // Ensure the basic required structure is present
  return {
    id: plan.id || `floor-${Date.now()}`,
    name: plan.name || 'Untitled Floor Plan',
    label: plan.label || plan.name || 'Untitled',
    walls: plan.walls || [],
    rooms: plan.rooms || [],
    strokes: plan.strokes || [],
    canvasData: plan.canvasData || null,
    canvasJson: plan.canvasJson || null,
    createdAt: plan.createdAt || now,
    updatedAt: plan.updatedAt || now,
    gia: plan.gia || 0,
    level: plan.level || 0,
    index: plan.index || plan.level || 0,
    metadata: adaptMetadata(plan.metadata) || {
      version: '1.0',
      author: 'User',
      dateCreated: now,
      lastModified: now,
      notes: '',
      paperSize: 'A4',
      level: plan.level || 0,
      createdAt: now,
      updatedAt: now
    },
    data: plan.data || {},
    userId: plan.userId || plan.propertyId || 'default-user'
  };
}

/**
 * Adapt a room to ensure it conforms to the unified Room interface
 */
export function adaptRoom(room: any): UnifiedRoom {
  return {
    id: room.id || `room-${Date.now()}`,
    name: room.name || 'Untitled Room',
    type: asRoomType(room.type),
    area: room.area || 0,
    perimeter: room.perimeter || 0,
    center: room.center || { x: 0, y: 0 },
    vertices: room.vertices || [],
    labelPosition: room.labelPosition || { x: 0, y: 0 },
    floorPlanId: room.floorPlanId || room.id?.split('-')[0] || `floor-${Date.now()}`
  };
}

/**
 * Adapt a stroke to ensure it conforms to the unified Stroke interface
 */
export function adaptStroke(stroke: any): UnifiedStroke {
  return {
    id: stroke.id || `stroke-${Date.now()}`,
    type: asStrokeType(stroke.type),
    points: stroke.points || [],
    color: stroke.color || '#000000',
    thickness: stroke.thickness || 1,
    floorPlanId: stroke.floorPlanId || stroke.id?.split('-')[0] || `floor-${Date.now()}`
  };
}

/**
 * Adapt a wall to ensure it conforms to the unified Wall interface
 */
export function adaptWall(wall: any): UnifiedWall {
  return {
    id: wall.id || `wall-${Date.now()}`,
    start: wall.start || { x: 0, y: 0 },
    end: wall.end || { x: 0, y: 0 },
    length: wall.length || 0,
    thickness: wall.thickness || 1,
    floorPlanId: wall.floorPlanId || wall.id?.split('-')[0] || `floor-${Date.now()}`
  };
}

/**
 * Adapt metadata to ensure it conforms to the FloorPlanMetadata interface
 */
export function adaptMetadata(metadata: any): FloorPlanMetadata {
  const now = new Date().toISOString();
  if (!metadata) {
    return {
      version: '1.0',
      author: 'User',
      dateCreated: now,
      lastModified: now,
      notes: '',
      paperSize: 'A4',
      level: 0,
      createdAt: now,
      updatedAt: now
    };
  }
  
  return {
    version: metadata.version || '1.0',
    author: metadata.author || 'User',
    dateCreated: metadata.dateCreated || now,
    lastModified: metadata.lastModified || now,
    notes: metadata.notes || '',
    paperSize: metadata.paperSize || 'A4',
    level: metadata.level || 0,
    createdAt: metadata.createdAt || now,
    updatedAt: metadata.updatedAt || now
  };
}

/**
 * Core to App type adapter
 * @param corePlan Core floor plan data
 * @returns App-compatible floor plan
 */
export function coreToAppFloorPlan(corePlan: any): AppFloorPlan {
  // This function adapts core floor plan types to app-compatible types
  const now = new Date().toISOString();
  return {
    ...adaptFloorPlan(corePlan),
    propertyId: corePlan.userId || corePlan.propertyId || 'default-property'
  };
}
