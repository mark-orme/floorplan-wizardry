
/**
 * Type adapters for converting between different object types
 * @module utils/typeAdapters
 */
import { 
  FloorPlan, 
  Room, 
  Wall, 
  Stroke, 
  FloorPlanMetadata, 
  StrokeTypeLiteral, 
  RoomTypeLiteral 
} from '@/types/floor-plan/unifiedTypes';
import { Point } from '@/types/core/Point';
import { createCompleteMetadata } from './debug/typeDiagnostics';
import { calculateWallLength } from './debug/typeDiagnostics';

/**
 * Helper to safely convert any string to a StrokeType
 * @param type Type string to convert
 * @returns Valid StrokeTypeLiteral
 */
export function asStrokeType(type: string): StrokeTypeLiteral {
  const validTypes: StrokeTypeLiteral[] = ['line', 'wall', 'door', 'window', 'furniture', 'annotation'];
  return validTypes.includes(type as StrokeTypeLiteral) ? (type as StrokeTypeLiteral) : 'line';
}

/**
 * Helper to safely convert any string to a RoomType
 * @param type Type string to convert
 * @returns Valid RoomTypeLiteral
 */
export function asRoomType(type: string): RoomTypeLiteral {
  const validTypes: RoomTypeLiteral[] = ['living', 'bedroom', 'kitchen', 'bathroom', 'office', 'other'];
  return validTypes.includes(type as RoomTypeLiteral) ? (type as RoomTypeLiteral) : 'other';
}

/**
 * Adapt point object to ensure it has required properties
 * @param point Partial point data
 * @returns Complete Point object
 */
export function adaptPoint(point: Partial<Point>): Point {
  return {
    x: point.x || 0,
    y: point.y || 0
  };
}

/**
 * Adapt stroke to ensure it has all required properties
 * @param stroke Partial stroke data
 * @returns Complete Stroke object
 */
export function adaptStroke(stroke: Partial<Stroke>): Stroke {
  return {
    id: stroke.id || `stroke-${Date.now()}`,
    points: stroke.points || [],
    type: stroke.type || 'line',
    color: stroke.color || '#000000',
    thickness: stroke.thickness || 1,
    width: stroke.width || 1
  };
}

/**
 * Adapt wall to ensure it has all required properties
 * @param wall Partial wall data
 * @returns Complete Wall object
 */
export function adaptWall(wall: Partial<Wall>): Wall {
  const start = adaptPoint(wall.start || { x: 0, y: 0 });
  const end = adaptPoint(wall.end || { x: 100, y: 0 });
  
  return {
    id: wall.id || `wall-${Date.now()}`,
    start,
    end,
    thickness: wall.thickness || 5,
    color: wall.color || '#000000',
    length: wall.length || calculateWallLength(start, end),
    roomIds: wall.roomIds || [],
    height: wall.height
  };
}

/**
 * Adapt room to ensure it has all required properties
 * @param room Partial room data
 * @returns Complete Room object
 */
export function adaptRoom(room: Partial<Room>): Room {
  const vertices = room.vertices || [];
  
  // Calculate center if not provided
  const center = room.center || {
    x: vertices.reduce((sum, v) => sum + v.x, 0) / Math.max(vertices.length, 1),
    y: vertices.reduce((sum, v) => sum + v.y, 0) / Math.max(vertices.length, 1)
  };
  
  return {
    id: room.id || `room-${Date.now()}`,
    name: room.name || 'Unnamed Room',
    type: room.type || 'other',
    vertices: vertices,
    area: room.area || 0,
    perimeter: room.perimeter || 0,
    labelPosition: room.labelPosition || center,
    center: center,
    color: room.color || '#f5f5f5'
  };
}

/**
 * Adapt floor plan to ensure it has all required properties
 * @param floorPlan Partial floor plan data
 * @returns Complete FloorPlan object
 */
export function adaptFloorPlan(floorPlan: Partial<FloorPlan>): FloorPlan {
  const now = new Date().toISOString();
  
  return {
    id: floorPlan.id || `plan-${Date.now()}`,
    name: floorPlan.name || 'Untitled Floor Plan',
    label: floorPlan.label || 'Untitled',
    walls: floorPlan.walls || [],
    rooms: floorPlan.rooms || [],
    strokes: floorPlan.strokes || [],
    canvasData: floorPlan.canvasData || null,
    canvasJson: floorPlan.canvasJson || null,
    canvasState: floorPlan.canvasState || null,
    metadata: floorPlan.metadata || createCompleteMetadata(),
    data: floorPlan.data || {},
    createdAt: floorPlan.createdAt || now,
    updatedAt: floorPlan.updatedAt || now,
    gia: floorPlan.gia || 0,
    level: floorPlan.level || 0,
    index: floorPlan.index || 0,
    userId: floorPlan.userId || 'unknown'
  };
}

/**
 * Adapt multiple floor plans to ensure they all have required properties
 * @param floorPlans Array of partial floor plans
 * @returns Array of complete floor plans
 */
export function adaptFloorPlans(floorPlans: Partial<FloorPlan>[]): FloorPlan[] {
  return floorPlans.map(plan => adaptFloorPlan(plan));
}

/**
 * Adapt metadata to ensure it has all required properties
 * @param metadata Partial metadata
 * @returns Complete metadata
 */
export function adaptFloorPlanMetadata(metadata: Partial<FloorPlanMetadata>): FloorPlanMetadata {
  return createCompleteMetadata(metadata);
}
