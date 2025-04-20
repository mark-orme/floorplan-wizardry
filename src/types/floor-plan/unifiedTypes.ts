
/**
 * Unified Floor Plan Types
 * Provides a single source of truth for all floor plan related types
 * @module types/floor-plan/unifiedTypes
 */
import { v4 as uuidv4 } from 'uuid';

/**
 * 2D Point coordinates
 */
export interface Point {
  x: number;
  y: number;
}

/**
 * Paper size enum
 */
export enum PaperSize {
  A4 = 'A4',
  A3 = 'A3',
  A2 = 'A2',
  A1 = 'A1',
  LETTER = 'LETTER',
  LEGAL = 'LEGAL',
  TABLOID = 'TABLOID'
}

/**
 * Stroke type literals - ensure this matches all uses across the codebase
 */
export type StrokeTypeLiteral = 'freehand' | 'line' | 'wall' | 'room';

/**
 * Room type literals - ensure this matches all uses across the codebase
 */
export type RoomTypeLiteral = 'living' | 'bedroom' | 'kitchen' | 'bathroom' | 'office' | 'other';

/**
 * Convert a string to a valid StrokeTypeLiteral
 * @param type A string to convert
 * @returns A valid StrokeTypeLiteral
 */
export function asStrokeType(type?: string | null): StrokeTypeLiteral {
  if (!type) return 'line';
  
  switch (type.toLowerCase()) {
    case 'freehand': return 'freehand';
    case 'wall': return 'wall';
    case 'room': return 'room';
    case 'line': return 'line';
    default: return 'line';
  }
}

/**
 * Convert a string to a valid RoomTypeLiteral
 * @param type A string to convert
 * @returns A valid RoomTypeLiteral
 */
export function asRoomType(type?: string | null): RoomTypeLiteral {
  if (!type) return 'other';
  
  switch (type.toLowerCase()) {
    case 'living': return 'living';
    case 'bedroom': return 'bedroom';
    case 'kitchen': return 'kitchen';
    case 'bathroom': return 'bathroom';
    case 'office': return 'office';
    default: return 'other';
  }
}

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
  
  /** Stroke thickness */
  thickness: number;
  
  /** Stroke width (same as thickness for compatibility) */
  width: number;
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
  
  /** Room vertices */
  vertices: Point[];
  
  /** Room area in square meters */
  area: number;
  
  /** Room color */
  color: string;
}

/**
 * Floor plan metadata
 */
export interface FloorPlanMetadata {
  /** API version of the metadata */
  version: string;
  
  /** Author of the floor plan */
  author: string;
  
  /** Original creation date */
  dateCreated: string;
  
  /** Last modification date */
  lastModified: string;
  
  /** Additional notes */
  notes: string;
  
  /** Creation timestamp */
  createdAt: string;
  
  /** Last update timestamp */
  updatedAt: string;
  
  /** Paper size for printing */
  paperSize: PaperSize | string;
  
  /** Floor level (0 = ground floor) */
  level: number;
}

/**
 * Floor plan interface
 */
export interface FloorPlan {
  /** Unique identifier */
  id: string;
  
  /** Floor plan name */
  name: string;
  
  /** Display label */
  label: string;
  
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
}

/**
 * Create an empty stroke
 * @param overrides Properties to override defaults
 * @returns A new stroke
 */
export function createEmptyStroke(overrides: Partial<Stroke> = {}): Stroke {
  return {
    id: overrides.id || uuidv4(),
    points: overrides.points || [],
    type: overrides.type || 'line',
    color: overrides.color || '#000000',
    thickness: overrides.thickness || 2,
    width: overrides.width || 2
  };
}

/**
 * Create an empty wall
 * @param overrides Properties to override defaults
 * @returns A new wall
 */
export function createEmptyWall(overrides: Partial<Wall> = {}): Wall {
  const start = overrides.start || { x: 0, y: 0 };
  const end = overrides.end || { x: 100, y: 0 };
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const length = Math.sqrt(dx * dx + dy * dy);
  
  return {
    id: overrides.id || uuidv4(),
    start,
    end,
    thickness: overrides.thickness || 5,
    color: overrides.color || '#333333',
    roomIds: overrides.roomIds || [],
    length: overrides.length || length,
    height: overrides.height
  };
}

/**
 * Create an empty room
 * @param overrides Properties to override defaults
 * @returns A new room
 */
