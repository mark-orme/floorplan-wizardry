
/**
 * Unified Type Definitions for Floor Plans
 * The single source of truth for all floor plan related types
 * @module types/floor-plan/unifiedTypes
 */
import { v4 as uuidv4 } from 'uuid';
import { Point as FabricPoint } from 'fabric';
import { SimplePoint } from '@/utils/fabric/pointAdapter';

/**
 * Paper size enum for printing
 */
export enum PaperSize {
  A0 = 'A0',
  A1 = 'A1',
  A2 = 'A2',
  A3 = 'A3',
  A4 = 'A4',
  LETTER = 'Letter',
  LEGAL = 'Legal',
  TABLOID = 'Tabloid'
}

/**
 * Point interface for coordinates
 * Note: This is a simple point, not a FabricPoint
 */
export interface Point {
  x: number;
  y: number;
}

/**
 * Stroke type enum as string literals
 */
export type StrokeTypeLiteral = 'line' | 'wall' | 'door' | 'window' | 'furniture' | 'annotation' | 'polyline' | 'room' | 'freehand';

/**
 * Room type enum as string literals
 */
export type RoomTypeLiteral = 'living' | 'bedroom' | 'kitchen' | 'bathroom' | 'office' | 'other';

/**
 * Stroke interface for annotations
 */
export interface Stroke {
  /** Unique identifier */
  id: string;
  
  /** Stroke points */
  points: Point[];
  
  /** Stroke type */
  type: StrokeTypeLiteral;
  
  /** Stroke color */
  color: string;
  
  /** Stroke width (required) */
  width: number;
  
  /** Stroke thickness (alias for width, for backward compatibility) */
  thickness?: number;
  
  /** Metadata for the stroke */
  metadata?: any;
  
  /** When the stroke was created */
  createdAt?: string;
  
  /** When the stroke was last updated */
  updatedAt?: string;
  
  /** Floor plan ID this stroke belongs to */
  floorPlanId?: string;
  
  /** Additional data for the stroke */
  data?: any;
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
  
  /** Room IDs connected to this wall */
  roomIds: string[];
  
  /** Length of the wall (calculated property) */
  length: number;
  
  /** Wall height (optional) */
  height?: number;
  
  /** Floor plan ID this wall belongs to */
  floorPlanId?: string;
  
  /** Points array for compatibility */
  points?: Point[];
  
  /** When the wall was created */
  createdAt?: string;
  
  /** When the wall was last updated */
  updatedAt?: string;
  
  /** Wall metadata */
  metadata?: any;
  
  /** Wall angle in degrees */
  angle?: number;
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
  
  /** Room area in square meters */
  area: number;
  
  /** Room color */
  color: string;
  
  /** Room boundary points */
  vertices: Point[];
  
  /** Room perimeter */
  perimeter?: number;
  
  /** Room center point */
  center?: Point;
  
  /** Room label position */
  labelPosition?: Point;
  
  /** Floor level this room belongs to */
  level?: number;
  
  /** Wall IDs associated with this room */
  walls?: string[];
  
  /** Room points (alias for vertices) */
  points?: Point[];
  
  /** Floor plan ID this room belongs to */
  floorPlanId?: string;
  
  /** When the room was created */
  createdAt?: string;
  
  /** When the room was last updated */
  updatedAt?: string;
  
  /** Room metadata */
  metadata?: any;
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
  paperSize?: string | PaperSize;
  
  /** Floor level (0 = ground floor) */
  level?: number;
  
  /** Version of the floor plan */
  version?: string;
  
  /** Author of the floor plan */
  author?: string;
  
  /** Notes about the floor plan */
  notes?: string;
  
  /** Creation date formatted (for backward compatibility) */
  dateCreated?: string;
  
  /** Last modified date formatted (for backward compatibility) */
  lastModified?: string;
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
  
  /** Additional data for the floor plan */
  data: any;
  
  /** User ID who owns the floor plan */
  userId: string;
  
