
/**
 * Unified Floor Plan Types
 * @module types/floor-plan/unifiedTypes
 */
import { v4 as uuidv4 } from 'uuid';
import { StrokeTypeLiteral, RoomTypeLiteral, PaperSize } from './basicTypes';

// Export the point interface
export interface Point {
  x: number;
  y: number;
}

// Export stroke types
export { StrokeTypeLiteral };

// Export room types
export { RoomTypeLiteral };

// Re-export paper size
export { PaperSize };

// Export the floor plan metadata interface
export interface FloorPlanMetadata {
  version?: string;
  author?: string;
  dateCreated?: string;
  lastModified?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
  paperSize?: PaperSize | string;
  level?: number;
  id?: string;
  name?: string;
  thumbnail?: string;
}

// Export the stroke interface
export interface Stroke {
  id: string;
  points: Point[];
  type: StrokeTypeLiteral;
  color: string;
  thickness: number;
  width: number;
}

// Export the wall interface
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

// Export the room interface
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

// Export the floor plan interface
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
  // CRITICAL: These properties must be present for compatibility
  data: any;
  userId: string;
}

/**
 * Validates if a given string is a valid StrokeTypeLiteral
 * @param type String to validate
 * @returns StrokeTypeLiteral
 */
export function asStrokeType(type: string): StrokeTypeLiteral {
  const validTypes: StrokeTypeLiteral[] = [
    'line', 'polyline', 'wall', 'room', 'freehand', 
    'door', 'window', 'furniture', 'annotation', 'straight', 'other'
  ];
  
  if (validTypes.includes(type as StrokeTypeLiteral)) {
    return type as StrokeTypeLiteral;
  }
  
  console.warn(`Invalid stroke type: "${type}", defaulting to "line"`);
  return 'line';
}

/**
 * Validates if a given string is a valid RoomTypeLiteral
 * @param type String to validate
 * @returns RoomTypeLiteral
 */
export function asRoomType(type: string): RoomTypeLiteral {
  const validTypes: RoomTypeLiteral[] = [
    'living', 'bedroom', 'kitchen', 'bathroom', 'office', 'other'
  ];
  
  if (validTypes.includes(type as RoomTypeLiteral)) {
    return type as RoomTypeLiteral;
  }
  
  console.warn(`Invalid room type: "${type}", defaulting to "other"`);
  return 'other';
}

/**
 * Creates an empty floor plan with default values
 * @returns Empty floor plan
 */
export function createEmptyFloorPlan(): FloorPlan {
  const now = new Date().toISOString();
  return {
    id: uuidv4(),
    name: 'Untitled Floor Plan',
    label: 'Untitled Floor Plan',
    walls: [],
    rooms: [],
    strokes: [],
    canvasData: null,
    canvasJson: null,
    createdAt: now,
    updatedAt: now,
    gia: 0,
    level: 0,
    index: 0,
    metadata: {
      version: '1.0',
      author: '',
      dateCreated: now,
      lastModified: now,
      notes: '',
      createdAt: now,
      updatedAt: now,
      paperSize: PaperSize.A4,
      level: 0
    },
    // CRITICAL: These properties must be present for compatibility
    data: {},
    userId: 'default-user'
  };
}

/**
 * Creates an empty stroke with default values
 * @returns Empty stroke
 */
export function createEmptyStroke(): Stroke {
  return {
    id: uuidv4(),
    points: [],
    type: 'line',
    color: '#000000',
    thickness: 2,
    width: 2
  };
}

/**
 * Creates an empty wall with default values
 * @returns Empty wall
 */
export function createEmptyWall(): Wall {
  return {
    id: uuidv4(),
    points: [],
    start: { x: 0, y: 0 },
    end: { x: 100, y: 0 },
    thickness: 10,
    color: '#000000',
    roomIds: [],
    length: 100
  };
}

/**
 * Creates an empty room with default values
 * @returns Empty room
 */
export function createEmptyRoom(): Room {
  return {
    id: uuidv4(),
    name: 'New Room',
    type: 'other',
    points: [],
    color: '#F5F5F5',
    area: 0,
    level: 0,
    walls: []
  };
}

/**
 * Creates a test point
 * @param x X coordinate
 * @param y Y coordinate
 * @returns Point object
 */
export function createTestPoint(x = 0, y = 0): Point {
  return { x, y };
}

/**
 * Creates a test stroke with the specified properties
 * @param overrides Properties to override defaults
 * @returns Stroke object
 */
export function createTestStroke(overrides: Partial<Stroke> = {}): Stroke {
  const typeValue = overrides.type || 'line';
  const validType = typeof typeValue === 'string' ? asStrokeType(typeValue) : typeValue;
  
  return {
    id: overrides.id || `stroke-${Date.now()}`,
    points: overrides.points || [{ x: 0, y: 0 }, { x: 100, y: 100 }],
    type: validType,
    color: overrides.color || '#000000',
    thickness: overrides.thickness || 2,
    width: overrides.width || overrides.thickness || 2,
    ...overrides
  };
}

/**
 * Creates a test wall with the specified properties
 * @param overrides Properties to override defaults
 * @returns Wall object
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
    roomIds: overrides.roomIds || [],
    length: overrides.length || length,
    ...overrides
  };
}

/**
 * Creates a test room with the specified properties
 * @param overrides Properties to override defaults
 * @returns Room object
 */
export function createTestRoom(overrides: Partial<Room> = {}): Room {
  const typeValue = overrides.type || 'other';
  const validType = typeof typeValue === 'string' ? asRoomType(typeValue) : typeValue;
  
  return {
    id: overrides.id || `room-${Date.now()}`,
    name: overrides.name || 'Test Room',
    type: validType,
    points: overrides.points || [{ x: 0, y: 0 }, { x: 100, y: 0 }, { x: 100, y: 100 }, { x: 0, y: 100 }],
    color: overrides.color || '#ffffff',
    area: overrides.area || 10000,
    level: overrides.level || 0,
    walls: overrides.walls || [],
    ...overrides
  };
}

/**
 * Creates a test floor plan with the specified properties
 * @param overrides Properties to override defaults
 * @returns FloorPlan object
 */
export function createTestFloorPlan(overrides: Partial<FloorPlan> = {}): FloorPlan {
  const now = new Date().toISOString();
  
  return {
    id: overrides.id || `test-fp-${Date.now()}`,
    name: overrides.name || 'Test Floor Plan',
    label: overrides.label || 'Test Floor Plan',
    walls: overrides.walls || [],
    rooms: overrides.rooms || [],
    strokes: overrides.strokes || [],
    canvasJson: overrides.canvasJson || null,
    canvasData: overrides.canvasData || null,
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
    // CRITICAL: These properties must be present for compatibility
    data: overrides.data || {},
    userId: overrides.userId || 'test-user',
    ...overrides
  };
}

/**
 * Console log for debugging imports
 */
console.log('Loading unified floor plan types');