export function createEmptyRoom(overrides: Partial<Room> = {}): Room {
  return {
    id: overrides.id || uuidv4(),
    name: overrides.name || 'Unnamed Room',
    type: overrides.type || 'other',
    vertices: overrides.vertices || [],
    area: overrides.area || 0,
    color: overrides.color || '#f5f5f5'
  };
}

/**
 * Create an empty floor plan
 * @param overrides Properties to override defaults
 * @returns A new floor plan
 */
export function createEmptyFloorPlan(overrides: Partial<FloorPlan> = {}): FloorPlan {
  const now = new Date().toISOString();
  return {
    id: overrides.id || uuidv4(),
    name: overrides.name || 'Untitled Floor Plan',
    label: overrides.label || 'Untitled Floor Plan',
    walls: overrides.walls || [],
    rooms: overrides.rooms || [],
    strokes: overrides.strokes || [],
    canvasData: overrides.canvasData || null,
    canvasJson: overrides.canvasJson || null,
    createdAt: overrides.createdAt || now,
    updatedAt: overrides.updatedAt || now,
    gia: overrides.gia || 0,
    level: overrides.level || 0,
    index: overrides.index || 0,
    metadata: overrides.metadata || {
      version: '1.0',
      author: '',
      dateCreated: now,
      lastModified: now,
      notes: '',
      createdAt: now,
      updatedAt: now,
      paperSize: PaperSize.A4,
      level: 0
    },
    data: overrides.data || {},
    userId: overrides.userId || ''
  };
}

/**
 * Create a test point
 * @param overrides Properties to override defaults
 * @returns A test point
 */
export function createTestPoint(overrides: Partial<Point> = {}): Point {
  return {
    x: overrides.x ?? 100,
    y: overrides.y ?? 100
  };
}

/**
 * Create a test stroke
 * @param overrides Properties to override defaults
 * @returns A test stroke
 */
export function createTestStroke(overrides: Partial<Stroke> = {}): Stroke {
  return {
    id: overrides.id || uuidv4(),
    points: overrides.points || [
      createTestPoint(),
      createTestPoint({ x: 200 })
    ],
    type: overrides.type || 'line',
    color: overrides.color || '#000000',
    thickness: overrides.thickness || 2,
    width: overrides.width || 2
  };
}

/**
 * Create a test wall
 * @param overrides Properties to override defaults
 * @returns A test wall
 */
export function createTestWall(overrides: Partial<Wall> = {}): Wall {
  const start = overrides.start || createTestPoint();
  const end = overrides.end || createTestPoint({ x: 200 });
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const length = Math.sqrt(dx * dx + dy * dy);
  
  return {
    id: overrides.id || uuidv4(),
    start,
    end,
    thickness: overrides.thickness || 5,
    color: overrides.color || '#333333',
    roomIds: overrides.roomIds || [],
    length: overrides.length || length,
    height: overrides.height
  };
}

/**
 * Create a test room
 * @param overrides Properties to override defaults
 * @returns A test room
 */
export function createTestRoom(overrides: Partial<Room> = {}): Room {
  return {
    id: overrides.id || uuidv4(),
    name: overrides.name || 'Test Room',
    type: overrides.type || 'living',
    vertices: overrides.vertices || [
      createTestPoint(),
      createTestPoint({ x: 200 }),
      createTestPoint({ x: 200, y: 200 }),
      createTestPoint({ y: 200 })
    ],
    area: overrides.area || 10000,
    color: overrides.color || '#f5f5f5'
  };
}

/**
 * Create a test floor plan
 * @param overrides Properties to override defaults
 * @returns A test floor plan
 */
export function createTestFloorPlan(overrides: Partial<FloorPlan> = {}): FloorPlan {
  const now = new Date().toISOString();
  
  return {
    id: overrides.id || uuidv4(),
    name: overrides.name || 'Test Floor Plan',
    label: overrides.label || 'Test Floor Plan',
    walls: overrides.walls || [],
    rooms: overrides.rooms || [],
    strokes: overrides.strokes || [],
    canvasData: overrides.canvasData || null,
    canvasJson: overrides.canvasJson || null,
    createdAt: overrides.createdAt || now,
    updatedAt: overrides.updatedAt || now,
    gia: overrides.gia || 0,
    level: overrides.level || 0,
    index: overrides.index || 0,
    metadata: overrides.metadata || {
      version: '1.0',
      author: 'Test User',
      dateCreated: now,
      lastModified: now,
      notes: '',
      createdAt: now,
      updatedAt: now,
      paperSize: 'A4',
      level: 0
    },
    data: overrides.data || {},
    userId: overrides.userId || 'test-user'
  };
}
