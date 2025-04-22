
/**
 * Unified Floor Plan Types
 * Standardized interfaces for floor plan data structure
 * @module types/floor-plan/unifiedTypes
 */

/**
 * Point interface
 */
export interface Point {
  x: number;
  y: number;
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
 * Wall interface
 */
export interface Wall {
  id: string;
  start: Point;
  end: Point;
  thickness: number;
  length: number;
  angle: number;
  createdAt?: string;
  updatedAt?: string;
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
  area: number;
  perimeter: number;
  center: Point;
  vertices: Point[];
  labelPosition: Point;
  createdAt?: string;
  updatedAt?: string;
  color?: string;
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
  createdAt?: string;
  updatedAt?: string;
}

/**
 * FloorPlanMetadata interface
 */
export interface FloorPlanMetadata {
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
 * FloorPlan interface
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
  
  /** Canvas JSON serialization (required) */
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
  
  /** Additional data for the floor plan (required) */
  data: any;
  
  /** User ID who owns the floor plan (required) */
  userId: string;
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
export function createEmptyFloorPlan(userId: string): FloorPlan {
  const now = new Date().toISOString();
  return {
    id: `floor-${Date.now()}`,
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
    canvasData: null,
    canvasJson: null,
    metadata: {
      version: '1.0',
      author: 'User',
      dateCreated: now,
      lastModified: now,
      notes: '',
      paperSize: PaperSize.A4,
      createdAt: now,
      updatedAt: now,
      level: 0
    },
    userId
  };
}

/**
 * Create empty stroke with default values
 */
export function createEmptyStroke(): Stroke {
  return {
    id: `stroke-${Date.now()}`,
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
    area: 0,
    perimeter: 0,
    center: { x: 0, y: 0 },
    vertices: [],
    labelPosition: { x: 0, y: 0 }
  };
}

/**
 * For testing
 */
export function createTestPoint(): Point {
  return { x: 100, y: 100 };
}

export function createTestFloorPlan(): FloorPlan {
  return createEmptyFloorPlan('test-user-id');
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
