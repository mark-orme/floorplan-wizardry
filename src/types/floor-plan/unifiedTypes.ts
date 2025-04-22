
/**
 * Unified Floor Plan Types
 * Single source of truth for all floor plan related types
 * @module types/floor-plan/unifiedTypes
 */

// Import dependencies
import { v4 as uuidv4 } from 'uuid';

// Point interface - fundamental building block
export interface Point {
  x: number;
  y: number;
}

// Paper size enum
export enum PaperSize {
  A4 = 'A4',
  A3 = 'A3',
  LETTER = 'Letter',
  LEGAL = 'Legal',
  CUSTOM = 'Custom'
}

// Stroke type literals
export type StrokeTypeLiteral = 'line' | 'wall' | 'door' | 'window' | 'furniture' | 'annotation' | 'polyline' | 'room' | 'freehand';

// Room type literals
export type RoomTypeLiteral = 'living' | 'bedroom' | 'kitchen' | 'bathroom' | 'office' | 'other';

// Stroke interface
export interface Stroke {
  id: string;
  points: Point[];
  type: StrokeTypeLiteral;
  color: string;
  width: number; // Standard width property
  floorPlanId?: string;
}

// Wall interface
export interface Wall {
  id: string;
  start: Point;
  end: Point;
  thickness: number;
  color: string;
  roomIds: string[];
  length: number;
  angle?: number; // Added angle property to match usage
  floorPlanId?: string;
}

// Room interface
export interface Room {
  id: string;
  name: string;
  type: RoomTypeLiteral;
  vertices: Point[];
  area: number;
  color: string;
  floorPlanId?: string;
}

// Floor plan metadata interface
export interface FloorPlanMetadata {
  createdAt: string;
  updatedAt: string;
  paperSize: PaperSize | string;
  level: number;
  version: string;
  author: string;
  notes: string;
  dateCreated: string;
  lastModified: string;
}

// Floor plan interface
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
  data: any; // Required field
  userId: string; // Required field
  canvasData?: any;
  canvasJson?: string | null;
  propertyId?: string;
}

// Type guard helpers
export function asStrokeType(type: string): StrokeTypeLiteral {
  return ((['line', 'wall', 'door', 'window', 'furniture', 'annotation', 'polyline', 'room', 'freehand'] as StrokeTypeLiteral[])
    .includes(type as StrokeTypeLiteral) ? (type as StrokeTypeLiteral) : 'line');
}

export function asRoomType(type: string): RoomTypeLiteral {
  return ((['living', 'bedroom', 'kitchen', 'bathroom', 'office', 'other'] as RoomTypeLiteral[])
    .includes(type as RoomTypeLiteral) ? (type as RoomTypeLiteral) : 'other');
}

// Factory functions for creating empty objects
export function createEmptyFloorPlan(propertyId: string = ''): FloorPlan {
  const now = new Date().toISOString();
  return {
    id: uuidv4(),
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
      createdAt: now,
      updatedAt: now,
      paperSize: PaperSize.A4,
      level: 0,
      version: '1.0',
      author: 'System',
      notes: '',
      dateCreated: now,
      lastModified: now
    },
    userId: 'default-user',
    propertyId
  };
}

export function createEmptyStroke(): Stroke {
  return {
    id: `stroke-${Date.now()}`,
    points: [],
    type: 'line',
    color: '#000000',
    width: 1
  };
}

export function createEmptyWall(): Wall {
  return {
    id: `wall-${Date.now()}`,
    start: { x: 0, y: 0 },
    end: { x: 100, y: 0 },
    thickness: 5,
    color: '#000000',
    roomIds: [],
    length: 100,
    angle: 0 // Add default angle
  };
}

export function createEmptyRoom(): Room {
  return {
    id: `room-${Date.now()}`,
    name: 'Unnamed Room',
    type: 'other',
    vertices: [],
    area: 0,
    color: '#f0f0f0'
  };
}

// Test object creation functions
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
