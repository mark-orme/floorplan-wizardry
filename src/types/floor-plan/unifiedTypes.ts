/**
 * Unified Floor Plan Types
 * Central source of truth for all floor plan-related types
 * @module types/floor-plan/unifiedTypes
 */
import { v4 as uuidv4 } from 'uuid';

/**
 * Point interface for coordinates
 */
export interface Point {
  x: number;
  y: number;
}

/**
 * Paper size enum
 */
export enum PaperSize {
  A4 = 'A4',
  A3 = 'A3',
  A2 = 'A2',
  A1 = 'A1',
  A0 = 'A0',
  LETTER = 'LETTER',
  LEGAL = 'LEGAL',
  TABLOID = 'TABLOID',
  CUSTOM = 'CUSTOM'
}

/**
 * Stroke type as string literal union
 */
export type StrokeTypeLiteral = 'line' | 'freehand' | 'straight' | 'polyline' | 'circle' | 'rectangle' | 'arrow' | 'text' | 'dimension';

/**
 * Room type as string literal union
 */
export type RoomTypeLiteral = 'living' | 'bedroom' | 'kitchen' | 'bathroom' | 'office' | 'other';

/**
 * Type validation for stroke types
 * Ensures that string values are converted to valid StrokeTypeLiteral
 */
export function asStrokeType(type: string): StrokeTypeLiteral {
  const validTypes: StrokeTypeLiteral[] = ['line', 'freehand', 'straight', 'polyline', 'circle', 'rectangle', 'arrow', 'text', 'dimension'];
  return validTypes.includes(type as StrokeTypeLiteral) 
    ? (type as StrokeTypeLiteral) 
    : 'line';
}

/**
 * Type validation for room types
 * Ensures that string values are converted to valid RoomTypeLiteral
 */
export function asRoomType(type: string): RoomTypeLiteral {
  const validTypes: RoomTypeLiteral[] = ['living', 'bedroom', 'kitchen', 'bathroom', 'office', 'other'];
  return validTypes.includes(type as RoomTypeLiteral) 
    ? (type as RoomTypeLiteral) 
    : 'other';
}

/**
 * Stroke interface
 */
export interface Stroke {
  /** Unique identifier */
  id: string;
  
  /** Array of points defining the stroke */
  points: Point[];
  
  /** Type of stroke */
  type: StrokeTypeLiteral;
  
  /** Color of the stroke */
  color: string;
  
  /** Thickness of the stroke in pixels */
  thickness: number;
  
  /** Width of the stroke (same as thickness for compatibility) */
  width: number;
}

/**
 * Wall interface
 */
export interface Wall {
  /** Unique identifier */
  id: string;
  
  /** Start point of the wall */
  start: Point;
  
  /** End point of the wall */
  end: Point;
  
  /** Wall thickness in pixels */
  thickness: number;
  
  /** Wall color */
  color: string;
  
  /** Array of points (for compatibility) */
  points?: Point[];
  
  /** Height of the wall (optional) */
  height?: number;
  
  /** Associated room IDs (required) */
  roomIds: string[];
  
  /** Length of the wall in pixels */
  length: number;
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
  
  /** Array of points defining room boundary */
  points: Point[];
  
  /** Room fill color */
  color: string;
  
  /** Room area in square meters */
  area: number;
  
  /** Floor level this room is on */
  level: number;
  
  /** Array of wall IDs associated with this room */
  walls: string[];
}

/**
 * Floor plan metadata interface
 */
export interface FloorPlanMetadata {
  /** Creation timestamp */
  createdAt: string;
  
  /** Last update timestamp */
  updatedAt: string;
  
  /** Paper size */
  paperSize: PaperSize;
  
  /** Floor level */
  level: number;
  
  /** Version number */
  version?: string;
  
  /** Author */
  author?: string;
  
  /** Date created (formatted) */
  dateCreated?: string;
  
  /** Last modified (formatted) */
  lastModified?: string;
  
  /** Notes */
  notes?: string;
}

/**
 * Canvas state for internal use by canvas controller
 */
export interface CanvasState {
  /** Zoom level */
  zoom: number;
  
  /** Viewport offset */
  offset: Point;
  
  /** Canvas width */
  width: number;
  
  /** Canvas height */
  height: number;
  
  /** Background color */
  backgroundColor?: string;
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
  
  /** Array of walls */
  walls: Wall[];
  
  /** Array of rooms */
  rooms: Room[];
  
  /** Array of strokes */
  strokes: Stroke[];
  
  /** Serialized canvas data */
  canvasData: any | null;
  
  /** Canvas JSON serialization */
  canvasJson: string | null;
  
  /** Creation timestamp */
  createdAt: string;
  
  /** Last update timestamp */
  updatedAt: string;
  
  /** Gross internal area in square meters */
  gia: number;
  
  /** Floor level (0 = ground floor) */
  level: number;
  
  /** Floor index (same as level for compatibility) */
  index: number;
  
  /** Floor plan metadata */
  metadata: FloorPlanMetadata;
  
  /** Additional data for the floor plan (required) */
  data: any;
  
