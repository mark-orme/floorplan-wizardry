
/**
 * Unified floor plan type definitions
 * @module types/floor-plan/unifiedTypes
 */
import { Point } from 'fabric';
import { v4 as uuidv4 } from 'uuid';

// Type definitions
export type StrokeTypeLiteral = 'line' | 'wall' | 'door' | 'window' | 'furniture' | 'annotation' | 'freehand' | 'straight';
export type RoomTypeLiteral = 'bedroom' | 'bathroom' | 'kitchen' | 'living' | 'office' | 'other';

// Enums as objects for compatibility
export const PaperSize = {
  A4: 'A4',
  A3: 'A3',
  A2: 'A2',
  A1: 'A1'
} as const;

export type PaperSizeType = keyof typeof PaperSize;

// Interface definitions
export interface Wall {
  id: string;
  start: Point;
  end: Point;
  thickness: number;
  color: string;
  roomIds: string[];
  length?: number;
  floorPlanId?: string;
}

export interface Room {
  id: string;
  name: string;
  type: RoomTypeLiteral;
  vertices: Point[];
  points?: Point[];
  area: number;
  color: string;
  level?: number;
  walls?: string[];
  floorPlanId?: string;
}

export interface Stroke {
  id: string;
  points: Point[];
  type: StrokeTypeLiteral;
  width?: number;
  thickness?: number;
  color?: string;
  metadata?: Record<string, any>;
  floorPlanId?: string;
}

export interface FloorPlanMetadata {
  createdAt: string;
  updatedAt: string;
  author?: string;
  version?: string;
  paperSize?: string;
  level?: number;
  notes?: string;
}

export interface FloorPlan {
  id: string;
  name: string;
  label?: string;
  walls: Wall[];
  rooms: Room[];
  strokes: Stroke[];
  metadata: FloorPlanMetadata;
  canvasData?: any;
  canvasJson?: string;
  createdAt: string;
  updatedAt: string;
  gia?: number;
  level?: number;
  index?: number;
  data: any;
  userId: string;
  propertyId?: string;
}

// Type guard functions
export const asStrokeType = (type: string): StrokeTypeLiteral => {
  const validTypes: StrokeTypeLiteral[] = ['line', 'wall', 'door', 'window', 'furniture', 'annotation', 'freehand', 'straight'];
  return validTypes.includes(type as StrokeTypeLiteral) 
    ? (type as StrokeTypeLiteral) 
    : 'line';
};

export const asRoomType = (type: string): RoomTypeLiteral => {
  const validTypes: RoomTypeLiteral[] = ['bedroom', 'bathroom', 'kitchen', 'living', 'office', 'other'];
  return validTypes.includes(type as RoomTypeLiteral)
    ? (type as RoomTypeLiteral)
    : 'other';
};

// Factory functions
export const createEmptyFloorPlan = (partial: Partial<FloorPlan> = {}): FloorPlan => {
  const now = new Date().toISOString();
  return {
    id: partial.id || uuidv4(),
    name: partial.name || 'Untitled Floor Plan',
    label: partial.label || partial.name || 'Untitled Floor Plan',
    walls: partial.walls || [],
    rooms: partial.rooms || [],
    strokes: partial.strokes || [],
    metadata: partial.metadata || {
      createdAt: now,
      updatedAt: now,
      author: 'User',
      version: '1.0',
      level: 0,
      notes: ''
    },
    canvasData: partial.canvasData || null,
    canvasJson: partial.canvasJson || null,
    createdAt: partial.createdAt || now,
    updatedAt: partial.updatedAt || now,
    gia: partial.gia || 0,
    level: partial.level || 0,
    index: partial.index || 0,
    data: partial.data || {},
    userId: partial.userId || ''
  };
};

export const createEmptyWall = (partial: Partial<Wall> = {}): Wall => {
  return {
    id: partial.id || uuidv4(),
    start: partial.start || { x: 0, y: 0 },
    end: partial.end || { x: 100, y: 0 },
    thickness: partial.thickness || 5,
    color: partial.color || '#000000',
    roomIds: partial.roomIds || [],
    length: partial.length || 100
  };
};

export const createEmptyRoom = (partial: Partial<Room> = {}): Room => {
  return {
    id: partial.id || uuidv4(),
    name: partial.name || 'Unnamed Room',
    type: partial.type || 'other',
    vertices: partial.vertices || [],
    area: partial.area || 0,
    color: partial.color || '#ffffff',
    level: partial.level || 0,
    walls: partial.walls || []
  };
};

export const createEmptyStroke = (partial: Partial<Stroke> = {}): Stroke => {
  return {
    id: partial.id || uuidv4(),
    points: partial.points || [],
    type: partial.type || 'line',
    width: partial.width || 2,
    thickness: partial.width || 2,
    color: partial.color || '#000000'
  };
};

// Test fixtures
export const createTestPoint = (x = 0, y = 0) => ({ x, y });

export const createTestWall = (partial: Partial<Wall> = {}): Wall => {
  const start = partial.start || createTestPoint(0, 0);
  const end = partial.end || createTestPoint(100, 0);
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const length = Math.sqrt(dx * dx + dy * dy);
  
  return {
    id: partial.id || 'test-wall-' + uuidv4().substring(0, 8),
    start,
    end,
    thickness: partial.thickness || 5,
    color: partial.color || '#000000',
    roomIds: partial.roomIds || [],
    length: partial.length || length
  };
};

export const createTestRoom = (partial: Partial<Room> = {}): Room => {
  return {
    id: partial.id || 'test-room-' + uuidv4().substring(0, 8),
    name: partial.name || 'Test Room',
    type: partial.type || 'other',
    vertices: partial.vertices || [
      createTestPoint(0, 0),
      createTestPoint(100, 0),
      createTestPoint(100, 100),
      createTestPoint(0, 100)
    ],
    area: partial.area || 10000,
    color: partial.color || '#e0e0ff',
    level: partial.level || 0,
    walls: partial.walls || []
  };
};

export const createTestStroke = (partial: Partial<Stroke> = {}): Stroke => {
  return {
    id: partial.id || 'test-stroke-' + uuidv4().substring(0, 8),
    points: partial.points || [
      createTestPoint(0, 0),
      createTestPoint(100, 100)
    ],
    type: partial.type || 'line',
    width: partial.width || 2,
    thickness: partial.width || 2,
    color: partial.color || '#000000'
  };
};

export const createTestFloorPlan = (partial: Partial<FloorPlan> = {}): FloorPlan => {
  const now = new Date().toISOString();
  return {
    id: partial.id || 'test-floorplan-' + uuidv4().substring(0, 8),
    name: partial.name || 'Test Floor Plan',
    label: partial.label || partial.name || 'Test Floor Plan',
    walls: partial.walls || [createTestWall()],
    rooms: partial.rooms || [createTestRoom()],
    strokes: partial.strokes || [createTestStroke()],
    metadata: partial.metadata || {
      createdAt: now,
      updatedAt: now,
      author: 'Test User',
      version: '1.0',
      level: 0,
      notes: 'Test notes'
    },
    canvasData: partial.canvasData || null,
    canvasJson: partial.canvasJson || null,
    createdAt: partial.createdAt || now,
    updatedAt: partial.updatedAt || now,
    gia: partial.gia || 10000,
    level: partial.level || 0,
    index: partial.index || 0,
    data: partial.data || {},
    userId: partial.userId || 'test-user'
  };
};
