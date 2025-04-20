
/**
 * Unified type definitions for floor plans
 * Central source of truth for all floor plan related types
 * @module types/floor-plan/unifiedTypes
 */
import { v4 as uuidv4 } from 'uuid';

// Basic point type
export interface Point {
  x: number;
  y: number;
}

// PaperSize enum - ensure this matches expected values in tests
export enum PaperSize {
  A4 = 'A4',
  A3 = 'A3',
  A5 = 'A5',
  LETTER = 'LETTER',
  LEGAL = 'LEGAL',
  TABLOID = 'TABLOID',
  CUSTOM = 'CUSTOM'
}

// Stroke type literals
export type StrokeTypeLiteral = 
  | 'line' 
  | 'wall'
  | 'door'
  | 'window'
  | 'furniture'
  | 'annotation'
  | 'room';

// Room type literals
export type RoomTypeLiteral = 
  | 'living' 
  | 'bedroom' 
  | 'kitchen' 
  | 'bathroom' 
  | 'office' 
  | 'other';

// Ensure string literals are parsed correctly
export function asStrokeType(typeStr: string): StrokeTypeLiteral {
  const validTypes: StrokeTypeLiteral[] = [
    'line', 'wall', 'door', 'window', 'furniture', 'annotation', 'room'
  ];
  
  if (validTypes.includes(typeStr as StrokeTypeLiteral)) {
    return typeStr as StrokeTypeLiteral;
  }
  
  console.warn(`Invalid stroke type "${typeStr}", defaulting to "line"`);
  return 'line';
}

export function asRoomType(typeStr: string): RoomTypeLiteral {
  const validTypes: RoomTypeLiteral[] = [
    'living', 'bedroom', 'kitchen', 'bathroom', 'office', 'other'
  ];
  
  if (validTypes.includes(typeStr as RoomTypeLiteral)) {
    return typeStr as RoomTypeLiteral;
  }
  
  console.warn(`Invalid room type "${typeStr}", defaulting to "other"`);
  return 'other';
}

// Stroke interface
export interface Stroke {
  id: string;
  points: Point[];
  type: StrokeTypeLiteral;
  color: string;
  thickness: number;
  width: number;
}

// Wall interface
export interface Wall {
  id: string;
  start: Point;
  end: Point;
  points?: Point[];
  thickness: number;
  color: string;
  roomIds: string[];
  length: number;
}

// Room interface
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

// Floor plan metadata
export interface FloorPlanMetadata {
  createdAt: string;
  updatedAt: string;
  paperSize: PaperSize | string;
  level: number;
  version?: string;
  author?: string;
  dateCreated?: string;
  lastModified?: string;
  notes?: string;
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
  // Required properties to fix errors
  data: any;
  userId: string;
}

// Factory functions for creating empty objects
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
    metadata: partialFloorPlan.metadata || createEmptyMetadata(),
    data: partialFloorPlan.data || {},
    userId: partialFloorPlan.userId || 'test-user'
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
  const length = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
  
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
    name: partialRoom.name || 'Unnamed Room',
    type: partialRoom.type || 'other',
    points: partialRoom.points || [],
    color: partialRoom.color || '#ffffff',
    area: partialRoom.area || 0,
    level: partialRoom.level || 0,
    walls: partialRoom.walls || []
  };
}

export function createEmptyMetadata(): FloorPlanMetadata {
  const now = new Date().toISOString();
  return {
    createdAt: now,
    updatedAt: now,
    paperSize: PaperSize.A4,
    level: 0,
    version: '1.0',
    author: '',
    dateCreated: now,
    lastModified: now,
    notes: ''
  };
}

// Test fixtures
export function createTestPoint(x: number = 0, y: number = 0): Point {
  return { x, y };
}

export function createTestStroke(overrides: Partial<Stroke> = {}): Stroke {
  return {
    id: overrides.id || `test-stroke-${Date.now()}`,
    points: overrides.points || [createTestPoint(0, 0), createTestPoint(100, 100)],
    type: overrides.type || 'line',
    color: overrides.color || '#000000',
    thickness: overrides.thickness || 2,
    width: overrides.width || 2
  };
}

export function createTestWall(overrides: Partial<Wall> = {}): Wall {
  const start = overrides.start || createTestPoint(0, 0);
  const end = overrides.end || createTestPoint(100, 0);
  const points = overrides.points || [start, end];
  const length = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
  
  return {
    id: overrides.id || `test-wall-${Date.now()}`,
    start,
    end,
    points,
    thickness: overrides.thickness || 5,
    color: overrides.color || '#000000',
    roomIds: overrides.roomIds || [],
    length: overrides.length || length
  };
}

export function createTestRoom(overrides: Partial<Room> = {}): Room {
  return {
    id: overrides.id || `test-room-${Date.now()}`,
    name: overrides.name || 'Test Room',
    type: overrides.type || 'other',
    points: overrides.points || [
      createTestPoint(0, 0),
      createTestPoint(100, 0),
      createTestPoint(100, 100),
      createTestPoint(0, 100)
    ],
    color: overrides.color || '#ffffff',
    area: overrides.area || 10000,
    level: overrides.level || 0,
    walls: overrides.walls || []
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
    // Required properties
    data: overrides.data || {},
    userId: overrides.userId || 'test-user'
  };
}
