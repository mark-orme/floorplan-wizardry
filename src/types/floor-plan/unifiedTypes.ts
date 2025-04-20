
/**
 * Unified Types for Floor Plans
 * Central definitive source for all floor plan types
 * @module types/floor-plan/unifiedTypes
 */

// Import all base types from relevant files
import { v4 as uuidv4 } from 'uuid';

/**
 * Stroke type literals for various drawing types
 */
export type StrokeTypeLiteral = 
  'line' | 
  'polyline' | 
  'wall' | 
  'room' | 
  'freehand' | 
  'door' | 
  'window' | 
  'furniture' | 
  'annotation' | 
  'straight' |  // Ensure 'straight' is included
  'other';

/**
 * Room type literals for different room types
 */
export type RoomTypeLiteral = 
  'living' | 
  'bedroom' | 
  'kitchen' | 
  'bathroom' | 
  'office' | 
  'other';

/**
 * Paper size literals for floor plan exports
 */
export enum PaperSize {
  A4 = 'A4',
  A3 = 'A3',
  A5 = 'A5',
  LETTER = 'LETTER',
  LEGAL = 'LEGAL',
  TABLOID = 'TABLOID',
  CUSTOM = 'CUSTOM'
}

/**
 * Point interface
 */
export interface Point {
  x: number;
  y: number;
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
 * Wall interface
 */
export interface Wall {
  id: string;
  points: Point[];
  start: Point;
  end: Point;
  thickness: number;
  color: string;
  roomIds: string[];  // Required property
  length: number;
  height?: number;
  startPoint?: Point;
  endPoint?: Point;
}

/**
 * Room interface
 */
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

/**
 * FloorPlan metadata interface
 */
export interface FloorPlanMetadata {
  createdAt?: string;
  updatedAt?: string;
  paperSize?: PaperSize | string;
  level?: number;
  version?: string;
  author?: string;
  dateCreated?: string;
  lastModified?: string;
  notes?: string;
}

/**
 * FloorPlan interface - the central definition
 */
export interface FloorPlan {
  id: string;
  name: string;
  label: string;
  walls: Wall[];
  rooms: Room[];
  strokes: Stroke[];
  canvasData: string | null;
  canvasJson: string | null;
  createdAt: string;
  updatedAt: string;
  gia: number;
  level: number;
  index: number;
  metadata: FloorPlanMetadata;
  data: any;  // Required property
  userId: string;  // Required property
  order?: number;
}

/**
 * Type guard to validate StrokeTypeLiteral
 * @param type Type to check
 * @returns Valid StrokeTypeLiteral
 */
export function asStrokeType(type: string): StrokeTypeLiteral {
  const validTypes: StrokeTypeLiteral[] = [
    'line', 'polyline', 'wall', 'room', 'freehand', 
    'door', 'window', 'furniture', 'annotation', 'straight', 'other'
  ];
  
  return validTypes.includes(type as StrokeTypeLiteral) 
    ? (type as StrokeTypeLiteral) 
    : 'other';
}

/**
 * Type guard to validate RoomTypeLiteral
 * @param type Type to check
 * @returns Valid RoomTypeLiteral
 */
export function asRoomType(type: string): RoomTypeLiteral {
  const validTypes: RoomTypeLiteral[] = [
    'living', 'bedroom', 'kitchen', 'bathroom', 'office', 'other'
  ];
  
  return validTypes.includes(type as RoomTypeLiteral)
    ? (type as RoomTypeLiteral)
    : 'other';
}

/**
 * Create an empty floor plan with default values
 */
export function createEmptyFloorPlan(partial: Partial<FloorPlan> = {}): FloorPlan {
  const now = new Date().toISOString();
  return {
    id: partial.id || uuidv4(),
    name: partial.name || 'Untitled Floor Plan',
    label: partial.label || 'Untitled Floor Plan',
    walls: partial.walls || [],
    rooms: partial.rooms || [],
    strokes: partial.strokes || [],
    canvasData: partial.canvasData || null,
    canvasJson: partial.canvasJson || null,
    createdAt: partial.createdAt || now,
    updatedAt: partial.updatedAt || now,
    gia: partial.gia || 0,
    level: partial.level || 0,
    index: partial.index || 0,
    metadata: partial.metadata || {
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
    data: partial.data || {},  // Ensure data is always defined
    userId: partial.userId || 'default-user'  // Ensure userId is always defined
  };
}

/**
 * Create an empty stroke
 */
export function createEmptyStroke(partial: Partial<Stroke> = {}): Stroke {
  return {
    id: partial.id || uuidv4(),
    points: partial.points || [],
    type: partial.type || 'line',
    color: partial.color || '#000000',
    thickness: partial.thickness || 1,
    width: partial.width || 1
  };
}

/**
 * Create an empty wall
 */
export function createEmptyWall(partial: Partial<Wall> = {}): Wall {
  const start = partial.start || { x: 0, y: 0 };
  const end = partial.end || { x: 100, y: 0 };
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const length = Math.sqrt(dx * dx + dy * dy);
  
  return {
    id: partial.id || uuidv4(),
    points: partial.points || [start, end],
    start: start,
    end: end,
    thickness: partial.thickness || 5,
    color: partial.color || '#000000',
    roomIds: partial.roomIds || [],  // Ensure roomIds is always defined
    length: partial.length || length
  };
}

/**
 * Create an empty room
 */
export function createEmptyRoom(partial: Partial<Room> = {}): Room {
  return {
    id: partial.id || uuidv4(),
    name: partial.name || 'Unnamed Room',
    type: partial.type || 'other',
    points: partial.points || [],
    color: partial.color || '#ffffff',
    area: partial.area || 0,
    level: partial.level || 0,
    walls: partial.walls || []
  };
}

// Functions to create test objects with correct typing
export const createTestFloorPlan = createEmptyFloorPlan;
export const createTestStroke = createEmptyStroke;
export const createTestWall = createEmptyWall;
export const createTestRoom = createEmptyRoom;
export const createTestPoint = (x = 0, y = 0): Point => ({ x, y });

/**
 * Type barrel export
 * Re-export all types from this unified type module
 */
export type { Point, Stroke, Wall, Room, FloorPlan, FloorPlanMetadata };
export { PaperSize, asStrokeType, asRoomType };
