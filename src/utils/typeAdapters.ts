
/**
 * Type adapters for converting between different object formats
 */
import type { FloorPlan, Room, Wall, Stroke, FloorPlanMetadata, RoomTypeLiteral, StrokeTypeLiteral } from '@/types/floor-plan/unifiedTypes';
import type { Point } from '@/types/core/Point';
import { asStrokeType, asRoomType } from '@/types/floor-plan/unifiedTypes';

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
    perimeter: typeof room.perimeter === 'number' ? room.perimeter : 0,
    center: room.center || { x: 0, y: 0 },
    vertices: Array.isArray(room.vertices) ? room.vertices : [],
    labelPosition: room.labelPosition || { x: 0, y: 0 },
    floorPlanId: room.floorPlanId
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
    length: typeof wall.length === 'number' ? wall.length : 100,
    angle: typeof wall.angle === 'number' ? wall.angle : 0,
    roomIds: wall.roomIds || [],
    floorPlanId: wall.floorPlanId
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
    floorPlanId: stroke.floorPlanId
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
      level: 0,
      author: 'User',
      dateCreated: now,
      lastModified: now,
      notes: '',
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
    level: typeof metadata.level === 'number' ? metadata.level : 0,
    author: metadata.author || 'User',
    dateCreated: metadata.dateCreated || now,
    lastModified: metadata.lastModified || now,
    notes: metadata.notes || '',
    scale: typeof metadata.scale === 'number' ? metadata.scale : 1,
    unit: metadata.unit || 'mm',
    gridSize: typeof metadata.gridSize === 'number' ? metadata.gridSize : 10
  };
}

/**
 * Convert a floor plan from app-specific format to unified format
 */
export function coreToAppFloorPlan(plan: any): FloorPlan {
  return adaptFloorPlan(plan);
}
