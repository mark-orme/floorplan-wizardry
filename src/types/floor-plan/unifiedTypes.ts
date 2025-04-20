
/**
 * Unified Type Definitions
 * Single source of truth for all floor plan related types
 * @module types/floor-plan/unifiedTypes
 */
import { v4 as uuidv4 } from 'uuid';

// Console log for tracing imports
console.log('Loading unifiedTypes.ts - this should be the source of truth for all floor plan types');

/**
 * Point interface
 */
export interface Point {
  x: number;
  y: number;
}

/**
 * Create a test point with default or specified coordinates
 */
export function createTestPoint(x = 0, y = 0): Point {
  return { x, y };
}

/**
 * Paper size enum
 */
export enum PaperSize {
  A3 = "A3",
  A4 = "A4",
  A5 = "A5",
  LETTER = "LETTER",
  LEGAL = "LEGAL",
  TABLOID = "TABLOID",
  CUSTOM = "CUSTOM"
}

/**
 * Comprehensive list of all possible stroke types
 * This is the single source of truth for StrokeTypeLiteral
 */
export type StrokeTypeLiteral = 
  | 'line' 
  | 'polyline'
  | 'wall'
  | 'door'
  | 'window'
  | 'furniture'
  | 'annotation'
  | 'freehand'
  | 'straight'
  | 'room'
  | 'dimension'
  | 'text'
  | 'other';

/**
 * Type guard for StrokeTypeLiteral
 * Ensures a string is a valid StrokeTypeLiteral
 */
export function asStrokeType(type: string): StrokeTypeLiteral {
  const validTypes: StrokeTypeLiteral[] = [
    'line', 'polyline', 'wall', 'door', 'window', 
    'furniture', 'annotation', 'freehand', 'straight',
    'room', 'dimension', 'text', 'other'
  ];
  
  // Console log for debugging type conversions
  console.log(`Validating stroke type: "${type}"`);
  
  if (validTypes.includes(type as StrokeTypeLiteral)) {
    return type as StrokeTypeLiteral;
  }
  
  console.warn(`Invalid stroke type: "${type}", defaulting to "line"`);
  return 'line';
}

/**
 * Comprehensive list of all possible room types
 * This is the single source of truth for RoomTypeLiteral
 */
export type RoomTypeLiteral = 
  | 'living' 
  | 'bedroom' 
  | 'kitchen' 
  | 'bathroom' 
  | 'office' 
  | 'other';

/**
 * Type guard for RoomTypeLiteral
 * Ensures a string is a valid RoomTypeLiteral
 */
export function asRoomType(type: string): RoomTypeLiteral {
  const validTypes: RoomTypeLiteral[] = [
    'living', 'bedroom', 'kitchen', 'bathroom', 'office', 'other'
  ];
  
  // Console log for debugging type conversions
  console.log(`Validating room type: "${type}"`);
  
  if (validTypes.includes(type as RoomTypeLiteral)) {
    return type as RoomTypeLiteral;
  }
  
  console.warn(`Invalid room type: "${type}", defaulting to "other"`);
  return 'other';
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
  width: number;
}

/**
 * Create an empty stroke with default values
 */
export function createEmptyStroke(partial: Partial<Stroke> = {}): Stroke {
  return {
    id: partial.id || uuidv4(),
    points: partial.points || [],
    type: partial.type || 'line',
    color: partial.color || '#000000',
    thickness: partial.thickness || 2,
    width: partial.width || partial.thickness || 2
  };
}

/**
 * Create a test stroke for testing
 */
export function createTestStroke(partial: Partial<Stroke> = {}): Stroke {
  return createEmptyStroke({
    id: `test-stroke-${Date.now()}`,
    points: [
      { x: 0, y: 0 },
      { x: 100, y: 100 }
    ],
    ...partial
  });
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
  height?: number;
  roomIds: string[];
  length: number;
  points?: Point[];
}

/**
 * Calculate length between two points
 */
