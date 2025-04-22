// Import SimplePoint from our point adapter
import { SimplePoint } from '@/utils/fabric/pointAdapter';

// Re-export SimplePoint as Point for compatibility
export type Point = SimplePoint;

/**
 * Unified Floor Plan Types
 * Defines the core data structures for floor plans
 * @module types/floor-plan/unifiedTypes
 */

/**
 * Stroke type literal
 */
export type StrokeTypeLiteral =
  | 'line'
  | 'arrow'
  | 'freeform'
  | 'curve'
  | 'polyline'
  | 'rectangle'
  | 'circle'
  | 'ellipse'
  | 'text'
  | 'image'
  | 'icon'
  | 'drawing';

/**
 * Room type literal
 */
export type RoomTypeLiteral =
  | 'livingRoom'
  | 'bedroom'
  | 'kitchen'
  | 'bathroom'
  | 'office'
  | 'storage'
  | 'other';

/**
 * Paper size enum
 */
export enum PaperSize {
  A4 = 'A4',
  LETTER = 'LETTER',
  LEGAL = 'LEGAL',
  A3 = 'A3',
  A2 = 'A2',
  A1 = 'A1',
  A0 = 'A0'
}

/**
 * Stroke interface
 */
export interface Stroke {
  id: string;
  points: Point[];
  type: StrokeTypeLiteral;
  color: string;
  width: number;
  createdAt: string;
  updatedAt: string;
  data: any;
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
  createdAt: string;
  updatedAt: string;
  roomIds?: string[];
  data: any;
}

/**
 * Room interface
 */
export interface Room {
  id: string;
  name: string;
  label: string;
  type: RoomTypeLiteral;
  area: number;
  perimeter: number;
  center: Point;
  wallIds: string[];
  createdAt: string;
  updatedAt: string;
  data: any;
}

/**
 * FloorPlanMetadata interface
 */
export interface FloorPlanMetadata {
  createdAt: string;
  updatedAt: string;
  paperSize: PaperSize;
  level: number;
  version: string;
  author: string;
  notes: string;
}

/**
 * FloorPlan interface
 */
export interface FloorPlan {
  id: string;
  name: string;
  label: string;
  walls: Wall[];
  rooms: Room[];
  strokes: Stroke[];
  createdAt: string;
  updatedAt: string;
  gia: number;
  level: number;
  index: number;
  metadata: FloorPlanMetadata;
  data: any;
  userId: string;
  propertyId?: string;
  canvasData?: string | null;
  canvasJson?: string | null;
}

/**
 * Type guard for StrokeTypeLiteral
 * @param value Value to check
 * @returns True if value is a StrokeTypeLiteral
 */
export function asStrokeType(value: string): value is StrokeTypeLiteral {
  return [
    'line',
    'arrow',
    'freeform',
    'curve',
    'polyline',
    'rectangle',
    'circle',
    'ellipse',
    'text',
    'image',
    'icon',
    'drawing'
  ].includes(value);
}

/**
 * Type guard for RoomTypeLiteral
 * @param value Value to check
 * @returns True if value is a RoomTypeLiteral
 */
export function asRoomType(value: string): value is RoomTypeLiteral {
  return [
    'livingRoom',
    'bedroom',
    'kitchen',
    'bathroom',
    'office',
    'storage',
    'other'
  ].includes(value);
}

/**
 * Creates an empty FloorPlan object
 * @returns Empty FloorPlan
 */
export function createEmptyFloorPlan(): FloorPlan {
  const now = new Date().toISOString();
  return {
    id: '',
    name: '',
    label: '',
    walls: [],
    rooms: [],
    strokes: [],
    createdAt: now,
    updatedAt: now,
    gia: 0,
    level: 0,
    index: 0,
    metadata: {
      createdAt: now,
      updatedAt: now,
      paperSize: PaperSize.A4,
      level: 0,
      version: '1.0',
      author: 'User',
      notes: ''
    },
    data: {},
    userId: ''
  };
}

/**
 * Creates an empty Stroke object
 * @returns Empty Stroke
 */
export function createEmptyStroke(): Stroke {
  const now = new Date().toISOString();
  return {
    id: '',
    points: [],
    type: 'line',
    color: '#000000',
    width: 1,
    createdAt: now,
    updatedAt: now,
    data: {}
  };
}

