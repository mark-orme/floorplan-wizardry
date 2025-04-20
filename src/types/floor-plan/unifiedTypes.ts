
/**
 * Unified Types for Floor Plans
 * Central source of truth for all floor plan related types
 * @module types/floor-plan/unifiedTypes
 */

import { v4 as uuidv4 } from 'uuid';

// Console log for debugging module loading
console.log('Loading unified floor plan types');

/**
 * Standardized Point interface
 */
export interface Point {
  x: number;
  y: number;
}

/**
 * Stroke type literals - ensures all possible values are included
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
  'straight' |  // Crucial: Include 'straight' in both type definitions
  'other';

/**
 * Room type literals
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
 * Floor Plan Metadata interface
 */
export interface FloorPlanMetadata {
  createdAt?: string;
  updatedAt?: string;
  paperSize?: PaperSize | string;
  level?: number;
  // For backward compatibility
  version?: string;
  author?: string;
  dateCreated?: string;
  lastModified?: string;
  notes?: string;
}

/**
 * Stroke interface for floor plan annotations
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
 * Wall interface for floor plans
 */
export interface Wall {
  id: string;
  points: Point[];
  startPoint?: Point;
  endPoint?: Point;
  start: Point;
  end: Point;
  thickness: number;
  height?: number;
  color: string;
  roomIds: string[];
  length: number;
}

/**
 * Room interface for floor plans
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
  // CRITICAL: Required properties that were missing
  data: any; // Required property
  userId: string; // Required property
}

/**
 * Type guard to ensure a string is a valid StrokeTypeLiteral
 * Adds diagnostic logging for troubleshooting
 */
export function asStrokeType(type: string): StrokeTypeLiteral {
  const validTypes: StrokeTypeLiteral[] = [
    'line', 'polyline', 'wall', 'room', 'freehand', 
    'door', 'window', 'furniture', 'annotation', 'straight', 'other'
  ];
  
  const isValid = validTypes.includes(type as StrokeTypeLiteral);
  if (!isValid) {
    console.warn(`TypeGuard: Invalid stroke type "${type}" being converted to "line"`);
  }
  
  return isValid ? (type as StrokeTypeLiteral) : 'line';
}

/**
 * Type guard to ensure a string is a valid RoomTypeLiteral
 * Adds diagnostic logging for troubleshooting
 */
export function asRoomType(type: string): RoomTypeLiteral {
  const validTypes: RoomTypeLiteral[] = [
    'living', 'bedroom', 'kitchen', 'bathroom', 'office', 'other'
  ];
  
  const isValid = validTypes.includes(type as RoomTypeLiteral);
  if (!isValid) {
    console.warn(`TypeGuard: Invalid room type "${type}" being converted to "other"`);
  }
  
  return isValid ? (type as RoomTypeLiteral) : 'other';
}

/**
 * Diagnostic function to validate a FloorPlan object
 */
export function isValidFloorPlan(floorPlan: any): boolean {
  if (!floorPlan) return false;
  
  const hasRequiredProps = (
    typeof floorPlan.id === 'string' &&
    typeof floorPlan.name === 'string' &&
    typeof floorPlan.label === 'string' &&
    Array.isArray(floorPlan.walls) &&
    Array.isArray(floorPlan.rooms) &&
    Array.isArray(floorPlan.strokes) &&
    typeof floorPlan.data === 'object' &&
    typeof floorPlan.userId === 'string'
  );
  
  if (!hasRequiredProps) {
    console.warn('TypeValidator: FloorPlan missing required properties', {
      id: typeof floorPlan.id,
      name: typeof floorPlan.name,
      label: typeof floorPlan.label,
      walls: Array.isArray(floorPlan.walls),
      rooms: Array.isArray(floorPlan.rooms),
      strokes: Array.isArray(floorPlan.strokes),
      data: typeof floorPlan.data,
      userId: typeof floorPlan.userId
    });
  }
  
  return hasRequiredProps;
}

/**
 * Diagnostic function to validate a Stroke object
 */
export function isValidStroke(stroke: any): boolean {
  if (!stroke) return false;
  
  const isValid = (
    typeof stroke.id === 'string' &&
    Array.isArray(stroke.points) &&
    typeof stroke.color === 'string' &&
    typeof stroke.thickness === 'number' &&
    typeof stroke.width === 'number'
  );
  
  // Specifically validate the type field
  let typeValid = false;
  if (typeof stroke.type === 'string') {
    const validTypes: StrokeTypeLiteral[] = [
      'line', 'polyline', 'wall', 'room', 'freehand', 
      'door', 'window', 'furniture', 'annotation', 'straight', 'other'
    ];
    typeValid = validTypes.includes(stroke.type as StrokeTypeLiteral);
    
    if (!typeValid) {
      console.warn(`TypeValidator: Invalid stroke type "${stroke.type}"`);
    }
  }
  
  return isValid && typeValid;
}

