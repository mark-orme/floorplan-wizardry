
/**
 * Unified Types for Floor Plans
 * Central source of truth for all floor plan related types
 * @module types/floor-plan/unifiedTypes
 */
import { v4 as uuidv4 } from 'uuid';

// Re-export PaperSize enum from basicTypes for convenience
export { PaperSize } from './basicTypes';

/**
 * Point interface for coordinates
 */
export interface Point {
  x: number;
  y: number;
}

/**
 * Create a point with the given coordinates
 */
export function createPoint(x: number, y: number): Point {
  return { x, y };
}

/**
 * Stroke type enum as string literals
 */
export type StrokeTypeLiteral = 'line' | 'wall' | 'door' | 'window' | 'furniture' | 'annotation';

/**
 * Room type enum as string literals
 */
export type RoomTypeLiteral = 'living' | 'bedroom' | 'kitchen' | 'bathroom' | 'office' | 'other';

/**
 * Floor plan metadata with all required fields
 */
export interface FloorPlanMetadata {
  /** Creation date timestamp */
  createdAt: string;
  
  /** Last update timestamp */
  updatedAt: string;
  
  /** Paper size for printing */
  paperSize: string;
  
  /** Floor level (0 = ground floor) */
  level: number;
  
  /** Version of the floor plan */
  version: string;
  
  /** Author of the floor plan */
  author: string;
  
  /** Creation date (formatted) */
  dateCreated: string;
  
  /** Last modified date (formatted) */
  lastModified: string;
  
  /** Additional notes */
  notes: string;
}

/**
 * Create a complete metadata object with all required fields
 */
export function createCompleteMetadata(partial: Partial<FloorPlanMetadata> = {}): FloorPlanMetadata {
  const now = new Date().toISOString();
  
  return {
    createdAt: partial.createdAt || now,
    updatedAt: partial.updatedAt || now,
    paperSize: partial.paperSize || 'A4',
    level: partial.level || 0,
    version: partial.version || '1.0',
    author: partial.author || 'System',
    dateCreated: partial.dateCreated || now,
    lastModified: partial.lastModified || now,
    notes: partial.notes || ''
  };
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
  width: number;
}

/**
 * Wall interface for floor plan
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
  
  /** Boundary vertices */
  vertices: Point[];
  
  /** Room area in square meters */
  area: number;
  
  /** Room perimeter length */
  perimeter: number;
  
  /** Center point of the room */
  center: Point;
  
  /** Position for the room label */
  labelPosition: Point;
  
  /** Room color */
  color: string;
}

/**
 * FloorPlan interface
 */
export interface FloorPlan {
  /** Unique identifier */
  id: string;
  
  /** Floor plan name */
  name: string;
  
  /** Display label (optional) */
  label?: string;
  
  /** Walls array */
  walls: Wall[];
  
  /** Rooms array */
  rooms: Room[];
  
  /** Strokes array */
  strokes: Stroke[];
  
  /** Serialized canvas data (optional) */
  canvasData: any | null;
  
  /** Canvas JSON serialization (optional) */
  canvasJson: string | null;
  
  /** Creation date timestamp */
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
  
  /** Additional data for the floor plan */
  data: any;
  
  /** User ID who owns the floor plan */
  userId: string;
  
  /** Canvas state (optional) */
  canvasState?: any;
}

/**
 * Type-safe conversions for string literals
 */
export function asStrokeType(type: string): StrokeTypeLiteral {
  const validTypes: StrokeTypeLiteral[] = ['line', 'wall', 'door', 'window', 'furniture', 'annotation'];
  return validTypes.includes(type as StrokeTypeLiteral) ? (type as StrokeTypeLiteral) : 'line';
}

export function asRoomType(type: string): RoomTypeLiteral {
  const validTypes: RoomTypeLiteral[] = ['living', 'bedroom', 'kitchen', 'bathroom', 'office', 'other'];
  return validTypes.includes(type as RoomTypeLiteral) ? (type as RoomTypeLiteral) : 'other';
}

/**
 * Create an empty floor plan with default values
 */
export function createEmptyFloorPlan(partialFloorPlan: Partial<FloorPlan> = {}): FloorPlan {
  const now = new Date().toISOString();
  
  return {
    id: partialFloorPlan.id || uuidv4(),
    name: partialFloorPlan.name || 'New Floor Plan',
    label: partialFloorPlan.label || 'New Floor Plan',
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
    metadata: partialFloorPlan.metadata || createCompleteMetadata({ level: partialFloorPlan.level }),
    data: partialFloorPlan.data || {},
    userId: partialFloorPlan.userId || ''
  };
}

/**
 * Create an empty stroke with default values
 */
export function createEmptyStroke(partialStroke: Partial<Stroke> = {}): Stroke {
  return {
    id: partialStroke.id || uuidv4(),
    points: partialStroke.points || [],
    type: partialStroke.type || 'line',
    color: partialStroke.color || '#000000',
    thickness: partialStroke.thickness || 1,
    width: partialStroke.width || 1
  };
}

