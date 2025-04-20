
/**
 * Unified Floor Plan Types
 * Single source of truth for floor plan type definitions
 * @module types/floor-plan/unifiedTypes
 */
import { v4 as uuidv4 } from 'uuid';

/**
 * Paper size enum
 */
export enum PaperSize {
  A4 = 'A4',
  A3 = 'A3',
  A2 = 'A2',
  LETTER = 'LETTER',
  LEGAL = 'LEGAL'
}

/**
 * Point interface
 */
export interface Point {
  /** X coordinate */
  x: number;
  
  /** Y coordinate */
  y: number;
}

/**
 * Valid stroke types
 */
export type StrokeTypeLiteral = 'line' | 'wall' | 'door' | 'window' | 'furniture' | 'annotation';

/**
 * Stroke interface
 */
export interface Stroke {
  /** Unique identifier */
  id: string;
  
  /** Points array */
  points: Point[];
  
  /** Stroke type */
  type: StrokeTypeLiteral;
  
  /** Stroke color */
  color: string;
  
  /** Stroke thickness */
  thickness: number;
  
  /** Width (same as thickness for compatibility) */
  width: number;
}

/**
 * Wall interface
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
  
  /** Wall length (calculated) */
  length: number;
  
  /** Wall color */
  color: string;
  
  /** Room IDs connected to this wall */
  roomIds: string[];
  
  /** Wall height (optional) */
  height?: number;
}

/**
 * Valid room types
 */
export type RoomTypeLiteral = 'living' | 'bedroom' | 'kitchen' | 'bathroom' | 'office' | 'other';

/**
 * Room interface
 */
export interface Room {
  /** Unique identifier */
  id: string;
  
  /** Room name */
  name: string;
  
  /** Room type */
  type: RoomTypeLiteral;
  
  /** Room area */
  area: number;
  
  /** Room boundary vertices */
  vertices: Point[];
  
  /** Room perimeter */
  perimeter: number;
  
  /** Label position */
  labelPosition: Point;
  
  /** Room center */
  center: Point;
  
  /** Room color */
  color: string;
}

/**
 * Floor plan metadata
 */
export interface FloorPlanMetadata {
  /** Creation date */
  createdAt: string;
  
  /** Last update date */
  updatedAt: string;
  
  /** Paper size */
  paperSize: PaperSize | string;
  
  /** Floor level */
  level: number;
  
  /** Version */
  version: string;
  
  /** Author */
  author: string;
  
  /** Creation date (legacy) */
  dateCreated: string;
  
  /** Last modification date (legacy) */
  lastModified: string;
  
  /** Notes */
  notes: string;
}

/**
 * Floor plan interface
 */
export interface FloorPlan {
  /** Unique identifier */
  id: string;
  
  /** Floor plan name */
  name: string;
  
  /** Display label (optional) */
  label?: string;
  
  /** Walls array */
  walls: Wall[];
  
  /** Rooms array */
  rooms: Room[];
  
  /** Strokes array */
  strokes: Stroke[];
  
  /** Canvas data serialization */
  canvasData: string | null;
  
  /** Canvas JSON serialization */
  canvasJson: string | null;
  
  /** Canvas state (for canvas controller loader) */
  canvasState?: string | null;
  
  /** Creation date */
  createdAt: string;
  
  /** Last update date */
  updatedAt: string;
  
  /** Gross internal area */
  gia: number;
  
  /** Floor level */
  level: number;
  
  /** Floor index (for compatibility) */
  index: number;
  
  /** Floor plan metadata */
  metadata: FloorPlanMetadata;
  
  /** Additional data (required) */
  data: any;
  
  /** User ID (required) */
  userId: string;
}

/**
 * Create an empty point
 * @param x X coordinate
 * @param y Y coordinate
 * @returns Empty point
 */
export function createEmptyPoint(x: number = 0, y: number = 0): Point {
  return { x, y };
}

/**
 * Create an empty stroke
 * @param overrides Properties to override
 * @returns Empty stroke
 */
