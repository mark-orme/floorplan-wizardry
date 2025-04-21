
/**
 * Unified Types
 * Central point for all floor plan related type definitions
 * @module types/floor-plan/unifiedTypes
 */

import { Point } from '../core/Point';
import { PaperSize } from './basicTypes';

/**
 * Stroke type literals
 */
export type StrokeTypeLiteral = 
  | 'line' 
  | 'wall' 
  | 'door' 
  | 'window' 
  | 'furniture' 
  | 'annotation'
  | 'polyline'  
  | 'room'
  | 'freehand';

/**
 * Room type literals
 */
export type RoomTypeLiteral = 'living' | 'bedroom' | 'kitchen' | 'bathroom' | 'office' | 'other';

/**
 * Stroke interface for floor plan
 */
export interface Stroke {
  /** Unique identifier */
  id: string;
  
  /** Points array */
  points: Point[];
  
  /** Stroke type */
  type: StrokeTypeLiteral;
  
  /** Color */
  color: string;
  
  /** Thickness */
  thickness: number;
  
  /** Width (alias for thickness) */
  width?: number;
}

/**
 * Wall interface for floor plan
 */
export interface Wall {
  /** Unique identifier */
  id: string;
  
  /** Start point */
  start: Point;
  
  /** End point */
  end: Point;
  
  /** Wall thickness */
  thickness: number;
  
  /** Wall color */
  color: string;
  
  /** Wall height (optional) */
  height?: number;
  
  /** Room IDs connected to this wall */
  roomIds: string[];
  
  /** Length of the wall (calculated property) */
  length: number;
}

/**
 * Room interface for floor plan
 */
export interface Room {
  /** Unique identifier */
  id: string;
  
  /** Room name */
  name: string;
  
  /** Room type */
  type: RoomTypeLiteral;
  
  /** Room vertices (boundary points) */
  vertices: Point[];
  
  /** Room area */
  area: number;
  
  /** Room perimeter */
  perimeter: number;
  
  /** Room center point */
  center: Point;
  
  /** Label position */
  labelPosition: Point;
  
  /** Room color */
  color: string;
}

/**
 * Floor plan metadata interface
 */
export interface FloorPlanMetadata {
  /** Creation date timestamp */
  createdAt: string;
  
  /** Last update timestamp */
  updatedAt: string;
  
  /** Paper size for printing */
  paperSize: PaperSize | string;
  
  /** Floor level (0 = ground floor) */
  level: number;

  /** Metadata version */
  version: string;
  
  /** Author name */
  author: string;
  
  /** Date created formatted */
  dateCreated: string;
  
  /** Last modified formatted */
  lastModified: string;
  
  /** Additional notes */
  notes: string;
}

/**
 * FloorPlan interface
 */
export interface FloorPlan {
  /** Unique identifier */
  id: string;
  
  /** Floor plan name */
  name: string;
  
  /** Display label */
  label?: string;
  
  /** Walls array */
  walls: Wall[];
  
  /** Rooms array */
  rooms: Room[];
  
  /** Strokes array */
  strokes: Stroke[];
  
  /** Serialized canvas data (optional) */
  canvasData: string | null;
  
  /** Canvas JSON serialization */
  canvasJson: string | null;
  
  /** Canvas state for persistence and undo/redo */
  canvasState?: any;
  
  /** Creation date timestamp */
  createdAt: string;
  
  /** Last update timestamp */
  updatedAt: string;
  
  /** Gross internal area in square meters */
  gia: number;
  
  /** Floor level (0 = ground floor) */
  level: number;
  
  /** Floor index (same as level for compatibility) */
  index: number;
  
  /** Floor plan metadata */
  metadata: FloorPlanMetadata;
  
  /** Additional data (required) */
  data: any;
  
  /** User ID (required) */
  userId: string;
}

/**
 * Helper to safely convert any string to a StrokeType
 * @param type Type string to convert
 * @returns Valid StrokeTypeLiteral
 */
export function asStrokeType(type: string): StrokeTypeLiteral {
  const validTypes: StrokeTypeLiteral[] = [
    'line', 'wall', 'door', 'window', 'furniture', 'annotation',
    'polyline', 'room', 'freehand'
  ];
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
 * Create a test floor plan for testing
 */
export function createTestFloorPlan(partial: Partial<FloorPlan> = {}): FloorPlan {
  const now = new Date().toISOString();
  return {
    id: partial.id || 'test-floor-plan-id',
    name: partial.name || 'Test Floor Plan',
    label: partial.label || 'Test Floor Plan',
    walls: partial.walls || [],
    rooms: partial.rooms || [],
    strokes: partial.strokes || [],
    canvasData: partial.canvasData || null,
    canvasJson: partial.canvasJson || null,
    createdAt: partial.createdAt || now,
    updatedAt: partial.updatedAt || now,
    gia: partial.gia || 0,
    level: partial.level || 0,
    index: partial.index || 0,
    metadata: partial.metadata || {
      createdAt: now,
      updatedAt: now,
      paperSize: PaperSize.A4,
      level: 0,
      version: '1.0',
      author: 'Test User',
      dateCreated: now,
      lastModified: now,
      notes: 'Test floor plan'
    },
    data: partial.data || {},
    userId: partial.userId || 'test-user-id'
  };
}

/**
 * Create a test stroke for testing
 */
export function createTestStroke(partial: Partial<Stroke> = {}): Stroke {
  return {
    id: partial.id || 'test-stroke-id',
    points: partial.points || [{ x: 0, y: 0 }, { x: 100, y: 100 }],
    type: partial.type || 'line',
    color: partial.color || '#000000',
    thickness: partial.thickness || 2,
    width: partial.width || 2
  };
}

/**
 * Create a test wall for testing
 */
export function createTestWall(partial: Partial<Wall> = {}): Wall {
  const start = partial.start || { x: 0, y: 0 };
  const end = partial.end || { x: 100, y: 0 };
  
  // Calculate length if not provided
  const length = partial.length || Math.sqrt(
    Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2)
  );
  
  return {
    id: partial.id || 'test-wall-id',
    start,
    end,
    thickness: partial.thickness || 5,
    color: partial.color || '#000000',
    height: partial.height,
    roomIds: partial.roomIds || [],
    length
  };
}

/**
 * Create a test room for testing
 */
export function createTestRoom(partial: Partial<Room> = {}): Room {
  const vertices = partial.vertices || [
    { x: 0, y: 0 },
    { x: 100, y: 0 },
    { x: 100, y: 100 },
    { x: 0, y: 100 }
  ];
  
  // Calculate center if not provided
  const center = partial.center || {
    x: vertices.reduce((sum, p) => sum + p.x, 0) / vertices.length,
    y: vertices.reduce((sum, p) => sum + p.y, 0) / vertices.length
  };
  
  // Calculate perimeter if not provided
  const perimeter = partial.perimeter || vertices.reduce((sum, p, i) => {
    const nextPoint = vertices[(i + 1) % vertices.length];
    const dx = nextPoint.x - p.x;
    const dy = nextPoint.y - p.y;
    return sum + Math.sqrt(dx * dx + dy * dy);
  }, 0);
  
  return {
    id: partial.id || 'test-room-id',
    name: partial.name || 'Test Room',
    type: partial.type || 'living',
    vertices,
    area: partial.area || 10000,
    perimeter,
    center,
    labelPosition: partial.labelPosition || center,
    color: partial.color || '#f5f5f5'
  };
}

/**
 * Create a test point for testing
 */
export function createTestPoint(x: number = 0, y: number = 0): Point {
  return { x, y };
}

// Re-export PaperSize for convenience
export { PaperSize };
