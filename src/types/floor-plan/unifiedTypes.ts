
/**
 * Unified Floor Plan Types
 * Single source of truth for all floor plan related types
 * @module types/floor-plan/unifiedTypes
 */
import { v4 as uuidv4 } from 'uuid';

/**
 * Point interface
 */
export interface Point {
  x: number;
  y: number;
}

/**
 * StrokeType literal union type
 */
export type StrokeTypeLiteral = 'freehand' | 'straight' | 'wall' | 'room' | 'line';

/**
 * RoomType literal union type
 */
export type RoomTypeLiteral = 'living' | 'bedroom' | 'kitchen' | 'bathroom' | 'office' | 'other';

/**
 * Paper size enum
 */
export enum PaperSize {
  A4 = 'A4',
  A3 = 'A3',
  LETTER = 'Letter',
  LEGAL = 'Legal',
  TABLOID = 'Tabloid'
}

/**
 * Stroke interface
 */
export interface Stroke {
  id: string;
  points: Point[];
  type: StrokeTypeLiteral;
  color: string;
  thickness: number;
  width?: number; // Legacy support
}

/**
 * Wall interface
 */
export interface Wall {
  id: string;
  start: Point;
  end: Point;
  thickness: number;
  color: string;
  height?: number;
  roomIds: string[];
  length: number;
  points?: Point[]; // For compatibility
}

/**
 * Room interface
 */
export interface Room {
  id: string;
  name: string;
  type: RoomTypeLiteral;
  vertices: Point[];
  area: number;
  color: string;
}

/**
 * Floor plan metadata
 */
export interface FloorPlanMetadata {
  version: string;
  author: string;
  dateCreated: string;
  lastModified: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
  paperSize: string | PaperSize;
  level: number;
}

/**
 * Floor plan interface
 */
export interface FloorPlan {
  id: string;
  name: string;
  label: string;
  walls: Wall[];
  rooms: Room[];
  strokes: Stroke[];
  canvasData: any;
  canvasJson: string | null;
  createdAt: string;
  updatedAt: string;
  gia: number;
  level: number;
  index: number;
  metadata: FloorPlanMetadata;
  data: any; // Required for API compatibility
  userId: string; // Required for API compatibility
}

/**
 * Type guard for StrokeType literal
 * @param type Type to validate
 * @returns Valid stroke type or 'freehand' as fallback
 */
export function asStrokeType(type: any): StrokeTypeLiteral {
  const validTypes: StrokeTypeLiteral[] = ['freehand', 'straight', 'wall', 'room', 'line'];
  
  if (typeof type === 'string' && validTypes.includes(type as StrokeTypeLiteral)) {
    return type as StrokeTypeLiteral;
  }
  
  console.warn(`Invalid stroke type: ${type}, using 'freehand' instead`);
  return 'freehand';
}

/**
 * Type guard for RoomType literal
 * @param type Type to validate
 * @returns Valid room type or 'other' as fallback
 */
export function asRoomType(type: any): RoomTypeLiteral {
  const validTypes: RoomTypeLiteral[] = ['living', 'bedroom', 'kitchen', 'bathroom', 'office', 'other'];
  
  if (typeof type === 'string' && validTypes.includes(type as RoomTypeLiteral)) {
    return type as RoomTypeLiteral;
  }
  
  console.warn(`Invalid room type: ${type}, using 'other' instead`);
  return 'other';
}

/**
 * Create an empty stroke
 * @param overrides Values to override defaults
 * @returns Empty stroke object
 */
export function createEmptyStroke(overrides: Partial<Stroke> = {}): Stroke {
  return {
    id: uuidv4(),
    points: [],
    type: 'freehand',
    color: '#000000',
    thickness: 2,
    ...overrides
  };
}

/**
 * Create an empty wall
 * @param overrides Values to override defaults
 * @returns Empty wall object
 */
export function createEmptyWall(overrides: Partial<Wall> = {}): Wall {
  const start = { x: 0, y: 0 };
  const end = { x: 100, y: 0 };
  
  return {
    id: uuidv4(),
    start,
    end,
    thickness: 5,
    color: '#000000',
    roomIds: [],
    length: 100,
    ...overrides
  };
}

/**
 * Create an empty room
 * @param overrides Values to override defaults
 * @returns Empty room object
 */
export function createEmptyRoom(overrides: Partial<Room> = {}): Room {
  return {
    id: uuidv4(),
    name: 'Untitled Room',
    type: 'other',
    vertices: [],
    area: 0,
    color: '#f5f5f5',
    ...overrides
  };
}

/**
 * Create empty floor plan
 * @param overrides Values to override defaults
 * @returns Empty floor plan object
 */
export function createEmptyFloorPlan(overrides: Partial<FloorPlan> = {}): FloorPlan {
  const now = new Date().toISOString();
  
  return {
    id: uuidv4(),
    name: 'Untitled Floor Plan',
    label: 'Untitled Floor Plan',
    walls: [],
    rooms: [],
    strokes: [],
    canvasData: null,
    canvasJson: null,
    createdAt: now,
    updatedAt: now,
    gia: 0,
    level: 0,
    index: 0,
    metadata: {
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
    data: {},
    userId: ''
  };
}

/**
 * Create test point
 * @param overrides Values to override defaults
 * @returns Test point object
 */
export function createTestPoint(overrides: Partial<Point> = {}): Point {
  return {
    x: 100,
    y: 100,
    ...overrides
  };
}

/**
 * Create test stroke
 * @param overrides Values to override defaults
 * @returns Test stroke object
 */
export function createTestStroke(overrides: Partial<Stroke> = {}): Stroke {
  return {
    id: uuidv4(),
    points: [{ x: 0, y: 0 }, { x: 100, y: 100 }],
    type: 'freehand',
    color: '#000000',
    thickness: 2,
    ...overrides
  };
}

/**
 * Create test wall
 * @param overrides Values to override defaults
 * @returns Test wall object
 */
export function createTestWall(overrides: Partial<Wall> = {}): Wall {
  const start = { x: 0, y: 0 };
  const end = { x: 100, y: 0 };
  
  return {
    id: uuidv4(),
    start,
    end,
    thickness: 5,
    color: '#333333',
    roomIds: [],
    length: 100,
    ...overrides
  };
}

/**
 * Create test room
 * @param overrides Values to override defaults
 * @returns Test room object
 */
export function createTestRoom(overrides: Partial<Room> = {}): Room {
  return {
    id: uuidv4(),
    name: 'Test Room',
    type: 'living',
    vertices: [
      { x: 0, y: 0 },
      { x: 100, y: 0 },
      { x: 100, y: 100 },
      { x: 0, y: 100 }
    ],
    area: 10000,
    color: '#f5f5f5',
    ...overrides
  };
}

/**
 * Create test floor plan
 * @param overrides Values to override defaults
 * @returns Test floor plan object
 */
export function createTestFloorPlan(overrides: Partial<FloorPlan> = {}): FloorPlan {
  const now = new Date().toISOString();
  
  return {
    id: uuidv4(),
    name: 'Test Floor Plan',
    label: 'Test Floor Plan',
    walls: [],
    rooms: [],
    strokes: [],
    canvasData: null,
    canvasJson: null,
    createdAt: now,
    updatedAt: now,
    gia: 0,
    level: 0,
    index: 0,
    metadata: {
      version: '1.0',
      author: 'Test User',
      dateCreated: now,
      lastModified: now,
      notes: '',
      createdAt: now,
      updatedAt: now,
      paperSize: PaperSize.A4,
      level: 0
    },
    data: {},
    userId: 'test-user'
  };
}
