
/**
 * Unified Floor Plan Types
 * Central type definitions for the entire application
 * @module types/floor-plan/unifiedTypes
 */
import { v4 as uuidv4 } from 'uuid';

/**
 * Point interface for geometry
 */
export interface Point {
  x: number;
  y: number;
}

/**
 * Paper size enum for floor plans
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
 * Floor plan metadata interface
 */
export interface FloorPlanMetadata {
  /** Creation date timestamp */
  createdAt: string;
  
  /** Last update timestamp */
  updatedAt: string;
  
  /** Paper size for printing */
  paperSize: PaperSize;
  
  /** Floor level (0 = ground floor) */
  level: number;
  
  /** Legacy fields for backward compatibility */
  version?: string;
  author?: string;
  dateCreated?: string;
  lastModified?: string;
  notes?: string;
}

/**
 * Stroke type literal for annotations
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
 * Room type literal for rooms
 */
export type RoomTypeLiteral = 
  | 'living' 
  | 'bedroom' 
  | 'kitchen' 
  | 'bathroom' 
  | 'office' 
  | 'other';

/**
 * Validates and converts a string to a valid StrokeTypeLiteral
 * @param type String to validate
 * @returns Valid StrokeTypeLiteral
 */
export function asStrokeType(type: string): StrokeTypeLiteral {
  // Valid stroke types array
  const validTypes: StrokeTypeLiteral[] = [
    'line', 'polyline', 'wall', 'door', 'window', 
    'furniture', 'annotation', 'freehand', 'straight',
    'room', 'dimension', 'text', 'other'
  ];
  
  // Return the type if it's valid, or 'other' as fallback
  return validTypes.includes(type as StrokeTypeLiteral) 
    ? (type as StrokeTypeLiteral) 
    : 'other';
}

/**
 * Validates and converts a string to a valid RoomTypeLiteral
 * @param type String to validate
 * @returns Valid RoomTypeLiteral
 */
export function asRoomType(type: string): RoomTypeLiteral {
  // Valid room types array
  const validTypes: RoomTypeLiteral[] = [
    'living', 'bedroom', 'kitchen', 'bathroom', 'office', 'other'
  ];
  
  // Return the type if it's valid, or 'other' as fallback
  return validTypes.includes(type as RoomTypeLiteral) 
    ? (type as RoomTypeLiteral) 
    : 'other';
}

/**
 * Wall interface for floor plan
 */
export interface Wall {
  /** Unique identifier */
  id: string;
  
  /** Start point */
  start: Point;
  
  /** End point */
  end: Point;
  
  /** Wall thickness */
  thickness: number;
  
  /** Wall color (required) */
  color: string;
  
  /** Wall height (optional) */
  height?: number;
  
  /** Associated room IDs (required) */
  roomIds: string[];
  
  /** Length of the wall */
  length: number;
  
  /** Points array (convenience property) */
  points?: Point[];
}

/**
 * Room interface for floor plan
 */
export interface Room {
  /** Unique identifier */
  id: string;
  
  /** Room name */
  name: string;
  
  /** Room type */
  type: RoomTypeLiteral;
  
  /** Room area */
  area: number;
  
  /** Boundary points */
  points: Point[];
  
  /** Fill color */
  color: string;
  
  /** Floor level */
  level: number;
  
  /** Wall IDs */
  walls: string[];
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
  
  /** Stroke width (same as thickness) */
  width: number;
}

/**
 * Floor plan interface
 */
export interface FloorPlan {
  /** Unique identifier */
  id: string;
  
  /** Floor plan name */
  name: string;
  
  /** Display label */
  label: string;
  
  /** Walls in the floor plan */
  walls: Wall[];
  
  /** Rooms in the floor plan */
  rooms: Room[];
  
  /** Annotations and drawings */
  strokes: Stroke[];
  
  /** Serialized canvas data */
  canvasData: string | null;
  
  /** Canvas JSON serialization */
  canvasJson: string | null;
  
  /** Creation timestamp */
  createdAt: string;
  
  /** Last update timestamp */
  updatedAt: string;
  
  /** Gross internal area */
  gia: number;
  
  /** Floor level */
  level: number;
  
  /** Floor index */
  index: number;
  
  /** Metadata */
  metadata: FloorPlanMetadata;
  
  /** Additional data for the floor plan (REQUIRED) */
  data: any;
  
  /** User ID who owns the floor plan (REQUIRED) */
  userId: string;
}

