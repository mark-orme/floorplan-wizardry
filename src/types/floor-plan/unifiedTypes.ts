
/**
 * Unified Floor Plan type definitions
 * Central source of truth for all floor plan related types
 * @module types/floor-plan/unifiedTypes
 */
import { v4 as uuidv4 } from 'uuid';

/**
 * POINT TYPES
 */
export interface Point {
  x: number;
  y: number;
}

/**
 * PAPER SIZE
 */
export enum PaperSize {
  A3 = "A3",
  A4 = "A4",
  A5 = "A5",
  Letter = "Letter",
  Legal = "Legal",
  Tabloid = "Tabloid",
  Custom = "Custom"
}

/**
 * STROKE TYPES
 */
// Define valid stroke types
export type StrokeTypeLiteral = 'line' | 'curve' | 'straight' | 'freehand' | 'polyline' | 'wall' | 'door' | 'window' | 'furniture' | 'annotation';

/**
 * Type guard to ensure string is a valid StrokeTypeLiteral
 */
export function asStrokeType(type: string): StrokeTypeLiteral {
  const validTypes: StrokeTypeLiteral[] = ['line', 'curve', 'straight', 'freehand', 'polyline', 'wall', 'door', 'window', 'furniture', 'annotation'];
  
  return validTypes.includes(type as StrokeTypeLiteral) 
    ? (type as StrokeTypeLiteral) 
    : 'line';
}

/**
 * Stroke interface for annotations
 */
export interface Stroke {
  /** Unique identifier */
  id: string;
  
  /** Stroke points */
  points: Point[];
  
  /** Stroke type */
  type: StrokeTypeLiteral;
  
  /** Stroke color */
  color: string;
  
  /** Stroke thickness */
  thickness: number;
  
  /** Stroke width (same as thickness for compatibility) */
  width?: number;
}

/**
 * ROOM TYPES
 */
// Define valid room types
export type RoomTypeLiteral = 'living' | 'kitchen' | 'bedroom' | 'bathroom' | 'dining' | 'office' | 'hallway' | 'other';

/**
 * Type guard to ensure string is a valid RoomTypeLiteral
 */
export function asRoomType(type: string): RoomTypeLiteral {
  const validTypes: RoomTypeLiteral[] = ['living', 'kitchen', 'bedroom', 'bathroom', 'dining', 'office', 'hallway', 'other'];
  
  return validTypes.includes(type as RoomTypeLiteral) 
    ? (type as RoomTypeLiteral) 
    : 'other';
}

/**
 * Room interface
 */
export interface Room {
  /** Unique identifier */
  id: string;
  
  /** Room name */
  name: string;
  
  /** Room type */
  type: RoomTypeLiteral;
  
  /** Room area in square meters */
  area: number;
  
  /** Boundary points */
  points: Point[];
  
  /** Fill color */
  color: string;
  
  /** Floor level this room belongs to */
  level: number;
  
  /** Wall IDs associated with this room */
  walls: string[];
}

/**
 * WALL TYPES
 */
export interface Wall {
  /** Unique identifier */
  id: string;
  
  /** Start point coordinates */
  start: Point;
  
  /** End point coordinates */
  end: Point;
  
  /** Wall thickness in pixels */
  thickness: number;
  
  /** Wall color */
  color: string;
  
  /** Wall height in pixels (optional) */
  height?: number;
  
  /** Associated room IDs */
  roomIds: string[];
  
  /** Length of the wall (calculated property) */
  length: number;
  
  /** Points array for compatibility */
  points?: Point[];
}

/**
 * FLOOR PLAN METADATA
 */
export interface FloorPlanMetadata {
  /** Creation date timestamp */
  createdAt: string;
  
  /** Last update timestamp */
  updatedAt: string;
  
  /** Paper size for printing */
  paperSize: PaperSize | string;
  
  /** Floor level (0 = ground floor) */
  level: number;
  
  /** Schema version */
  version: string;
  
  /** Author of the floor plan */
  author: string;
  
  /** Date created (ISO string) */
  dateCreated: string;
  
  /** Last modified date (ISO string) */
  lastModified: string;
  