function calculateLength(start: Point, end: Point): number {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Create an empty wall with default values
 */
export function createEmptyWall(partial: Partial<Wall> = {}): Wall {
  const start = partial.start || { x: 0, y: 0 };
  const end = partial.end || { x: 100, y: 0 };
  
  return {
    id: partial.id || uuidv4(),
    start,
    end,
    thickness: partial.thickness || 5,
    color: partial.color || '#000000',
    height: partial.height,
    roomIds: partial.roomIds || [],
    length: partial.length || calculateLength(start, end),
    points: partial.points || [start, end]
  };
}

/**
 * Create a test wall for testing
 */
export function createTestWall(partial: Partial<Wall> = {}): Wall {
  return createEmptyWall({
    id: `test-wall-${Date.now()}`,
    ...partial
  });
}

/**
 * Room interface
 */
export interface Room {
  id: string;
  name: string;
  type: RoomTypeLiteral;
  area: number;
  points: Point[];
  color: string;
  level: number;
  walls: string[];
}

/**
 * Calculate polygon area
 */
function calculateArea(points: Point[]): number {
  if (points.length < 3) return 0;
  
  let area = 0;
  for (let i = 0; i < points.length; i++) {
    const j = (i + 1) % points.length;
    area += points[i].x * points[j].y;
    area -= points[j].x * points[i].y;
  }
  
  return Math.abs(area) / 2;
}

/**
 * Create an empty room with default values
 */
export function createEmptyRoom(partial: Partial<Room> = {}): Room {
  const points = partial.points || [
    { x: 0, y: 0 },
    { x: 100, y: 0 },
    { x: 100, y: 100 },
    { x: 0, y: 100 }
  ];
  
  return {
    id: partial.id || uuidv4(),
    name: partial.name || 'Unnamed Room',
    type: partial.type || 'other',
    area: partial.area || calculateArea(points),
    points,
    color: partial.color || '#ffffff',
    level: partial.level || 0,
    walls: partial.walls || []
  };
}

/**
 * Create a test room for testing
 */
export function createTestRoom(partial: Partial<Room> = {}): Room {
  return createEmptyRoom({
    id: `test-room-${Date.now()}`,
    name: 'Test Room',
    ...partial
  });
}

/**
 * Floor plan metadata interface
 */
export interface FloorPlanMetadata {
  version?: string;
  author?: string;
  dateCreated?: string;
  lastModified?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
  paperSize: PaperSize;
  level: number;
}

/**
 * Floor plan interface
 */
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
  // Required properties for interface compatibility
  data: any;
  userId: string;
  canvasState?: any; // Optional property used in some contexts
}

/**
 * Create an empty floor plan with default values
 */
export function createEmptyFloorPlan(partial: Partial<FloorPlan> = {}): FloorPlan {
  const now = new Date().toISOString();
  const level = partial.level || 0;
  
  return {
    id: partial.id || uuidv4(),
    name: partial.name || 'Untitled Floor Plan',
    label: partial.label || partial.name || 'Untitled Floor Plan',
    walls: partial.walls || [],
    rooms: partial.rooms || [],
    strokes: partial.strokes || [],
    canvasData: partial.canvasData || null,
    canvasJson: partial.canvasJson || null,
    createdAt: partial.createdAt || now,
    updatedAt: partial.updatedAt || now,
    gia: partial.gia || 0,
    level,
    index: partial.index || level,
    metadata: partial.metadata || {
      createdAt: now,
      updatedAt: now,
      paperSize: PaperSize.A4,
      level,
      version: "1.0",
      author: "System",
      dateCreated: now,
      lastModified: now,
      notes: ""
    },
    // Add required properties with defaults if not provided
    data: partial.data || {},
    userId: partial.userId || 'unknown'
  };
}

/**
 * Create a test floor plan for testing
 */
export function createTestFloorPlan(partial: Partial<FloorPlan> = {}): FloorPlan {
  return createEmptyFloorPlan({
    id: `test-floorplan-${Date.now()}`,
    name: 'Test Floor Plan',
    ...partial
  });
}

// Export everything explicitly to make this the single source of truth
export * from '../core/Point';