/**
 * Creates an empty floor plan with default values
 * @param partialFloorPlan Optional partial floor plan to extend
 * @returns Complete floor plan
 */
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
    metadata: partialFloorPlan.metadata || {
      createdAt: now,
      updatedAt: now,
      paperSize: PaperSize.A4,
      level: 0,
      version: '1.0',
      author: '',
      dateCreated: now,
      lastModified: now,
      notes: ''
    },
    data: partialFloorPlan.data || {},
    userId: partialFloorPlan.userId || 'test-user'
  };
}

/**
 * Creates an empty wall with default values
 * @param partialWall Optional partial wall to extend
 * @returns Complete wall
 */
export function createEmptyWall(partialWall: Partial<Wall> = {}): Wall {
  const start = partialWall.start || { x: 0, y: 0 };
  const end = partialWall.end || { x: 100, y: 0 };
  
  // Calculate length
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const length = partialWall.length !== undefined ? 
    partialWall.length : 
    Math.sqrt(dx * dx + dy * dy);
  
  return {
    id: partialWall.id || uuidv4(),
    start,
    end,
    thickness: partialWall.thickness || 2,
    color: partialWall.color || '#000000',
    height: partialWall.height,
    roomIds: partialWall.roomIds || [],
    length,
    points: partialWall.points || [start, end]
  };
}

/**
 * Creates an empty room with default values
 * @param partialRoom Optional partial room to extend
 * @returns Complete room
 */
export function createEmptyRoom(partialRoom: Partial<Room> = {}): Room {
  const defaultPoints = [
    { x: 0, y: 0 },
    { x: 100, y: 0 },
    { x: 100, y: 100 },
    { x: 0, y: 100 }
  ];
  
  return {
    id: partialRoom.id || uuidv4(),
    name: partialRoom.name || 'Unnamed Room',
    type: partialRoom.type || 'other',
    area: partialRoom.area || 0,
    points: partialRoom.points || defaultPoints,
    color: partialRoom.color || '#ffffff',
    level: partialRoom.level || 0,
    walls: partialRoom.walls || []
  };
}

/**
 * Creates an empty stroke with default values
 * @param partialStroke Optional partial stroke to extend
 * @returns Complete stroke
 */
export function createEmptyStroke(partialStroke: Partial<Stroke> = {}): Stroke {
  const defaultPoints = [
    { x: 0, y: 0 },
    { x: 100, y: 100 }
  ];
  
  const type = partialStroke.type || 'line';
  
  return {
    id: partialStroke.id || uuidv4(),
    points: partialStroke.points || defaultPoints,
    type: typeof type === 'string' ? asStrokeType(type) : type,
    color: partialStroke.color || '#000000',
    thickness: partialStroke.thickness || 2,
    width: partialStroke.width || partialStroke.thickness || 2
  };
}

/**
 * Creates a test floor plan with sample data
 * @returns Test floor plan
 */
export function createTestFloorPlan(): FloorPlan {
  const now = new Date().toISOString();
  
  return {
    id: `test-floor-plan-${Date.now()}`,
    name: 'Test Floor Plan',
    label: 'Test Floor Plan',
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
    data: {},
    userId: 'test-user'
  };
}

/**
 * Creates a test wall with sample data
 * @returns Test wall
 */
export function createTestWall(): Wall {
  return {
    id: `test-wall-${Date.now()}`,
    start: { x: 0, y: 0 },
    end: { x: 100, y: 0 },
    thickness: 2,
    color: '#000000',
    length: 100,
    roomIds: []
  };
}

/**
 * Creates a test room with sample data
 * @returns Test room
 */
export function createTestRoom(): Room {
  return {
    id: `test-room-${Date.now()}`,
    name: 'Test Room',
    type: 'other',
    area: 10000,
    points: [
      { x: 0, y: 0 },
      { x: 100, y: 0 },
      { x: 100, y: 100 },
      { x: 0, y: 100 }
    ],
    color: '#ffffff',
    level: 0,
    walls: []
  };
}

/**
 * Creates a test stroke with sample data
 * @returns Test stroke
 */
export function createTestStroke(): Stroke {
  return {
    id: `test-stroke-${Date.now()}`,
    points: [
      { x: 0, y: 0 },
      { x: 100, y: 100 }
    ],
    type: 'line',
    color: '#000000',
    thickness: 2,
    width: 2
  };
}

/**
 * Creates a test point with sample data
 * @param x X coordinate
 * @param y Y coordinate
 * @returns Test point
 */
export function createTestPoint(x = 0, y = 0): Point {
  return { x, y };
}
