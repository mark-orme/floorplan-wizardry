
/**
 * Unified Floor Plan Types
 * Single source of truth for all floor plan type definitions
 * @module types/floor-plan/unifiedTypes
 */

// Basic type definitions
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
  'straight' | 
  'other';

export type RoomTypeLiteral = 
  'living' | 
  'bedroom' | 
  'kitchen' | 
  'bathroom' | 
  'office' | 
  'other';

export enum PaperSize {
  A4 = 'A4',
  A3 = 'A3',
  A5 = 'A5',
  LETTER = 'LETTER',
  LEGAL = 'LEGAL',
  TABLOID = 'TABLOID',
  CUSTOM = 'CUSTOM'
}

// Point interface
export interface Point {
  x: number;
  y: number;
}

// Stroke interface
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

// Wall interface
export interface Wall {
  /** Unique identifier */
  id: string;
  
  /** Points array (start and end) */
  points: Point[];
  
  /** Start point (alias for points[0]) */
  startPoint?: Point;
  
  /** End point (alias for points[1]) */
  endPoint?: Point;
  
  /** Start point (required) */
  start: Point;
  
  /** End point (required) */
  end: Point;
  
  /** Wall thickness */
  thickness: number;
  
  /** Wall height (optional) */
  height?: number;
  
  /** Wall color */
  color: string;
  
  /** Room IDs connected to this wall */
  roomIds: string[];
  
  /** Length of the wall (calculated property) */
  length: number;
}

// Room interface
export interface Room {
  /** Unique identifier */
  id: string;
  
  /** Room name */
  name: string;
  
  /** Room type */
  type: RoomTypeLiteral;
  
  /** Room area in square meters (required) */
  area: number;
  
  /** Room boundary points */
  points: Point[];
  
  /** Room color (required) */
  color: string;
  
  /** Floor level this room belongs to */
  level: number;
  
  /** Wall IDs associated with this room (required for compatibility) */
  walls: string[];
}

// Metadata interface
export interface FloorPlanMetadata {
  /** Creation date timestamp (required) */
  createdAt: string;
  
  /** Last update timestamp (required) */
  updatedAt: string;
  
  /** Paper size (required) */
  paperSize: PaperSize | string;
  
  /** Floor level (0 = ground floor) */
  level: number;
  
  /** Version identifier */
  version?: string;
  
  /** Author identifier */
  author?: string;
  
  /** Date created (legacy format) */
  dateCreated?: string;
  
  /** Last modified (legacy format) */
  lastModified?: string;
  
  /** Additional notes */
  notes?: string;
}

// FloorPlan interface
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
  
  /** Additional data for the floor plan (required) */
  data: any;
  
  /** User ID who owns the floor plan (required) */
  userId: string;
  
  /** Optional order property for compatibility */
  order?: number;
}

// Type guards and validation functions
export function asStrokeType(type: string): StrokeTypeLiteral {
  const validTypes: StrokeTypeLiteral[] = [
    'line', 'polyline', 'wall', 'room', 'freehand', 
    'door', 'window', 'furniture', 'annotation', 'straight', 'other'
  ];
  
  if (!validTypes.includes(type as StrokeTypeLiteral)) {
    console.warn(`Invalid stroke type: ${type}, defaulting to 'line'`);
    return 'line';
  }
  
  return type as StrokeTypeLiteral;
}

export function asRoomType(type: string): RoomTypeLiteral {
  const validTypes: RoomTypeLiteral[] = [
    'living', 'bedroom', 'kitchen', 'bathroom', 'office', 'other'
  ];
  
  if (!validTypes.includes(type as RoomTypeLiteral)) {
    console.warn(`Invalid room type: ${type}, defaulting to 'other'`);
    return 'other';
  }
  
  return type as RoomTypeLiteral;
}

// Create test objects with proper types
export function createTestFloorPlan(overrides: Partial<FloorPlan> = {}): FloorPlan {
  const now = new Date().toISOString();
  
  return {
    id: overrides.id || `test-fp-${Date.now()}`,
    name: overrides.name || 'Test Floor Plan',
    label: overrides.label || 'Test Floor Plan',
    data: overrides.data || {}, // Required property
    userId: overrides.userId || 'test-user', // Required property
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
    ...overrides
  };
}

export function createTestStroke(overrides: Partial<Stroke> = {}): Stroke {
  return {
    id: overrides.id || `stroke-${Date.now()}`,
    points: overrides.points || [{ x: 0, y: 0 }, { x: 100, y: 100 }],
    type: typeof overrides.type === 'string' ? asStrokeType(overrides.type) : (overrides.type || 'line'),
    color: overrides.color || '#000000',
    thickness: overrides.thickness || 2,
    width: overrides.width || 2,
    ...overrides
  };
}

export function createTestRoom(overrides: Partial<Room> = {}): Room {
  return {
    id: overrides.id || `room-${Date.now()}`,
    name: overrides.name || 'Test Room',
    type: typeof overrides.type === 'string' ? asRoomType(overrides.type) : (overrides.type || 'other'),
    points: overrides.points || [{ x: 0, y: 0 }, { x: 100, y: 0 }, { x: 100, y: 100 }, { x: 0, y: 100 }],
    color: overrides.color || '#ffffff',
    area: overrides.area || 10000,
    level: overrides.level || 0,
    walls: overrides.walls || [],
    ...overrides
  };
}

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
    length: overrides.length || length,
    ...overrides
  };
}
