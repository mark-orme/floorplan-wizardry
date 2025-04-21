
/**
 * Unified floor plan types
 * Centralizes all floor plan type definitions
 * @module types/floor-plan/unifiedTypes
 */

import { v4 as uuidv4 } from 'uuid';

// Re-export basic types
export interface Point {
  x: number;
  y: number;
}

export enum PaperSize {
  A4 = "A4",
  A3 = "A3",
  A2 = "A2",
  A1 = "A1",
  LETTER = "Letter",
  LEGAL = "Legal",
  TABLOID = "Tabloid"
}

// Stroke type literals - now complete including all required types
export type StrokeTypeLiteral = 'line' | 'wall' | 'door' | 'window' | 'furniture' | 'annotation' | 'polyline' | 'room' | 'freehand';

// Room type literals
export type RoomTypeLiteral = 'living' | 'bedroom' | 'kitchen' | 'bathroom' | 'office' | 'other';

// Type assertions
export function asStrokeType(type: string): StrokeTypeLiteral {
  if (['line', 'wall', 'door', 'window', 'furniture', 'annotation', 'polyline', 'room', 'freehand'].includes(type)) {
    return type as StrokeTypeLiteral;
  }
  return 'annotation'; // Default fallback
}

export function asRoomType(type: string): RoomTypeLiteral {
  if (['living', 'bedroom', 'kitchen', 'bathroom', 'office', 'other'].includes(type)) {
    return type as RoomTypeLiteral;
  }
  return 'other'; // Default fallback
}

// Common interfaces with all required properties
export interface FloorPlanMetadata {
  createdAt: string;
  updatedAt: string;
  paperSize: PaperSize | string;
  level: number;
  // Add missing required properties
  version: string;
  author: string;
  dateCreated: string;
  lastModified: string;
  notes: string;
}

export interface Stroke {
  id: string;
  type: StrokeTypeLiteral;
  points: Point[];
  color: string;
  thickness: number;
  metadata?: any;
  createdAt?: string;
  updatedAt?: string;
}

export interface Wall {
  id: string;
  start: Point;
  end: Point;
  thickness: number;
  color: string;
  length: number; // Make sure length is required
  roomIds: string[];
  height?: number;
  points?: Point[];
}

export interface Room {
  id: string;
  name: string;
  type: RoomTypeLiteral;
  area: number;
  color: string;
  level?: number;
  walls?: string[];
  points?: Point[];
  // Add required properties
  vertices: Point[];
  perimeter: number;
  center: Point;
  labelPosition: Point;
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
  data: any;
  userId: string;
}

// Helper functions for tests
export function createTestPoint(x = 0, y = 0): Point {
  return { x, y };
}

export function calculateDistance(p1: Point, p2: Point): number {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

export function createTestWall(partialWall: Partial<Wall> = {}): Wall {
  const start = partialWall.start || { x: 0, y: 0 };
  const end = partialWall.end || { x: 100, y: 0 };
  
  // Calculate length if not provided
  const length = partialWall.length !== undefined ? 
    partialWall.length : 
    calculateDistance(start, end);
    
  return {
    id: partialWall.id || uuidv4(),
    start: start,
    end: end,
    thickness: partialWall.thickness || 5,
    color: partialWall.color || '#000000',
    roomIds: partialWall.roomIds || [],
    length: length,
    points: partialWall.points || [start, end],
    ...(partialWall.height && { height: partialWall.height })
  };
}

export function createTestRoom(partialRoom: Partial<Room> = {}): Room {
  const points = partialRoom.points || [
    { x: 0, y: 0 },
    { x: 100, y: 0 },
    { x: 100, y: 100 },
    { x: 0, y: 100 }
  ];
  
  // Calculate center if not provided
  const center = partialRoom.center || {
    x: points.reduce((sum, p) => sum + p.x, 0) / points.length,
    y: points.reduce((sum, p) => sum + p.y, 0) / points.length
  };
  
  // Calculate perimeter if not provided
  const calculatePerimeter = (points: Point[]): number => {
    let perimeter = 0;
    for (let i = 0; i < points.length; i++) {
      const nextIdx = (i + 1) % points.length;
      perimeter += calculateDistance(points[i], points[nextIdx]);
    }
    return perimeter;
  };
  
  return {
    id: partialRoom.id || uuidv4(),
    name: partialRoom.name || 'Test Room',
    type: partialRoom.type || 'other',
    area: partialRoom.area || 10000,
    color: partialRoom.color || '#ffffff',
    walls: partialRoom.walls || [],
    level: partialRoom.level || 0,
    points: points,
    // Add required properties
    vertices: partialRoom.vertices || [...points],
    perimeter: partialRoom.perimeter || calculatePerimeter(points),
    center: center,
    labelPosition: partialRoom.labelPosition || center
  };
}

export function createTestStroke(partialStroke: Partial<Stroke> = {}): Stroke {
  return {
    id: partialStroke.id || uuidv4(),
    type: partialStroke.type || 'line',
    points: partialStroke.points || [{ x: 0, y: 0 }, { x: 100, y: 100 }],
    color: partialStroke.color || '#000000',
    thickness: partialStroke.thickness || 2,
    metadata: partialStroke.metadata,
    createdAt: partialStroke.createdAt,
    updatedAt: partialStroke.updatedAt
  };
}

export function createTestFloorPlan(partialFloorPlan: Partial<FloorPlan> = {}): FloorPlan {
  const now = new Date().toISOString();
  
  // Create default metadata with all required fields
  const defaultMetadata: FloorPlanMetadata = {
    createdAt: now,
    updatedAt: now,
    paperSize: PaperSize.A4,
    level: partialFloorPlan.level || 0,
    version: "1.0",
    author: "Test User",
    dateCreated: now,
    lastModified: now,
    notes: ""
  };
  
  return {
    id: partialFloorPlan.id || uuidv4(),
    name: partialFloorPlan.name || 'Test Floor Plan',
    label: partialFloorPlan.label || 'Test Floor Plan',
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
    metadata: partialFloorPlan.metadata || defaultMetadata,
    data: partialFloorPlan.data || {},
    userId: partialFloorPlan.userId || 'test-user'
  };
}

// These "empty" creation functions are needed according to imports
export function createEmptyFloorPlan(partialFloorPlan: Partial<FloorPlan> = {}): FloorPlan {
  return createTestFloorPlan(partialFloorPlan);
}

export function createEmptyWall(partialWall: Partial<Wall> = {}): Wall {
  return createTestWall(partialWall);
}

export function createEmptyRoom(partialRoom: Partial<Room> = {}): Room {
  return createTestRoom(partialRoom);
}

export function createEmptyStroke(partialStroke: Partial<Stroke> = {}): Stroke {
  return createTestStroke(partialStroke);
}
