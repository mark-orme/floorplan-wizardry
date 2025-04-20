
/**
 * Unified type definitions for floor plans
 * Provides a central point for all floor plan related types
 * @module types/floor-plan/unifiedTypes
 */
import { v4 as uuidv4 } from 'uuid';

/**
 * Point interface for 2D coordinates
 */
export interface Point {
  x: number;
  y: number;
}

/**
 * StrokeTypeLiteral type defines valid stroke types
 */
export type StrokeTypeLiteral = 'wall' | 'line' | 'freehand' | 'straight' | 'measurement';

/**
 * RoomTypeLiteral type defines valid room types
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
  CUSTOM = 'Custom'
}

/**
 * Floor plan metadata interface with all required properties
 */
export interface FloorPlanMetadata {
  // Required properties that were missing
  createdAt: string;
  updatedAt: string;
  paperSize: PaperSize | string;
  level: number;
  version: string;
  author: string;
  dateCreated: string;
  lastModified: string;
  notes: string;
}

/**
 * Wall interface with all required properties
 */
export interface Wall {
  id: string;
  start: Point;
  end: Point;
  thickness: number;
  color: string;
  length: number;
  roomIds: string[];
  // Optional properties
  height?: number;
  points?: Point[];
}

/**
 * Room interface with all required properties
 */
export interface Room {
  id: string;
  name: string;
  type: RoomTypeLiteral;
  points: Point[];
  color: string;
  area?: number;
  perimeter?: number;
  center?: Point;
  labelPosition?: Point;
}

/**
 * Stroke interface for annotations and drawings
 */
export interface Stroke {
  id: string;
  points: Point[];
  type: StrokeTypeLiteral;
  color: string;
  thickness: number;
  width?: number; // Alias for thickness for compatibility
}

/**
 * FloorPlan interface with all required properties
 */
export interface FloorPlan {
  id: string;
  name: string;
  label: string;
  walls: Wall[];
  rooms: Room[];
  strokes: Stroke[];
  canvasData: string | null;
  canvasJson: string | null;
  createdAt: string;
  updatedAt: string;
  gia: number;
  level: number;
  index: number;
  metadata: FloorPlanMetadata;
  // Required properties that were missing in some implementations
  data: any;
  userId: string;
}

/**
 * Type assertion function for stroke types
 * Ensures type safety for stroke types
 */
export function asStrokeType(type: string): StrokeTypeLiteral {
  const validTypes: StrokeTypeLiteral[] = ['wall', 'line', 'freehand', 'straight', 'measurement'];
  
  if (validTypes.includes(type as StrokeTypeLiteral)) {
    return type as StrokeTypeLiteral;
  }
  
  console.warn(`Invalid stroke type: ${type}, defaulting to 'line'`);
  return 'line';
}

/**
 * Type assertion function for room types
 * Ensures type safety for room types
 */
export function asRoomType(type: string): RoomTypeLiteral {
  const validTypes: RoomTypeLiteral[] = ['living', 'bedroom', 'kitchen', 'bathroom', 'office', 'other'];
  
  if (validTypes.includes(type as RoomTypeLiteral)) {
    return type as RoomTypeLiteral;
  }
  
  console.warn(`Invalid room type: ${type}, defaulting to 'other'`);
  return 'other';
}

/**
 * Create a test point for testing
 */
export function createTestPoint(overrides: Partial<Point> = {}): Point {
  return {
    x: 0,
    y: 0,
    ...overrides
  };
}

/**
 * Create a test stroke for testing
 */
export function createTestStroke(overrides: Partial<Stroke> = {}): Stroke {
  return {
    id: overrides.id || uuidv4(),
    points: overrides.points || [{ x: 0, y: 0 }, { x: 100, y: 100 }],
    type: overrides.type || 'line',
    color: overrides.color || '#000000',
    thickness: overrides.thickness || 2,
    width: overrides.width || overrides.thickness || 2,
    ...overrides
  };
}

/**
 * Create a test wall for testing
 */
export function createTestWall(overrides: Partial<Wall> = {}): Wall {
  return {
    id: overrides.id || uuidv4(),
    start: overrides.start || { x: 0, y: 0 },
    end: overrides.end || { x: 100, y: 0 },
    thickness: overrides.thickness || 5,
    color: overrides.color || '#000000',
    length: overrides.length || 100,
    roomIds: overrides.roomIds || [],
    height: overrides.height,
    points: overrides.points,
    ...overrides
  };
}

/**
 * Create a test room for testing
 */
export function createTestRoom(overrides: Partial<Room> = {}): Room {
  return {
    id: overrides.id || uuidv4(),
    name: overrides.name || 'Test Room',
    type: overrides.type || 'other',
    points: overrides.points || [
      { x: 0, y: 0 },
      { x: 100, y: 0 },
      { x: 100, y: 100 },
      { x: 0, y: 100 }
    ],
    color: overrides.color || '#ffffff',
    area: overrides.area || 10000,
    perimeter: overrides.perimeter || 400,
    center: overrides.center || { x: 50, y: 50 },
    labelPosition: overrides.labelPosition || { x: 50, y: 50 },
    ...overrides
  };
}

/**
 * Create a test floor plan for testing
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
    data: overrides.data || {},
    userId: overrides.userId || 'test-user',
    metadata: overrides.metadata || {
      createdAt: now,
      updatedAt: now,
      paperSize: PaperSize.A4,
      level: 0,
      version: "1.0",
      author: "Test User",
      dateCreated: now,
      lastModified: now,
      notes: ""
    },
    ...overrides
  };
}

/**
 * Create an empty floor plan
 */
export function createEmptyFloorPlan(overrides: Partial<FloorPlan> = {}): FloorPlan {
  return createTestFloorPlan(overrides);
}

/**
 * Create an empty stroke
 */
export function createEmptyStroke(overrides: Partial<Stroke> = {}): Stroke {
  return createTestStroke(overrides);
}

/**
 * Create an empty wall
 */
export function createEmptyWall(overrides: Partial<Wall> = {}): Wall {
  return createTestWall(overrides);
}

/**
 * Create an empty room
 */
export function createEmptyRoom(overrides: Partial<Room> = {}): Room {
  return createTestRoom(overrides);
}