/**
 * Create an empty wall with default values
 */
export function createEmptyWall(partialWall: Partial<Wall> = {}): Wall {
  const start = partialWall.start || { x: 0, y: 0 };
  const end = partialWall.end || { x: 100, y: 0 };
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  
  return {
    id: partialWall.id || uuidv4(),
    start,
    end,
    thickness: partialWall.thickness || 5,
    color: partialWall.color || '#333333',
    roomIds: partialWall.roomIds || [],
    length: partialWall.length || Math.sqrt(dx * dx + dy * dy),
    height: partialWall.height
  };
}

/**
 * Create an empty room with default values
 */
export function createEmptyRoom(partialRoom: Partial<Room> = {}): Room {
  const vertices = partialRoom.vertices || [
    { x: 0, y: 0 },
    { x: 100, y: 0 },
    { x: 100, y: 100 },
    { x: 0, y: 100 }
  ];
  
  const center = partialRoom.center || {
    x: vertices.reduce((sum, v) => sum + v.x, 0) / vertices.length,
    y: vertices.reduce((sum, v) => sum + v.y, 0) / vertices.length
  };
  
  return {
    id: partialRoom.id || uuidv4(),
    name: partialRoom.name || 'Unnamed Room',
    type: partialRoom.type || 'other',
    vertices,
    area: partialRoom.area || 10000,
    perimeter: partialRoom.perimeter || 400,
    center,
    labelPosition: partialRoom.labelPosition || center,
    color: partialRoom.color || '#f5f5f5'
  };
}

// Test fixture creation functions
export function createTestPoint(x = 0, y = 0): Point {
  return { x, y };
}

export function createTestFloorPlan(partialFloorPlan: Partial<FloorPlan> = {}): FloorPlan {
  const now = new Date().toISOString();
  return {
    id: partialFloorPlan.id || 'floor-test',
    name: partialFloorPlan.name || 'Test Floor Plan',
    label: partialFloorPlan.label || 'Test Floor Plan',
    walls: partialFloorPlan.walls || [],
    rooms: partialFloorPlan.rooms || [],
    strokes: partialFloorPlan.strokes || [],
    canvasData: partialFloorPlan.canvasData || null,
    canvasJson: partialFloorPlan.canvasJson || null,
    canvasState: partialFloorPlan.canvasState || null,
    metadata: partialFloorPlan.metadata || createCompleteMetadata(),
    data: partialFloorPlan.data || {},
    createdAt: partialFloorPlan.createdAt || now,
    updatedAt: partialFloorPlan.updatedAt || now,
    gia: partialFloorPlan.gia || 0,
    level: partialFloorPlan.level || 0,
    index: partialFloorPlan.index || 0,
    userId: partialFloorPlan.userId || 'test-user'
  };
}

export function createTestStroke(partialStroke: Partial<Stroke> = {}): Stroke {
  const type = partialStroke.type || 'line';
  return {
    id: partialStroke.id || 'stroke-test',
    points: partialStroke.points || [createTestPoint(0, 0), createTestPoint(100, 100)],
    type,
    color: partialStroke.color || '#000000',
    thickness: partialStroke.thickness || 2,
    width: partialStroke.width || 2
  };
}

export function createTestWall(partialWall: Partial<Wall> = {}): Wall {
  const start = partialWall.start || createTestPoint(0, 0);
  const end = partialWall.end || createTestPoint(100, 0);

  return {
    id: partialWall.id || 'wall-test',
    start,
    end,
    thickness: partialWall.thickness || 5,
    color: partialWall.color || '#333333',
    roomIds: partialWall.roomIds || [],
    length: partialWall.length || Math.sqrt(
      Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2)
    ),
    height: partialWall.height
  };
}

export function createTestRoom(partialRoom: Partial<Room> = {}): Room {
  const type = partialRoom.type || 'other';
  const vertices = partialRoom.vertices || [
    createTestPoint(0, 0),
    createTestPoint(100, 0),
    createTestPoint(100, 100),
    createTestPoint(0, 100)
  ];

  const center = {
    x: vertices.reduce((sum, v) => sum + v.x, 0) / vertices.length,
    y: vertices.reduce((sum, v) => sum + v.y, 0) / vertices.length
  };

  // Calculate perimeter
  let perimeter = 0;
  for (let i = 0; i < vertices.length; i++) {
    const p1 = vertices[i];
    const p2 = vertices[(i + 1) % vertices.length];
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    perimeter += Math.sqrt(dx * dx + dy * dy);
  }

  return {
    id: partialRoom.id || 'room-test',
    name: partialRoom.name || 'Test Room',
    type,
    vertices,
    area: partialRoom.area || 10000,
    perimeter: partialRoom.perimeter || perimeter,
    labelPosition: partialRoom.labelPosition || center,
    center: partialRoom.center || center,
    color: partialRoom.color || '#f5f5f5'
  };
}