/**
 * Diagnostic function to validate a Room object
 */
export function isValidRoom(room: any): boolean {
  if (!room) return false;
  
  const isValid = (
    typeof room.id === 'string' &&
    typeof room.name === 'string' &&
    Array.isArray(room.points) &&
    typeof room.color === 'string' &&
    typeof room.area === 'number' &&
    typeof room.level === 'number' &&
    Array.isArray(room.walls)
  );
  
  // Specifically validate the type field
  let typeValid = false;
  if (typeof room.type === 'string') {
    typeValid = ['living', 'bedroom', 'kitchen', 'bathroom', 'office', 'other'].includes(room.type);
    
    if (!typeValid) {
      console.warn(`TypeValidator: Invalid room type "${room.type}"`);
    }
  }
  
  return isValid && typeValid;
}

/**
 * Creates test floor plan with all required properties
 */
export function createTestFloorPlan(overrides: Partial<FloorPlan> = {}): FloorPlan {
  const now = new Date().toISOString();
  
  // Create default floor plan with ALL required fields
  const floorPlan: FloorPlan = {
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
      paperSize: 'A4',
      level: 0,
      version: "1.0",
      author: "Test User",
      dateCreated: now,
      lastModified: now,
      notes: ""
    },
    // CRITICAL: These fields can't be omitted
    data: overrides.data || {},
    userId: overrides.userId || 'test-user'
  };
  
  // Diagnostic logging to catch any missing fields
  if (!isValidFloorPlan(floorPlan)) {
    console.error('TypeValidator: Created test floor plan is invalid');
  }
  
  return floorPlan;
}

/**
 * Creates test room with type safety
 */
export function createTestRoom(overrides: Partial<Room> = {}): Room {
  // Ensure type is a valid RoomTypeLiteral using the type guard
  const typeValue = overrides.type || 'other';
  const validType: RoomTypeLiteral = typeof typeValue === 'string' 
    ? asRoomType(typeValue) 
    : typeValue;
  
  const room: Room = {
    id: overrides.id || `room-${Date.now()}`,
    name: overrides.name || 'Test Room',
    type: validType,
    points: overrides.points || [{ x: 0, y: 0 }, { x: 100, y: 0 }, { x: 100, y: 100 }, { x: 0, y: 100 }],
    color: overrides.color || '#ffffff',
    area: overrides.area || 10000,
    level: overrides.level || 0,
    walls: overrides.walls || []
  };
  
  if (!isValidRoom(room)) {
    console.error('TypeValidator: Created test room is invalid');
  }
  
  return room;
}

/**
 * Creates test stroke with type safety
 */
export function createTestStroke(overrides: Partial<Stroke> = {}): Stroke {
  // Ensure type is a valid StrokeTypeLiteral using the type guard
  const typeValue = overrides.type || 'line';
  const validType: StrokeTypeLiteral = typeof typeValue === 'string' 
    ? asStrokeType(typeValue) 
    : typeValue;
  
  const stroke: Stroke = {
    id: overrides.id || `stroke-${Date.now()}`,
    points: overrides.points || [{ x: 0, y: 0 }, { x: 100, y: 100 }],
    type: validType,
    color: overrides.color || '#000000',
    thickness: overrides.thickness || 2,
    width: overrides.width || 2
  };
  
  if (!isValidStroke(stroke)) {
    console.error('TypeValidator: Created test stroke is invalid');
  }
  
  return stroke;
}

/**
 * Creates test wall
 */
export function createTestWall(overrides: Partial<Wall> = {}): Wall {
  const start = overrides.start || { x: 0, y: 0 };
  const end = overrides.end || { x: 100, y: 0 };
  const points = overrides.points || [start, end];
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const length = Math.sqrt(dx * dx + dy * dy);
  
  return {
    id: overrides.id || `wall-${Date.now()}`,
    start,
    end,
    points,
    thickness: overrides.thickness || 5,
    color: overrides.color || '#000000',
    roomIds: overrides.roomIds || [], // Ensuring roomIds is always provided
    length: overrides.length || length
  };
}

/**
 * Creates a test point
 */
export function createTestPoint(x = 0, y = 0): Point {
  return { x, y };
}

/**
 * Creates an empty stroke with defaults
 */
export function createEmptyStroke(overrides: Partial<Stroke> = {}): Stroke {
  return createTestStroke(overrides);
}

/**
 * Creates an empty wall with defaults
 */
export function createEmptyWall(overrides: Partial<Wall> = {}): Wall {
  return createTestWall(overrides);
}

/**
 * Creates an empty room with defaults
 */
export function createEmptyRoom(overrides: Partial<Room> = {}): Room {
  return createTestRoom(overrides);
}

/**
 * Creates an empty floor plan with defaults
 */
export function createEmptyFloorPlan(overrides: Partial<FloorPlan> = {}): FloorPlan {
  return createTestFloorPlan(overrides);
}
