
import type { FloorPlan, Room, Wall, Stroke, FloorPlanMetadata } from '@/types/floor-plan/unifiedTypes';
import type { RoomTypeLiteral, StrokeTypeLiteral } from '@/types/floor-plan/unifiedTypes';

/**
 * Validates and ensures a room type is one of the allowed values
 * @param type Room type string
 * @returns Valid room type
 */
export function asRoomType(type: string): RoomTypeLiteral {
  const validTypes: RoomTypeLiteral[] = ['living', 'bedroom', 'kitchen', 'bathroom', 'office', 'other'];
  return validTypes.includes(type as RoomTypeLiteral) ? (type as RoomTypeLiteral) : 'other';
}

/**
 * Validates and ensures a stroke type is one of the allowed values
 * @param type Stroke type string
 * @returns Valid stroke type
 */
export function asStrokeType(type: string): StrokeTypeLiteral {
  const validTypes: StrokeTypeLiteral[] = [
    'line', 'wall', 'door', 'window', 'furniture', 
    'annotation', 'polyline', 'room', 'freehand'
  ];
  return validTypes.includes(type as StrokeTypeLiteral) ? (type as StrokeTypeLiteral) : 'line';
}

/**
 * Adapts a FloorPlan to ensure it has all required properties
 */
export function adaptFloorPlan(plan: Partial<FloorPlan>): FloorPlan {
  const now = new Date().toISOString();
  
  return {
    id: plan.id || `floor-${Date.now()}`,
    name: plan.name || 'Untitled Floor Plan',
    label: plan.label || plan.name || 'Untitled Floor Plan',
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
    metadata: adaptMetadata(plan.metadata),
    data: plan.data || {},
    userId: plan.userId || 'default-user'
  };
}

/**
 * Adapts a FloorPlanMetadata to ensure it has all required properties
 */
export function adaptMetadata(metadata: Partial<FloorPlanMetadata> = {}): FloorPlanMetadata {
  const now = new Date().toISOString();
  
  return {
    version: metadata.version || '1.0',
    author: metadata.author || 'Unknown',
    dateCreated: metadata.dateCreated || now,
    lastModified: metadata.lastModified || now,
    notes: metadata.notes || '',
    createdAt: metadata.createdAt || now,
    updatedAt: metadata.updatedAt || now,
    paperSize: metadata.paperSize || 'A4',
    level: metadata.level || 0
  };
}
