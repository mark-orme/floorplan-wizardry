/**
 * Type Adapters
 * Provides utilities for converting between different type systems
 */
import type { FloorPlan as UnifiedFloorPlan, Room as UnifiedRoom, Stroke as UnifiedStroke } from '@/types/floor-plan/unifiedTypes';
import type { FloorPlan as LegacyFloorPlan, Room as LegacyRoom, Stroke as LegacyStroke, RoomTypeLiteral, StrokeTypeLiteral } from '@/types/floorPlanTypes';

/**
 * Convert string value to room type safely
 */
export function asRoomType(type: string): RoomTypeLiteral {
  const validTypes: RoomTypeLiteral[] = ['living', 'bedroom', 'kitchen', 'bathroom', 'office', 'other'];
  return validTypes.includes(type as RoomTypeLiteral) ? (type as RoomTypeLiteral) : 'other';
}

/**
 * Convert string value to stroke type safely
 */
export function asStrokeType(type: string): StrokeTypeLiteral {
  const validTypes: StrokeTypeLiteral[] = ['line', 'wall', 'door', 'window', 'furniture', 'annotation', 'polyline', 'room', 'freehand'];
  return validTypes.includes(type as StrokeTypeLiteral) ? (type as StrokeTypeLiteral) : 'line';
}

/**
 * Adapt any floor plan type to unified format
 */
export function adaptFloorPlan(floorPlan: any): UnifiedFloorPlan {
  const now = new Date().toISOString();
  
  // Ensure we have an ID
  const id = floorPlan.id || `floor-${Date.now()}`;
  
  // Handle different metadata formats
  const metadata = {
    version: '1.0',
    author: 'User',
    dateCreated: floorPlan.createdAt || now,
    lastModified: floorPlan.updatedAt || now,
    notes: '',
    paperSize: 'A4',
    level: floorPlan.level || 0,
    createdAt: floorPlan.createdAt || now,
    updatedAt: floorPlan.updatedAt || now,
    ...(floorPlan.metadata || {})
  };
  
  return {
    id,
    name: floorPlan.name || 'Untitled Floor Plan',
    label: floorPlan.label || floorPlan.name || 'Untitled',
    walls: floorPlan.walls || [],
    rooms: (floorPlan.rooms || []).map(adaptRoom),
    strokes: (floorPlan.strokes || []).map(adaptStroke),
    canvasData: floorPlan.canvasData,
    canvasJson: floorPlan.canvasJson,
    createdAt: floorPlan.createdAt || now,
    updatedAt: floorPlan.updatedAt || now,
    gia: floorPlan.gia || 0,
    level: floorPlan.level || 0,
    index: floorPlan.index || floorPlan.level || 0,
    metadata,
    data: floorPlan.data || {},
    userId: floorPlan.userId || floorPlan.propertyId || 'default-user'
  };
}

/**
 * Adapt room to unified format
 */
export function adaptRoom(room: any): UnifiedRoom {
  // Build compatible room
  const adaptedRoom: any = { ...room };
  
  // Ensure ID exists
  if (!adaptedRoom.id) {
    adaptedRoom.id = `room-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }
  
  // If room has a floorPlanId property, keep it
  if (!adaptedRoom.floorPlanId) {
    adaptedRoom.floorPlanId = room.id?.split('-')[0] || `floor-${Date.now()}`;
  }
  
  return adaptedRoom;
}

/**
 * Adapt stroke to unified format
 */
export function adaptStroke(stroke: any): UnifiedStroke {
  // Build compatible stroke
  const adaptedStroke: any = { ...stroke };
  
  // Ensure ID exists
  if (!adaptedStroke.id) {
    adaptedStroke.id = `stroke-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }
  
  // If stroke has a floorPlanId property, keep it
  if (!adaptedStroke.floorPlanId) {
    adaptedStroke.floorPlanId = stroke.id?.split('-')[0] || `floor-${Date.now()}`;
  }
  
  return adaptedStroke;
}

/**
 * Convert a unified floor plan to a legacy floor plan format
 */
export function coreToAppFloorPlan(unifiedPlan: UnifiedFloorPlan): LegacyFloorPlan {
  return {
    id: unifiedPlan.id,
    propertyId: unifiedPlan.userId || 'default-property',
    name: unifiedPlan.name,
    label: unifiedPlan.label,
    walls: unifiedPlan.walls,
    rooms: unifiedPlan.rooms.map((r) => ({
      ...r,
      floorPlanId: r.floorPlanId || unifiedPlan.id
    })),
    strokes: unifiedPlan.strokes.map((s) => ({
      ...s,
      floorPlanId: s.floorPlanId || unifiedPlan.id
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
