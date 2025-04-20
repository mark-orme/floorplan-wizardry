
/**
 * Unified floor plan type definitions
 * @module types/floor-plan/unifiedTypes
 */
import { v4 as uuidv4 } from 'uuid';

// Paper size enum (exported to fix import errors)
export enum PaperSize {
  A4 = 'A4',
  A3 = 'A3',
  Letter = 'Letter',
  Legal = 'Legal',
  Custom = 'Custom'
}

// Point structure
export interface Point {
  x: number;
  y: number;
}

// Stroke type literals
export type StrokeTypeLiteral = 'freehand' | 'line' | 'wall' | 'room' | 'door' | 'window' | 'furniture' | 'annotation' | 'polyline';

// Room type literals
export type RoomTypeLiteral = 'living' | 'bedroom' | 'kitchen' | 'bathroom' | 'office' | 'other' | 'dining' | 'hallway';

// Type guards for stroke and room types
export const asStrokeType = (type: string): StrokeTypeLiteral => {
  const validTypes: StrokeTypeLiteral[] = ['freehand', 'line', 'wall', 'room', 'door', 'window', 'furniture', 'annotation', 'polyline'];
  return validTypes.includes(type as StrokeTypeLiteral) 
    ? type as StrokeTypeLiteral 
    : 'line';
};

export const asRoomType = (type: string): RoomTypeLiteral => {
  const validTypes: RoomTypeLiteral[] = ['living', 'bedroom', 'kitchen', 'bathroom', 'office', 'other', 'dining', 'hallway'];
  return validTypes.includes(type as RoomTypeLiteral) 
    ? type as RoomTypeLiteral 
    : 'other';
};

// Floor plan metadata
export interface FloorPlanMetadata {
  version: string;
  author: string;
  dateCreated: string;
  lastModified: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
  paperSize: PaperSize | string;
  level: number;
}

// Stroke interface
export interface Stroke {
  id: string;
  points: Point[];
  type: StrokeTypeLiteral;
  thickness: number;
  width?: number;
  color?: string;
}

// Wall interface
export interface Wall {
  id: string;
  start: Point;
  end: Point;
  thickness: number;
  length: number;
  color: string;
  roomIds: string[];
  height?: number;
}

// Room interface
export interface Room {
  id: string;
  name: string;
  type: RoomTypeLiteral;
  area: number;
  vertices: Point[];
  perimeter?: number;
  labelPosition?: Point;
  center?: Point;
  color?: string;
}

// Floor plan interface
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
  data: any; // Required property
  userId: string; // Required property
}

// Helper for creating test data
export const createTestPoint = (overrides: Partial<Point> = {}): Point => {
  return {
    x: 0,
    y: 0,
    ...overrides
  };
};

export const createTestStroke = (overrides: Partial<Stroke> = {}): Stroke => {
  return {
    id: overrides.id || uuidv4(),
    points: overrides.points || [createTestPoint(), createTestPoint({ x: 100, y: 100 })],
    type: overrides.type || 'line',
    thickness: overrides.thickness || 2,
    width: overrides.width || overrides.thickness || 2,
    color: overrides.color || '#000000'
  };
};

export const createTestWall = (overrides: Partial<Wall> = {}): Wall => {
  const start = overrides.start || createTestPoint();
  const end = overrides.end || createTestPoint({ x: 100, y: 0 });
  
  // Calculate length if not provided
  const length = overrides.length || Math.sqrt(
    Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2)
  );
  
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
};

export const createTestRoom = (overrides: Partial<Room> = {}): Room => {
  return {
    id: overrides.id || uuidv4(),
    name: overrides.name || 'Test Room',
    type: overrides.type || 'other',
    area: overrides.area || 0,
    vertices: overrides.vertices || [
      createTestPoint(),
      createTestPoint({ x: 100, y: 0 }),
      createTestPoint({ x: 100, y: 100 }),
      createTestPoint({ x: 0, y: 100 })
    ],
    perimeter: overrides.perimeter,
    labelPosition: overrides.labelPosition,
    center: overrides.center,
    color: overrides.color || '#ffffff'
  };
};

export const createCompleteMetadata = (overrides: Partial<FloorPlanMetadata> = {}): FloorPlanMetadata => {
  const now = new Date().toISOString();
  
  return {
    version: overrides.version || "1.0",
    author: overrides.author || "Test User",
    dateCreated: overrides.dateCreated || now,
    lastModified: overrides.lastModified || now,
    notes: overrides.notes || "",
    createdAt: overrides.createdAt || now,
    updatedAt: overrides.updatedAt || now,
    paperSize: overrides.paperSize || PaperSize.A4,
    level: overrides.level || 0
  };
};

export const createTestFloorPlan = (overrides: Partial<FloorPlan> = {}): FloorPlan => {
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
    metadata: overrides.metadata || createCompleteMetadata({
      level: overrides.level || 0
    }),
    data: overrides.data || {},
    userId: overrides.userId || 'test-user'
  };
};

// For backward compatibility
export const createEmptyFloorPlan = createTestFloorPlan;
export const createEmptyStroke = createTestStroke;
export const createEmptyWall = createTestWall;
export const createEmptyRoom = createTestRoom;
