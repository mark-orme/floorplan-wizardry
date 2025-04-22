
/**
 * Basic types for floor plan data structure
 */
export interface FloorPlan {
  id?: string;
  propertyId: string;
  name?: string;
  label?: string;
  walls?: any[];
  rooms?: any[];
  strokes?: any[];
  data: any;
  version?: string;
  createdAt?: string;
  updatedAt?: string;
  level?: number;
  index?: number;
  gia?: number;
  canvasData?: any;
  canvasJson?: string | null;
  metadata?: FloorPlanMetadata;
  userId?: string;
}

/**
 * Coordinate point interface
 */
export interface Point {
  x: number;
  y: number;
}

/**
 * FloorPlanMetadata interface
 */
export interface FloorPlanMetadata {
  version: string;
  author: string;
  dateCreated: string;
  lastModified: string;
  notes: string;
  paperSize?: string;
  level?: number;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Wall interface
 */
export interface Wall {
  id: string;
  floorPlanId: string;
  start: Point;
  end: Point;
  thickness: number;
  length: number;
  angle: number;
  createdAt?: string;
  updatedAt?: string;
  metadata?: any;
  roomIds?: string[];
  color?: string;
  height?: number;
}

/**
 * Room interface
 */
export interface Room {
  id: string;
  name: string;
  type: RoomTypeLiteral;
  floorPlanId: string;
  area: number;
  perimeter: number;
  center: Point;
  vertices: Point[];
  labelPosition: Point;
  createdAt?: string;
  updatedAt?: string;
  metadata?: any;
  color?: string;
}

/**
 * Stroke interface
 */
export interface Stroke {
  id: string;
  floorPlanId: string;
  points: Point[];
  type: StrokeTypeLiteral;
  color: string;
  thickness: number;
  createdAt?: string;
  updatedAt?: string;
  metadata?: any;
}

/**
 * Room type literals
 */
export type RoomTypeLiteral = 'living' | 'bedroom' | 'kitchen' | 'bathroom' | 'office' | 'other';

/**
 * Stroke type literals
 */
export type StrokeTypeLiteral = 'line' | 'wall' | 'door' | 'window' | 'furniture' | 'annotation' | 'polyline' | 'room' | 'freehand';

/**
 * Stroke type enum
 */
export enum StrokeType {
  LINE = 'line',
  WALL = 'wall',
  DOOR = 'door',
  WINDOW = 'window',
  FURNITURE = 'furniture',
  ANNOTATION = 'annotation',
  POLYLINE = 'polyline',
  ROOM = 'room',
  FREEHAND = 'freehand'
}

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
 * Drawing mode enum - adding the missing enum referenced in errors
 */
export enum DrawingMode {
  SELECT = 'select',
  DRAW = 'draw',
  ERASE = 'erase',
  WALL = 'wall',
  DOOR = 'door',
  WINDOW = 'window',
  ROOM = 'room',
  TEXT = 'text',
  MEASURE = 'measure'
}

/**
 * Helper functions to safely convert string values to enum types
 */
export function asStrokeType(type: string): StrokeTypeLiteral {
  return (['line', 'wall', 'door', 'window', 'furniture', 'annotation', 'polyline', 'room', 'freehand'] as StrokeTypeLiteral[])
    .includes(type as StrokeTypeLiteral) ? (type as StrokeTypeLiteral) : 'line';
}

export function asRoomType(type: string): RoomTypeLiteral {
  return (['living', 'bedroom', 'kitchen', 'bathroom', 'office', 'other'] as RoomTypeLiteral[])
    .includes(type as RoomTypeLiteral) ? (type as RoomTypeLiteral) : 'other';
}

/**
 * Create empty floor plan with default values
 */
export function createEmptyFloorPlan(propertyId: string): FloorPlan {
  const now = new Date().toISOString();
  return {
    propertyId,
    name: 'Untitled Floor Plan',
    label: 'Untitled',
    walls: [],
    rooms: [],
    strokes: [],
    data: {},
    createdAt: now,
    updatedAt: now,
    level: 0,
    index: 0,
    gia: 0,
    metadata: {
      version: '1.0',
      author: 'User',
      dateCreated: now,
      lastModified: now,
      notes: '',
      paperSize: PaperSize.A4,
      level: 0
    },
    userId: 'default-user'
  };
}

/**
 * Create empty stroke with default values
 */
export function createEmptyStroke(): Stroke {
  return {
    id: `stroke-${Date.now()}`,
    floorPlanId: '',
    points: [],
    type: 'line',
    color: '#000000',
    thickness: 1
  };
}

/**
 * Create empty wall with default values
 */
export function createEmptyWall(): Wall {
  return {
    id: `wall-${Date.now()}`,
    floorPlanId: '',
    start: { x: 0, y: 0 },
    end: { x: 100, y: 0 },
    thickness: 5,
    length: 100,
    angle: 0
  };
}

/**
 * Create empty room with default values
 */
export function createEmptyRoom(): Room {
  return {
    id: `room-${Date.now()}`,
    name: 'Unnamed Room',
    type: 'other',
    floorPlanId: '',
    area: 0,
    perimeter: 0,
    center: { x: 0, y: 0 },
    vertices: [],
    labelPosition: { x: 0, y: 0 }
  };
}

// For testing
export function createTestPoint(): Point {
  return { x: 100, y: 100 };
}

export function createTestFloorPlan(): FloorPlan {
  return createEmptyFloorPlan('test-property-id');
}

export function createTestStroke(): Stroke {
  return createEmptyStroke();
}

export function createTestWall(): Wall {
  return createEmptyWall();
}

export function createTestRoom(): Room {
  return createEmptyRoom();
}