/**
 * Creates an empty Wall object
 * @returns Empty Wall
 */
export function createEmptyWall(): Wall {
  const now = new Date().toISOString();
  return {
    id: '',
    start: { x: 0, y: 0 },
    end: { x: 0, y: 0 },
    thickness: 10,
    color: '#000000',
    createdAt: now,
    updatedAt: now,
    data: {}
  };
}

/**
 * Creates an empty Room object
 * @returns Empty Room
 */
export function createEmptyRoom(): Room {
  const now = new Date().toISOString();
  return {
    id: '',
    name: '',
    label: '',
    type: 'livingRoom',
    area: 0,
    perimeter: 0,
    center: { x: 0, y: 0 },
    wallIds: [],
    createdAt: now,
    updatedAt: now,
    data: {}
  };
}

/**
 * Creates a test FloorPlan object
 * @param overrides Optional overrides
 * @returns Test FloorPlan
 */
export function createTestFloorPlan(overrides?: Partial<FloorPlan>): FloorPlan {
  const now = new Date().toISOString();
  const defaultMetadata: FloorPlanMetadata = {
    createdAt: now,
    updatedAt: now,
    paperSize: PaperSize.A4,
    level: 0,
    version: '1.0',
    author: 'Test User',
    notes: 'Test floor plan'
  };

  const defaultFloorPlan: FloorPlan = {
    id: 'test-floorplan',
    name: 'Test Floor Plan',
    label: 'Test Floor Plan',
    walls: [],
    rooms: [],
    strokes: [],
    createdAt: now,
    updatedAt: now,
    gia: 120,
    level: 1,
    index: 0,
    metadata: defaultMetadata,
    data: { testData: 'test' },
    userId: 'test-user'
  };

  return { ...defaultFloorPlan, ...overrides };
}

/**
 * Creates a test Stroke object
 * @param overrides Optional overrides
 * @returns Test Stroke
 */
export function createTestStroke(overrides?: Partial<Stroke>): Stroke {
  const now = new Date().toISOString();
  const defaultStroke: Stroke = {
    id: 'test-stroke',
    points: [{ x: 0, y: 0 }, { x: 100, y: 100 }],
    type: 'line',
    color: '#FF0000',
    width: 5,
    createdAt: now,
    updatedAt: now,
    data: { testData: 'test' }
  };

  return { ...defaultStroke, ...overrides };
}

/**
 * Creates a test Wall object
 * @param overrides Optional overrides
 * @returns Test Wall
 */
export function createTestWall(overrides?: Partial<Wall>): Wall {
  const now = new Date().toISOString();
  const defaultWall: Wall = {
    id: 'test-wall',
    start: { x: 0, y: 0 },
    end: { x: 100, y: 0 },
    thickness: 15,
    color: '#808080',
    createdAt: now,
    updatedAt: now,
    data: { testData: 'test' }
  };

  return { ...defaultWall, ...overrides };
}

/**
 * Creates a test Room object
 * @param overrides Optional overrides
 * @returns Test Room
 */
export function createTestRoom(overrides?: Partial<Room>): Room {
  const now = new Date().toISOString();
  const defaultRoom: Room = {
    id: 'test-room',
    name: 'Test Room',
    label: 'Test Room',
    type: 'livingRoom',
    area: 25,
    perimeter: 20,
    center: { x: 50, y: 50 },
    wallIds: [],
    createdAt: now,
    updatedAt: now,
    data: { testData: 'test' }
  };

  return { ...defaultRoom, ...overrides };
}

/**
 * Creates a test Point object
 * @param overrides Optional overrides
 * @returns Test Point
 */
export function createTestPoint(overrides?: Partial<Point>): Point {
  const defaultPoint: Point = {
    x: 0,
    y: 0
  };

  return { ...defaultPoint, ...overrides };
}

// Make sure to export the necessary types
export type {
  Stroke,
  Wall,
  Room,
  FloorPlan,
  FloorPlanMetadata,
  StrokeTypeLiteral,
  RoomTypeLiteral
};

export {
  PaperSize,
  asStrokeType,
  asRoomType,
  createEmptyFloorPlan,
  createEmptyStroke,
  createEmptyWall,
  createEmptyRoom,
  createTestFloorPlan,
  createTestStroke,
  createTestWall,
  createTestRoom,
  createTestPoint
};