  /** User ID who owns the floor plan (required) */
  userId: string;
  
  /** Canvas state (for internal use by canvas controller) */
  canvasState?: CanvasState;
}

/**
 * Create an empty floor plan with default values
 * @param partialFloorPlan Partial floor plan to use as base
 * @returns Complete floor plan with defaults
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
      level: partialFloorPlan.level || 0
    },
    // CRITICAL: Always include these required properties
    data: partialFloorPlan.data || {},
    userId: partialFloorPlan.userId || 'default-user',
    // Add canvasState if provided
    canvasState: partialFloorPlan.canvasState
  };
}

/**
 * Create an empty wall with default values
 * @param partialWall Partial wall to use as base
 * @returns Complete wall with defaults
 */
export function createEmptyWall(partialWall: Partial<Wall> = {}): Wall {
  // Calculate length if start and end are provided
  let length = 0;
  if (partialWall.start && partialWall.end) {
    const dx = partialWall.end.x - partialWall.start.x;
    const dy = partialWall.end.y - partialWall.start.y;
    length = Math.sqrt(dx * dx + dy * dy);
  }

  return {
    id: partialWall.id || uuidv4(),
    start: partialWall.start || { x: 0, y: 0 },
    end: partialWall.end || { x: 100, y: 0 },
    thickness: partialWall.thickness || 5,
    color: partialWall.color || '#000000',
    points: partialWall.points || [
      partialWall.start || { x: 0, y: 0 },
      partialWall.end || { x: 100, y: 0 }
    ],
    height: partialWall.height,
    // CRITICAL: Always include roomIds
    roomIds: partialWall.roomIds || [],
    length: partialWall.length || length
  };
}

/**
 * Create an empty stroke with default values
 * @param partialStroke Partial stroke to use as base
 * @returns Complete stroke with defaults
 */
export function createEmptyStroke(partialStroke: Partial<Stroke> = {}): Stroke {
  return {
    id: partialStroke.id || uuidv4(),
    points: partialStroke.points || [{ x: 0, y: 0 }, { x: 100, y: 100 }],
    type: partialStroke.type ? asStrokeType(partialStroke.type as string) : 'line',
    color: partialStroke.color || '#000000',
    thickness: partialStroke.thickness || 2,
    width: partialStroke.width || partialStroke.thickness || 2
  };
}

/**
 * Create an empty room with default values
 * @param partialRoom Partial room to use as base
 * @returns Complete room with defaults
 */
export function createEmptyRoom(partialRoom: Partial<Room> = {}): Room {
  return {
    id: partialRoom.id || uuidv4(),
    name: partialRoom.name || 'Unnamed Room',
    type: partialRoom.type ? asRoomType(partialRoom.type as string) : 'other',
    points: partialRoom.points || [
      { x: 0, y: 0 },
      { x: 100, y: 0 },
      { x: 100, y: 100 },
      { x: 0, y: 100 }
    ],
    color: partialRoom.color || '#ffffff',
    area: partialRoom.area || 10000,
    level: partialRoom.level || 0,
    walls: partialRoom.walls || []
  };
}

// Test fixtures creator functions
/**
 * Create a test point
 */
export function createTestPoint(x = 0, y = 0): Point {
  return { x, y };
}

/**
 * Create a test floor plan with test data
 */
export function createTestFloorPlan(overrides: Partial<FloorPlan> = {}): FloorPlan {
  return createEmptyFloorPlan({
    id: `test-fp-${Date.now()}`,
    name: 'Test Floor Plan',
    ...overrides,
    // Always ensure these required properties are included
    data: overrides.data || {},
    userId: overrides.userId || 'test-user'
  });
}

/**
 * Create a test wall with test data
 */
export function createTestWall(overrides: Partial<Wall> = {}): Wall {
  const start = overrides.start || { x: 0, y: 0 };
  const end = overrides.end || { x: 100, y: 0 };
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const length = Math.sqrt(dx * dx + dy * dy);

  return {
    id: overrides.id || `wall-${Date.now()}`,
    start,
    end,
    thickness: overrides.thickness || 5,
    color: overrides.color || '#000000',
    points: overrides.points || [start, end],
    roomIds: overrides.roomIds || [],
    length: overrides.length || length,
    ...overrides
  };
}

/**
 * Create a test room with test data
 */
export function createTestRoom(overrides: Partial<Room> = {}): Room {
  const typeValue = overrides.type || 'other';
  const validType = typeof typeValue === 'string' ? asRoomType(typeValue) : typeValue;

  return {
    id: overrides.id || `room-${Date.now()}`,
    name: overrides.name || 'Test Room',
    type: validType,
    points: overrides.points || [
      { x: 0, y: 0 },
      { x: 100, y: 0 },
      { x: 100, y: 100 },
      { x: 0, y: 100 }
    ],
    color: overrides.color || '#ffffff',
    area: overrides.area || 10000,
    level: overrides.level || 0,
    walls: overrides.walls || [],
    ...overrides
  };
}

/**
 * Create a test stroke with test data
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