  /** Property ID (for backward compatibility) */
  propertyId?: string;
  
  /** Serialized canvas data (optional) */
  canvasData?: any;
  
  /** Canvas JSON serialization (optional) */
  canvasJson?: string | null;
}

/**
 * Helper functions to safely convert string values to enum types
 */
export function asStrokeType(type: string): StrokeTypeLiteral {
  const validTypes: StrokeTypeLiteral[] = ['line', 'wall', 'door', 'window', 'furniture', 'annotation', 'polyline', 'room', 'freehand'];
  return validTypes.includes(type as StrokeTypeLiteral) ? (type as StrokeTypeLiteral) : 'line';
}

export function asRoomType(type: string): RoomTypeLiteral {
  const validTypes: RoomTypeLiteral[] = ['living', 'bedroom', 'kitchen', 'bathroom', 'office', 'other'];
  return validTypes.includes(type as RoomTypeLiteral) ? (type as RoomTypeLiteral) : 'other';
}

/**
 * Create empty floor plan with default values
 */
export function createEmptyFloorPlan(partial: Partial<FloorPlan> = {}): FloorPlan {
  const now = new Date().toISOString();
  
  return {
    id: partial.id || uuidv4(),
    name: partial.name || 'Untitled Floor Plan',
    label: partial.label || partial.name || 'Untitled',
    walls: partial.walls || [],
    rooms: partial.rooms || [],
    strokes: partial.strokes || [],
    createdAt: partial.createdAt || now,
    updatedAt: partial.updatedAt || now,
    gia: partial.gia || 0,
    level: partial.level || 0,
    index: partial.index || partial.level || 0,
    metadata: {
      createdAt: partial.metadata?.createdAt || now,
      updatedAt: partial.metadata?.updatedAt || now,
      version: partial.metadata?.version || '1.0',
      author: partial.metadata?.author || 'User',
      notes: partial.metadata?.notes || '',
      paperSize: partial.metadata?.paperSize || PaperSize.A4,
      level: partial.metadata?.level || 0,
      dateCreated: partial.metadata?.dateCreated || now,
      lastModified: partial.metadata?.lastModified || now
    },
    data: partial.data || {},
    userId: partial.userId || ''
  };
}

/**
 * Create empty stroke with default values
 */
export function createEmptyStroke(partial: Partial<Stroke> = {}): Stroke {
  return {
    id: partial.id || uuidv4(),
    points: partial.points || [],
    type: partial.type || 'line',
    color: partial.color || '#000000',
    width: partial.width || 1
  };
}

/**
 * Create empty wall with default values
 */
export function createEmptyWall(partial: Partial<Wall> = {}): Wall {
  const start = partial.start || { x: 0, y: 0 };
  const end = partial.end || { x: 100, y: 0 };
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const length = Math.sqrt(dx * dx + dy * dy);
  
  return {
    id: partial.id || uuidv4(),
    start,
    end,
    thickness: partial.thickness || 5,
    color: partial.color || '#000000',
    roomIds: partial.roomIds || [],
    length: partial.length || length
  };
}

/**
 * Create empty room with default values
 */
export function createEmptyRoom(partial: Partial<Room> = {}): Room {
  return {
    id: partial.id || uuidv4(),
    name: partial.name || 'Unnamed Room',
    type: partial.type || 'other',
    area: partial.area || 0,
    vertices: partial.vertices || [],
    color: partial.color || '#f0f0f0'
  };
}

// For testing
export function createTestPoint(): Point {
  return { x: 100, y: 100 };
}

export function createTestFloorPlan(): FloorPlan {
  return createEmptyFloorPlan({ id: 'test-floorplan' });
}

export function createTestStroke(): Stroke {
  return createEmptyStroke({ id: 'test-stroke' });
}

export function createTestWall(): Wall {
  return createEmptyWall({ id: 'test-wall' });
}

export function createTestRoom(): Room {
  return createEmptyRoom({ id: 'test-room' });
}
