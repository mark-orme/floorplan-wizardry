
/**
 * Unified Floor Plan Types
 * Core definitions for the floor plan system
 * @module types/floor-plan/unifiedTypes
 */

/**
 * Point coordinates
 */
export interface Point {
  /** X coordinate */
  x: number;
  
  /** Y coordinate */
  y: number;
}

/**
 * Valid stroke types
 */
export type StrokeTypeLiteral = 'line' | 'wall' | 'door' | 'window' | 'furniture' | 'annotation' | 'polyline' | 'room' | 'freehand';

/**
 * Valid room types
 */
export type RoomTypeLiteral = 'living' | 'bedroom' | 'kitchen' | 'bathroom' | 'office' | 'other';

/**
 * Paper size enum
 */
export enum PaperSize {
  A4 = 'A4',
  A3 = 'A3',
  Letter = 'Letter',
  Legal = 'Legal',
  Custom = 'Custom'
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
  
  /** Wall start point */
  start: Point;
  
  /** Wall end point */
  end: Point;
  
  /** Wall thickness in pixels */
  thickness: number;
  
  /** Wall color */
  color: string;
  
  /** Room IDs associated with this wall */
  roomIds: string[];
  
  /** Wall length */
  length: number;
  
  /** Wall height (optional) */
  height?: number;
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
  
  /** Room vertices/boundary points */
  vertices: Point[];
  
  /** Room area in square meters */
  area: number;
  
  /** Room perimeter length */
  perimeter: number;
  
  /** Position for room label */
  labelPosition: Point;
  
  /** Room center point */
  center: Point;
  
  /** Room color */
  color: string;
}

/**
 * Floor plan metadata
 */
export interface FloorPlanMetadata {
  /** Creation timestamp */
  createdAt: string;
  
  /** Last update timestamp */
  updatedAt: string;
  
  /** Paper size */
  paperSize: PaperSize | string;
  
  /** Floor level */
  level: number;
  
  /** Version */
  version: string;
  
  /** Author */
  author: string;
  
  /** Date created */
  dateCreated: string;
  
  /** Last modified */
  lastModified: string;
  
  /** Notes */
  notes: string;
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
  
  /** Walls array */
  walls: Wall[];
  
  /** Rooms array */
  rooms: Room[];
  
  /** Strokes array */
  strokes: Stroke[];
  
  /** Serialized canvas data (optional) */
  canvasData: string | null;
  
  /** Canvas JSON serialization (required) */
  canvasJson: string | null;
  
  /** Canvas state data for internal use */
  canvasState?: string | null;
  
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
}

/**
 * Create a test point
 * @param x X coordinate
 * @param y Y coordinate
 * @returns A test point
 */
export function createTestPoint(x: number, y: number): Point {
  return { x, y };
}

/**
 * Ensure a stroke type is valid or return a default
 * @param type Type to validate
 * @returns Valid stroke type
 */
export function asStrokeType(type: string): StrokeTypeLiteral {
  const validTypes: StrokeTypeLiteral[] = ['line', 'wall', 'door', 'window', 'furniture', 'annotation', 'polyline', 'room', 'freehand'];
  if (validTypes.includes(type as StrokeTypeLiteral)) {
    return type as StrokeTypeLiteral;
  }
  return 'line';
}

/**
 * Ensure a room type is valid or return a default
 * @param type Type to validate
 * @returns Valid room type
 */
export function asRoomType(type: string): RoomTypeLiteral {
  const validTypes: RoomTypeLiteral[] = ['living', 'bedroom', 'kitchen', 'bathroom', 'office', 'other'];
  if (validTypes.includes(type as RoomTypeLiteral)) {
    return type as RoomTypeLiteral;
  }
  return 'other';
}

/**
 * Create an empty floor plan with default values
 * @param index Floor index
 * @returns Empty floor plan
 */
