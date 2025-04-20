
/**
 * Unified Floor Plan Types
 * Contains all type definitions and utility functions for floor plans
 * @module types/floor-plan/unifiedTypes
 */
import { v4 as uuidv4 } from 'uuid';

// Define all literal types
export type StrokeTypeLiteral = 'line' | 'curve' | 'straight' | 'freehand' | 'polyline';
export type RoomTypeLiteral = 'living' | 'kitchen' | 'bedroom' | 'bathroom' | 'dining' | 'office' | 'hallway' | 'other';

// Paper size enum
export enum PaperSize {
  A0 = 'A0',
  A1 = 'A1',
  A2 = 'A2',
  A3 = 'A3',
  A4 = 'A4',
  A5 = 'A5',
  LETTER = 'Letter',
  LEGAL = 'Legal',
  TABLOID = 'Tabloid',
  CUSTOM = 'Custom'
}

// Base interfaces
export interface Point {
  x: number;
  y: number;
}

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

export interface Stroke {
  id: string;
  points: Point[];
  type: StrokeTypeLiteral;
  color: string;
  thickness: number;
  width: number;
}

export interface Wall {
  id: string;
  start: Point;
  end: Point;
  points: Point[];
  thickness: number;
  color: string;
  roomIds: string[];
  length: number;
}

export interface Room {
  id: string;
  name: string;
  type: RoomTypeLiteral;
  points: Point[];
  color: string;
  area: number;
  level: number;
  walls: string[];
}

export interface FloorPlan {
  id: string;
  name: string;
  label: string;
  walls: Wall[];
  rooms: Room[];
  strokes: Stroke[];
  canvasData: any | null;
  canvasJson: string | null;
  createdAt: string;
  updatedAt: string;
  gia: number;
  level: number;
  index: number;
  metadata: FloorPlanMetadata;
  // Required properties that were missing in many places
  data: any;
  userId: string;
  // Optional property needed in some parts of the app
  canvasState?: any;
}

// Type guard functions
export function asStrokeType(type: string): StrokeTypeLiteral {
  const validTypes: StrokeTypeLiteral[] = ['line', 'curve', 'straight', 'freehand', 'polyline'];
  return validTypes.includes(type as StrokeTypeLiteral) 
    ? (type as StrokeTypeLiteral) 
    : 'line';
}

export function asRoomType(type: string): RoomTypeLiteral {
  const validTypes: RoomTypeLiteral[] = ['living', 'kitchen', 'bedroom', 'bathroom', 'dining', 'office', 'hallway', 'other'];
  return validTypes.includes(type as RoomTypeLiteral) 
    ? (type as RoomTypeLiteral) 
    : 'other';
}

// Factory functions for creating objects
export function createEmptyFloorPlan(partialFloorPlan: Partial<FloorPlan> = {}): FloorPlan {
  const now = new Date().toISOString();
  return {
    id: partialFloorPlan.id || uuidv4(),
    name: partialFloorPlan.name || 'Untitled Floor Plan',
    label: partialFloorPlan.label || 'Untitled Floor Plan',
    walls: partialFloorPlan.walls || [],
    rooms: partialFloorPlan.rooms || [],
    strokes: partialFloorPlan.strokes || [],
    canvasData: partialFloorPlan.canvasData || null,
    canvasJson: partialFloorPlan.canvasJson || null,
    createdAt: partialFloorPlan.createdAt || now,
    updatedAt: partialFloorPlan.updatedAt || now,
    gia: partialFloorPlan.gia || 0,
    level: partialFloorPlan.level || 0,
    index: partialFloorPlan.index || 0,
    metadata: partialFloorPlan.metadata || {
      createdAt: now,
      updatedAt: now,
      paperSize: PaperSize.A4,
      level: 0,
      version: "1.0",
      author: "",
      dateCreated: now,
      lastModified: now,
      notes: ""
    },
    data: partialFloorPlan.data || {},
    userId: partialFloorPlan.userId || '',
    canvasState: partialFloorPlan.canvasState || null
  };
}