  /** Additional notes */
  notes: string;
}

/**
 * FLOOR PLAN
 */
export interface FloorPlan {
  /** Unique identifier */
  id: string;
  
  /** Floor plan name */
  name: string;
  
  /** Display label */
  label: string;
  
  /** Floor index for compatibility with app FloorPlan */
  index?: number;
  
  /** Walls in the floor plan */
  walls: Wall[];
  
  /** Rooms in the floor plan */
  rooms: Room[];
  
  /** Annotations and drawings */
  strokes: Stroke[];
  
  /** Serialized canvas data (optional) */
  canvasData: string | null;
  
  /** Canvas JSON serialization for fabric.js */
  canvasJson?: string | null;
  
  /** Creation timestamp */
  createdAt: string;
  
  /** Last update timestamp */
  updatedAt: string;
  
  /** Gross internal area in square meters */
  gia: number;
  
  /** Floor level (0 = ground floor) */
  level: number;
  
  /** Metadata */
  metadata: FloorPlanMetadata;
  
  /** Additional data for the floor plan (required) */
  data: any;
  
  /** User ID who owns the floor plan (required) */
  userId: string;
  
  /** Canvas state (optional, for tests) */
  canvasState?: any;
}

/**
 * FACTORY FUNCTIONS
 */

/**
 * Create an empty stroke
 */
export function createEmptyStroke(type: StrokeTypeLiteral = 'line'): Stroke {
  return {
    id: uuidv4(),
    points: [],
    type,
    color: '#000000',
    thickness: 2,
    width: 2
  };
}

/**
 * Create an empty wall
 */
export function createEmptyWall(): Wall {
  const start = { x: 0, y: 0 };
  const end = { x: 100, y: 0 };
  
  return {
    id: uuidv4(),
    start,
    end,
    points: [start, end],
    thickness: 5,
    color: '#000000',
    roomIds: [],
    length: 100
  };
}

/**
 * Create an empty room
 */
export function createEmptyRoom(type: RoomTypeLiteral = 'other'): Room {
  return {
    id: uuidv4(),
    name: 'Unnamed Room',
    type,
    area: 0,
    points: [],
    color: '#ffffff',
    level: 0,
    walls: []
  };
}

/**
 * Create default floor plan metadata
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
    metadata: createDefaultMetadata(),
    data: {},
    userId: ''
  };
}

/**
 * TEST DATA CREATION
 */

/**
 * Create a test point
 */
export function createTestPoint(x = 0, y = 0): Point {
  return { x, y };
}

/**
 * Create a test stroke
 */
export function createTestStroke(overrides: Partial<Stroke> = {}): Stroke {
  const typeValue = overrides.type || 'line';
  const validType: StrokeTypeLiteral = typeof typeValue === 'string' 
    ? asStrokeType(typeValue) 
    : typeValue;
  
  return {
    id: overrides.id || `stroke-${Date.now()}`,
    points: overrides.points || [{ x: 0, y: 0 }, { x: 100, y: 100 }],
    type: validType,
    color: overrides.color || '#000000',
    thickness: overrides.thickness || 2,
    width: overrides.width || 2,
    ...overrides
  };
}

/**
 * Create a test wall
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
 * Create a test room
 */
export function createTestRoom(overrides: Partial<Room> = {}): Room {
  const typeValue = overrides.type || 'other';
  const validType: RoomTypeLiteral = typeof typeValue === 'string' 
    ? asRoomType(typeValue) 
    : typeValue;
  
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
 * Create a test floor plan
 */
export function createTestFloorPlan(overrides: Partial<FloorPlan> = {}): FloorPlan {
  const now = new Date().toISOString();
  
  return {
    id: overrides.id || `test-fp-${Date.now()}`,
    name: overrides.name || 'Test Floor Plan',
    label: overrides.label || 'Test Floor Plan',
    data: overrides.data || {},
    userId: overrides.userId || 'test-user',
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
      paperSize: PaperSize.A4,
      level: 0,
      version: "1.0",
      author: "Test User",
      dateCreated: now,
      lastModified: now,
      notes: ""
    },
    ...overrides
  };
}