export function createEmptyFloorPlan(index: number = 0): FloorPlan {
  const now = new Date().toISOString();
  return {
    id: `floor-${Date.now()}`,
    name: `Floor ${index}`,
    label: `Floor ${index}`,
    walls: [],
    rooms: [],
    strokes: [],
    canvasData: null,
    canvasJson: null,
    canvasState: null,
    createdAt: now,
    updatedAt: now,
    gia: 0,
    level: index,
    index: index,
    metadata: {
      createdAt: now,
      updatedAt: now,
      paperSize: PaperSize.A4,
      level: index,
      version: '1.0',
      author: '',
      dateCreated: now,
      lastModified: now,
      notes: ''
    },
    data: {},
    userId: ''
  };
}

/**
 * Create an empty stroke
 * @returns Empty stroke
 */
export function createEmptyStroke(): Stroke {
  return {
    id: `stroke-${Date.now()}`,
    points: [],
    type: 'line',
    color: '#000000',
    thickness: 2,
    width: 2
  };
}

/**
 * Create an empty wall
 * @returns Empty wall
 */
export function createEmptyWall(): Wall {
  return {
    id: `wall-${Date.now()}`,
    start: { x: 0, y: 0 },
    end: { x: 0, y: 0 },
    thickness: 5,
    color: '#333333',
    roomIds: [],
    length: 0
  };
}

/**
 * Create an empty room
 * @returns Empty room
 */
export function createEmptyRoom(): Room {
  return {
    id: `room-${Date.now()}`,
    name: 'Unnamed Room',
    type: 'other',
    vertices: [
      { x: 0, y: 0 },
      { x: 100, y: 0 },
      { x: 100, y: 100 },
      { x: 0, y: 100 }
    ],
    area: 0,
    perimeter: 400,
    labelPosition: { x: 50, y: 50 },
    center: { x: 50, y: 50 },
    color: '#f5f5f5'
  };
}

/**
 * Create a test stroke
 * @param id Stroke ID
 * @param type Stroke type
 * @returns Test stroke
 */
export function createTestStroke(id?: string, type: StrokeTypeLiteral = 'line'): Stroke {
  return {
    id: id || `stroke-${Math.random().toString(36).substring(2, 9)}`,
    points: [
      { x: 10, y: 10 },
      { x: 100, y: 100 }
    ],
    type,
    color: '#000000',
    thickness: 2,
    width: 2
  };
}

/**
 * Create a test wall
 * @param id Wall ID
 * @returns Test wall
 */
export function createTestWall(id?: string): Wall {
  const start = { x: 0, y: 0 };
  const end = { x: 100, y: 0 };
  return {
    id: id || `wall-${Math.random().toString(36).substring(2, 9)}`,
    start,
    end,
    thickness: 5,
    color: '#333333',
    roomIds: [],
    length: 100
  };
}

/**
 * Create a test room
 * @param id Room ID
 * @param type Room type
 * @returns Test room
 */
export function createTestRoom(id?: string, type: RoomTypeLiteral = 'other'): Room {
  const vertices = [
    { x: 0, y: 0 },
    { x: 100, y: 0 },
    { x: 100, y: 100 },
    { x: 0, y: 100 }
  ];
  return {
    id: id || `room-${Math.random().toString(36).substring(2, 9)}`,
    name: 'Test Room',
    type,
    vertices,
    area: 10000,
    perimeter: 400,
    labelPosition: { x: 50, y: 50 },
    center: { x: 50, y: 50 },
    color: '#f5f5f5'
  };
}

/**
 * Create a test floor plan
 * @param id Floor plan ID
 * @returns Test floor plan
 */
export function createTestFloorPlan(id?: string): FloorPlan {
  const now = new Date().toISOString();
  return {
    id: id || `floor-${Math.random().toString(36).substring(2, 9)}`,
    name: 'Test Floor Plan',
    label: 'Test Floor Plan',
    walls: [],
    rooms: [],
    strokes: [],
    canvasData: null,
    canvasJson: null,
    canvasState: null,
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
      version: '1.0',
      author: 'Test Author',
      dateCreated: now,
      lastModified: now,
      notes: 'Test notes'
    },
    data: {},
    userId: 'test-user'
  };
}
