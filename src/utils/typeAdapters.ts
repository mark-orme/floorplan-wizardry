
/**
 * Type adapters for converting between different object formats
 */
import type { FloorPlan, Room, Wall, Stroke, FloorPlanMetadata } from '@/types/floor-plan/unifiedTypes';
import type { Point } from '@/types/core/Point';

/**
 * Room type literal values
 */
export type RoomTypeLiteral = 
  | 'living' 
  | 'bedroom' 
  | 'kitchen' 
  | 'bathroom' 
  | 'hallway' 
  | 'dining' 
  | 'office' 
  | 'storage'
  | 'garage'
  | 'outdoor'
  | 'custom'
  | 'unknown';

/**
 * Stroke type literal values
 */
export type StrokeTypeLiteral = 
  | 'wall' 
  | 'door' 
  | 'window' 
  | 'appliance' 
  | 'furniture' 
  | 'dimension'
  | 'annotation'
  | 'custom'
  | 'unknown';

/**
 * Adapt a FloorPlan from any format to unified type
 */
export function adaptFloorPlan(plan: any): FloorPlan {
  const now = new Date().toISOString();
  
  return {
    id: plan.id || `floor-${Date.now()}`,
    name: plan.name || 'Untitled Floor Plan',
    label: plan.label || plan.name || 'Untitled',
    walls: Array.isArray(plan.walls) ? plan.walls : [],
    rooms: Array.isArray(plan.rooms) ? plan.rooms : [],
    strokes: Array.isArray(plan.strokes) ? plan.strokes : [],
    canvasData: plan.canvasData || null,
    canvasJson: plan.canvasJson || null,
    createdAt: plan.createdAt || now,
    updatedAt: plan.updatedAt || now,
    gia: typeof plan.gia === 'number' ? plan.gia : 0,
    level: typeof plan.level === 'number' ? plan.level : 0,
    index: typeof plan.index === 'number' ? plan.index : (plan.level || 0),
    metadata: adaptMetadata(plan.metadata),
    data: plan.data || {},
    userId: plan.userId || plan.propertyId || 'default-user'
  };
}

/**
 * Adapt a Room from any format to unified type
 */
export function adaptRoom(room: any): Room {
  return {
    id: room.id || `room-${Date.now()}`,
    name: room.name || 'Untitled Room',
    type: asRoomType(room.type),
    area: typeof room.area === 'number' ? room.area : 0,
    points: Array.isArray(room.points) ? room.points : [],
    center: room.center || { x: 0, y: 0 },
    metadata: room.metadata || {}
  };
}

/**
 * Adapt a Wall from any format to unified type
 */
export function adaptWall(wall: any): Wall {
  return {
    id: wall.id || `wall-${Date.now()}`,
    start: wall.start || { x: 0, y: 0 },
    end: wall.end || { x: 100, y: 0 },
    thickness: typeof wall.thickness === 'number' ? wall.thickness : 1,
    metadata: wall.metadata || {}
  };
}

/**
 * Adapt a Stroke from any format to unified type
 */
export function adaptStroke(stroke: any): Stroke {
  return {
    id: stroke.id || `stroke-${Date.now()}`,
    type: asStrokeType(stroke.type),
    points: Array.isArray(stroke.points) ? stroke.points : [],
    color: stroke.color || '#000000',
    thickness: typeof stroke.thickness === 'number' ? stroke.thickness : 1,
    metadata: stroke.metadata || {}
  };
}

/**
 * Adapt metadata from any format to unified type
 */
export function adaptMetadata(metadata: any): FloorPlanMetadata {
  const now = new Date().toISOString();
  
  if (!metadata) {
    return {
      createdAt: now,
      updatedAt: now,
      version: '1.0',
      paperSize: 'A4',
      scale: 1,
      unit: 'mm',
      gridSize: 10
    };
  }
  
  return {
    createdAt: metadata.createdAt || now,
    updatedAt: metadata.updatedAt || now,
    version: metadata.version || '1.0',
    paperSize: metadata.paperSize || 'A4',
    scale: typeof metadata.scale === 'number' ? metadata.scale : 1,
    unit: metadata.unit || 'mm',
    gridSize: typeof metadata.gridSize === 'number' ? metadata.gridSize : 10,
    // Forward any additional properties
    ...metadata
  };
}

/**
 * Convert any value to a valid StrokeTypeLiteral
 */
export function asStrokeType(type: any): StrokeTypeLiteral {
  const validTypes: StrokeTypeLiteral[] = [
    'wall', 'door', 'window', 'appliance', 'furniture', 
    'dimension', 'annotation', 'custom', 'unknown'
  ];
  
  return validTypes.includes(type as StrokeTypeLiteral) 
    ? (type as StrokeTypeLiteral) 
    : 'unknown';
}

/**
 * Convert any value to a valid RoomTypeLiteral
 */
export function asRoomType(type: any): RoomTypeLiteral {
  const validTypes: RoomTypeLiteral[] = [
    'living', 'bedroom', 'kitchen', 'bathroom', 'hallway',
    'dining', 'office', 'storage', 'garage', 'outdoor',
    'custom', 'unknown'
  ];
  
  return validTypes.includes(type as RoomTypeLiteral)
    ? (type as RoomTypeLiteral)
    : 'unknown';
}

/**
 * Convert a floor plan from app-specific format to unified format
 */
export function coreToAppFloorPlan(plan: any): FloorPlan {
  return adaptFloorPlan(plan);
}