export function createEmptyStroke(partialStroke: Partial<Stroke> = {}): Stroke {
  return {
    id: partialStroke.id || uuidv4(),
    points: partialStroke.points || [],
    type: partialStroke.type || 'line',
    color: partialStroke.color || '#000000',
    thickness: partialStroke.thickness || 2,
    width: partialStroke.width || 2
  };
}

export function createEmptyWall(partialWall: Partial<Wall> = {}): Wall {
  const start = partialWall.start || { x: 0, y: 0 };
  const end = partialWall.end || { x: 100, y: 0 };
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const length = Math.sqrt(dx * dx + dy * dy);
  
  return {
    id: partialWall.id || uuidv4(),
    start,
    end,
    points: partialWall.points || [start, end],
    thickness: partialWall.thickness || 5,
    color: partialWall.color || '#000000',
    roomIds: partialWall.roomIds || [],
    length: partialWall.length || length
  };
}

export function createEmptyRoom(partialRoom: Partial<Room> = {}): Room {
  return {
    id: partialRoom.id || uuidv4(),
    name: partialRoom.name || 'Room',
    type: partialRoom.type || 'other',
    points: partialRoom.points || [],
    color: partialRoom.color || '#cccccc',
    area: partialRoom.area || 0,
    level: partialRoom.level || 0,
    walls: partialRoom.walls || []
  };
}

// Test utilities for creating test objects
export function createTestPoint(x = 0, y = 0): Point {
  return { x, y };
}

export function createTestStroke(overrides: Partial<Stroke> = {}): Stroke {
  let typeLiteral: StrokeTypeLiteral = 'line';
  
  if (overrides.type && typeof overrides.type === "string") {
    typeLiteral = asStrokeType(overrides.type);
  }
  
  return {
    id: overrides.id || `stroke-${Date.now()}`,
    points: overrides.points || [{ x: 0, y: 0 }, { x: 100, y: 100 }],
    type: typeLiteral,
    color: overrides.color || '#000000',
    thickness: overrides.thickness || 2,
    width: overrides.width || 2,
    ...overrides
  };
}

export function createTestWall(overrides: Partial<Wall> = {}): Wall {
  const start = overrides.start || { x: 0, y: 0 };
  const end = overrides.end || { x: 100, y: 0 };
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const length = Math.sqrt(dx * dx + dy * dy);
  
  return {
    id: overrides.id || `wall-${Date.now()}`,
    start,
    end,
    points: overrides.points || [start, end],
    thickness: overrides.thickness || 5,
    color: overrides.color || '#000000',
    roomIds: overrides.roomIds || [],
    length: overrides.length || length,
    ...overrides
  };
}

export function createTestRoom(overrides: Partial<Room> = {}): Room {
  let typeLiteral: RoomTypeLiteral = 'other';
  
  if (overrides.type && typeof overrides.type === "string") {
    typeLiteral = asRoomType(overrides.type);
  }
  
  return {
    id: overrides.id || `room-${Date.now()}`,
    name: overrides.name || 'Test Room',
    type: typeLiteral,
    points: overrides.points || [{ x: 0, y: 0 }, { x: 100, y: 0 }, { x: 100, y: 100 }, { x: 0, y: 100 }],
    color: overrides.color || '#ffffff',
    area: overrides.area || 10000,
    level: overrides.level || 0,
    walls: overrides.walls || [],
    ...overrides
  };
}

export function createTestFloorPlan(overrides: Partial<FloorPlan> = {}): FloorPlan {
  const now = new Date().toISOString();
  
  return {
    id: overrides.id || `test-fp-${Date.now()}`,
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
    data: overrides.data || {},
    userId: overrides.userId || 'test-user',
    canvasState: overrides.canvasState || null
  };
}