export function createEmptyStroke(overrides: Partial<Stroke> = {}): Stroke {
  return {
    id: overrides.id || uuidv4(),
    points: overrides.points || [
      createEmptyPoint(0, 0),
      createEmptyPoint(100, 100)
    ],
    type: overrides.type || 'line',
    color: overrides.color || '#000000',
    thickness: overrides.thickness || 2,
    width: overrides.width || overrides.thickness || 2
  };
}

/**
 * Create an empty wall
 * @param overrides Properties to override
 * @returns Empty wall
 */
export function createEmptyWall(overrides: Partial<Wall> = {}): Wall {
  const start = overrides.start || createEmptyPoint(0, 0);
  const end = overrides.end || createEmptyPoint(100, 0);
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const length = overrides.length || Math.sqrt(dx * dx + dy * dy);
  
  return {
    id: overrides.id || uuidv4(),
    start,
    end,
    thickness: overrides.thickness || 10,
    length,
    color: overrides.color || '#000000',
    roomIds: overrides.roomIds || [],
    height: overrides.height
  };
}

/**
 * Create an empty room
 * @param overrides Properties to override
 * @returns Empty room
 */
export function createEmptyRoom(overrides: Partial<Room> = {}): Room {
  const vertices = overrides.vertices || [
    createEmptyPoint(0, 0),
    createEmptyPoint(100, 0),
    createEmptyPoint(100, 100),
    createEmptyPoint(0, 100)
  ];
  
  // Calculate perimeter
  let perimeter = 0;
  for (let i = 0; i < vertices.length; i++) {
    const p1 = vertices[i];
    const p2 = vertices[(i + 1) % vertices.length];
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    perimeter += Math.sqrt(dx * dx + dy * dy);
  }
  
  // Calculate center
  const center = overrides.center || {
    x: vertices.reduce((sum, v) => sum + v.x, 0) / vertices.length,
    y: vertices.reduce((sum, v) => sum + v.y, 0) / vertices.length
  };
  
  return {
    id: overrides.id || uuidv4(),
    name: overrides.name || 'Unnamed Room',
    type: overrides.type || 'other',
    area: overrides.area || 10000,
    vertices,
    perimeter: overrides.perimeter || perimeter,
    labelPosition: overrides.labelPosition || center,
    center: center,
    color: overrides.color || '#f5f5f5'
  };
}

/**
 * Create an empty floor plan
 * @param overrides Properties to override
 * @returns Empty floor plan
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
    canvasState: overrides.canvasState || null,
    createdAt: overrides.createdAt || now,
    updatedAt: overrides.updatedAt || now,
    gia: overrides.gia || 0,
    level: overrides.level || 0,
    index: overrides.index || 0,
    metadata: overrides.metadata || {
      createdAt: now,
      updatedAt: now,
      paperSize: PaperSize.A4,
      level: overrides.level || 0,
      version: '1.0',
      author: '',
      dateCreated: now,
      lastModified: now,
      notes: ''
    },
    data: overrides.data || {},
    userId: overrides.userId || 'default-user'
  };
}

/**
 * Create a test point (for testing)
 * @param overrides Properties to override
 * @returns Test point
 */
export function createTestPoint(x: number = 0, y: number = 0): Point {
  return { x, y };
}

/**
 * Create a test stroke (for testing)
 * @param overrides Properties to override
 * @returns Test stroke
 */
export function createTestStroke(overrides: Partial<Stroke> = {}): Stroke {
  return createEmptyStroke(overrides);
}

/**
 * Create a test wall (for testing)
 * @param overrides Properties to override
 * @returns Test wall
 */
export function createTestWall(overrides: Partial<Wall> = {}): Wall {
  return createEmptyWall(overrides);
}

/**
 * Create a test room (for testing)
 * @param overrides Properties to override
 * @returns Test room
 */
export function createTestRoom(overrides: Partial<Room> = {}): Room {
  return createEmptyRoom(overrides);
}

/**
 * Create a test floor plan (for testing)
 * @param overrides Properties to override
 * @returns Test floor plan
 */
export function createTestFloorPlan(overrides: Partial<FloorPlan> = {}): FloorPlan {
  return createEmptyFloorPlan(overrides);
}
