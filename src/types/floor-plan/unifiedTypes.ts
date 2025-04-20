
/**
 * Unified Floor Plan Type Definitions
 * Central module for floor plan type definitions
 * @module types/floor-plan/unifiedTypes
 */
import { v4 as uuidv4 } from 'uuid';

/**
 * 2D Point coordinates
 */
export interface Point {
  x: number;
  y: number;
}

/**
 * Stroke type literals
 */
export type StrokeTypeLiteral = 'line' | 'wall' | 'door' | 'window' | 'furniture' | 'annotation' | 'polyline';

/**
 * Room type literals
 */
export type RoomTypeLiteral = 'living' | 'bedroom' | 'kitchen' | 'bathroom' | 'office' | 'other';

/**
 * PaperSize enum for floor plans
 */
export enum PaperSize {
  A3 = 'A3',
  A4 = 'A4',
  Letter = 'Letter',
  Legal = 'Legal',
  Tabloid = 'Tabloid'
}

/**
 * Convert string to StrokeTypeLiteral
 * @param type Type string
 * @returns Stroke type literal
 */
export function asStrokeType(type: string): StrokeTypeLiteral {
  const validTypes: StrokeTypeLiteral[] = ['line', 'wall', 'door', 'window', 'furniture', 'annotation', 'polyline'];
  return validTypes.includes(type as StrokeTypeLiteral) ? type as StrokeTypeLiteral : 'line';
}

/**
 * Convert string to RoomTypeLiteral
 * @param type Type string
 * @returns Room type literal
 */
export function asRoomType(type: string): RoomTypeLiteral {
  const validTypes: RoomTypeLiteral[] = ['living', 'bedroom', 'kitchen', 'bathroom', 'office', 'other'];
  return validTypes.includes(type as RoomTypeLiteral) ? type as RoomTypeLiteral : 'other';
}

/**
 * Stroke definition
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
 * Wall definition
 */
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

/**
 * Room definition
 */
export interface Room {
  id: string;
  name: string;
  type: RoomTypeLiteral;
  area: number;
  vertices: Point[];
  perimeter: number;
  labelPosition: Point;
  center: Point;
  color: string;
}

/**
 * Floor plan metadata
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
 * Floor plan definition
 */
export interface FloorPlan {
  id: string;
  name: string;
  label?: string;
  walls: Wall[];
  rooms: Room[];
  strokes: Stroke[];
  canvasData: any | null;
  canvasJson: string | null;
  canvasState?: string | null;
  createdAt: string;
  updatedAt: string;
  gia: number;
  level: number;
  index: number;
  metadata: FloorPlanMetadata;
  data: any;
  userId: string;
}

/**
 * Create an empty stroke
 * @param overrides Properties to override defaults
 * @returns Empty stroke
 */
export function createEmptyStroke(overrides: Partial<Stroke> = {}): Stroke {
  return {
    id: overrides.id || uuidv4(),
    points: overrides.points || [],
    type: overrides.type || 'line',
    color: overrides.color || '#000000',
    thickness: overrides.thickness || 1,
    width: overrides.width || overrides.thickness || 1
  };
}

/**
 * Create an empty wall
 * @param overrides Properties to override defaults
 * @returns Empty wall
 */
export function createEmptyWall(overrides: Partial<Wall> = {}): Wall {
  const start = overrides.start || { x: 0, y: 0 };
  const end = overrides.end || { x: 100, y: 0 };
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  
  return {
    id: overrides.id || uuidv4(),
    start,
    end,
    thickness: overrides.thickness || 5,
    length: overrides.length || Math.sqrt(dx * dx + dy * dy),
    color: overrides.color || '#000000',
    roomIds: overrides.roomIds || [],
    height: overrides.height
  };
}

/**
 * Create an empty room
 * @param overrides Properties to override defaults
 * @returns Empty room
 */
export function createEmptyRoom(overrides: Partial<Room> = {}): Room {
  return {
    id: overrides.id || uuidv4(),
    name: overrides.name || 'New Room',
    type: overrides.type || 'other',
    area: overrides.area || 0,
    vertices: overrides.vertices || [
      { x: 0, y: 0 },
      { x: 100, y: 0 },
      { x: 100, y: 100 },
      { x: 0, y: 100 }
    ],
    perimeter: overrides.perimeter || 400,
    labelPosition: overrides.labelPosition || { x: 50, y: 50 },
    center: overrides.center || { x: 50, y: 50 },
    color: overrides.color || '#ffffff'
  };
}

/**
 * Create default metadata
 * @param level Floor level
 * @returns Default metadata
 */
export function createDefaultMetadata(level: number = 0): FloorPlanMetadata {
  const now = new Date().toISOString();
  return {
    createdAt: now,
    updatedAt: now,
    paperSize: PaperSize.A4,
    level,
    version: '1.0',
    author: '',
    dateCreated: now,
    lastModified: now,
    notes: ''
  };
}

/**
 * Create an empty floor plan
 * @param overrides Properties to override defaults
 * @returns Empty floor plan
 */
export function createEmptyFloorPlan(overrides: Partial<FloorPlan> = {}): FloorPlan {
  const now = new Date().toISOString();
  const level = typeof overrides.level === 'number' ? overrides.level : 0;
  
  return {
    id: overrides.id || uuidv4(),
    name: overrides.name || 'New Floor Plan',
    label: overrides.label || 'New Floor Plan',
    walls: overrides.walls || [],
    rooms: overrides.rooms || [],
    strokes: overrides.strokes || [],
    canvasData: overrides.canvasData || null,
    canvasJson: overrides.canvasJson || null,
    canvasState: overrides.canvasState || null,
    createdAt: overrides.createdAt || now,
    updatedAt: overrides.updatedAt || now,
    gia: overrides.gia || 0,
    level,
    index: overrides.index || level,
    metadata: overrides.metadata || createDefaultMetadata(level),
    data: overrides.data || {},
    userId: overrides.userId || 'default-user'
  };
}

/**
 * Create a test floor plan (alias for createEmptyFloorPlan for backward compatibility)
 * @param overrides Properties to override defaults
 * @returns Test floor plan
 */
export const createTestFloorPlan = createEmptyFloorPlan;
