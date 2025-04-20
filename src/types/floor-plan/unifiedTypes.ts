
/**
 * Unified Floor Plan types
 * Provides a consistent type system for all floor plan related components
 * @module types/floor-plan/unifiedTypes
 */

/**
 * Represents a 2D point with x,y coordinates
 */
export interface Point {
  x: number;
  y: number;
}

/**
 * Valid stroke types enumeration
 */
export enum StrokeTypes {
  PEN = 'pen',
  MARKER = 'marker',
  HIGHLIGHTER = 'highlighter',
  ERASER = 'eraser',
  STRAIGHT = 'straight'
}

/**
 * Valid room types enumeration
 */
export enum RoomTypes {
  BEDROOM = 'bedroom',
  BATHROOM = 'bathroom',
  KITCHEN = 'kitchen',
  LIVING = 'living',
  DINING = 'dining',
  OFFICE = 'office',
  OTHER = 'other'
}

/**
 * Paper size options
 */
export enum PaperSize {
  A4 = 'A4',
  A3 = 'A3',
  LETTER = 'Letter',
  LEGAL = 'Legal',
  TABLOID = 'Tabloid'
}

/**
 * Valid stroke type string literals
 */
export type StrokeTypeLiteral = 'pen' | 'marker' | 'highlighter' | 'eraser' | 'straight';

/**
 * Valid room type string literals
 */
export type RoomTypeLiteral = 'bedroom' | 'bathroom' | 'kitchen' | 'living' | 'dining' | 'office' | 'other';

/**
 * Type guard for stroke types
 */
export function asStrokeType(value: string): StrokeTypeLiteral {
  if (
    value === 'pen' ||
    value === 'marker' ||
    value === 'highlighter' ||
    value === 'eraser' ||
    value === 'straight'
  ) {
    return value;
  }
  console.warn(`Invalid stroke type: ${value}, falling back to 'pen'`);
  return 'pen';
}

/**
 * Type guard for room types
 */
export function asRoomType(value: string): RoomTypeLiteral {
  if (
    value === 'bedroom' ||
    value === 'bathroom' ||
    value === 'kitchen' ||
    value === 'living' ||
    value === 'dining' ||
    value === 'office' ||
    value === 'other'
  ) {
    return value;
  }
  console.warn(`Invalid room type: ${value}, falling back to 'other'`);
  return 'other';
}

/**
 * Represents a stroke on the canvas
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
 * Represents a wall in the floor plan
 */
export interface Wall {
  id: string;
  start: Point;
  end: Point;
  thickness: number;
  color: string;
  points: Point[];
  length: number;
  roomIds: string[];
}

/**
 * Represents a room in the floor plan
 */
export interface Room {
  id: string;
  name: string;
  type: RoomTypeLiteral;
  points: Point[];
  color: string;
  area: number;
  walls: any[];
  level: number;
}

/**
 * Floor plan metadata interface
 */
export interface FloorPlanMetadata {
  createdAt: string;
  updatedAt: string;
  paperSize: PaperSize;
  level: number;
  [key: string]: any;
}

/**
 * Represents a complete floor plan
 */
export interface FloorPlan {
  id: string;
  name: string;
  label: string;
  walls: Wall[];
  rooms: Room[];
  strokes: Stroke[];
  level: number;
  index: number;
  gia: number;
  canvasData: any;
  canvasJson: any;
  createdAt: string;
  updatedAt: string;
  metadata: FloorPlanMetadata;
  data: Record<string, any>;
  userId: string;
  canvasState?: any;
}

/**
 * Creates an empty floor plan object with default values
 */
export function createEmptyFloorPlan(partialFloorPlan: Partial<FloorPlan> = {}): FloorPlan {
  return {
    id: partialFloorPlan.id || `fp-${Date.now()}`,
    name: partialFloorPlan.name || 'New Floor Plan',
    label: partialFloorPlan.label || 'New Floor Plan',
    walls: partialFloorPlan.walls || [],
    rooms: partialFloorPlan.rooms || [],
    strokes: partialFloorPlan.strokes || [],
    level: partialFloorPlan.level || 0,
    index: partialFloorPlan.index || 0,
    gia: partialFloorPlan.gia || 0,
    canvasData: partialFloorPlan.canvasData || null,
    canvasJson: partialFloorPlan.canvasJson || null,
    createdAt: partialFloorPlan.createdAt || new Date().toISOString(),
    updatedAt: partialFloorPlan.updatedAt || new Date().toISOString(),
    metadata: partialFloorPlan.metadata || {
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      paperSize: PaperSize.A4,
      level: 0
    },
    data: partialFloorPlan.data || {},
    userId: partialFloorPlan.userId || 'default-user',
    canvasState: partialFloorPlan.canvasState || null
  };
}

/**
 * Creates an empty stroke with default values
 */
export function createEmptyStroke(partialStroke: Partial<Stroke> = {}): Stroke {
  return {
    id: partialStroke.id || `stroke-${Date.now()}`,
    points: partialStroke.points || [],
    type: partialStroke.type || 'pen',
    color: partialStroke.color || '#000000',
    thickness: partialStroke.thickness || 2,
    width: partialStroke.width || 2
  };
}

/**
 * Creates an empty wall with default values
 */
export function createEmptyWall(partialWall: Partial<Wall> = {}): Wall {
  return {
    id: partialWall.id || `wall-${Date.now()}`,
    start: partialWall.start || { x: 0, y: 0 },
    end: partialWall.end || { x: 100, y: 0 },
    thickness: partialWall.thickness || 5,
    color: partialWall.color || '#000000',
    points: partialWall.points || [{ x: 0, y: 0 }, { x: 100, y: 0 }],
    length: partialWall.length || 100,
    roomIds: partialWall.roomIds || []
  };
}

/**
 * Creates an empty room with default values
 */
export function createEmptyRoom(partialRoom: Partial<Room> = {}): Room {
  return {
    id: partialRoom.id || `room-${Date.now()}`,
    name: partialRoom.name || 'New Room',
    type: partialRoom.type || 'other',
    points: partialRoom.points || [],
    color: partialRoom.color || '#e0e0e0',
    area: partialRoom.area || 0,
    walls: partialRoom.walls || [],
    level: partialRoom.level || 0
  };
}

/**
 * Creates a test point
 */
export function createTestPoint(x = 0, y = 0): Point {
  return { x, y };
}

/**
 * Creates a test stroke for testing purposes
 */
export function createTestStroke(overrides: Partial<Stroke> = {}): Stroke {
  return {
    id: overrides.id || 'test-stroke',
    points: overrides.points || [
      { x: 10, y: 10 },
      { x: 20, y: 20 },
      { x: 30, y: 30 }
    ],
    type: overrides.type || 'pen',
    color: overrides.color || '#000000',
    thickness: overrides.thickness !== undefined ? overrides.thickness : 2,
    width: overrides.width !== undefined ? overrides.width : 2
  };
}

/**
 * Creates a test wall for testing purposes
 */
export function createTestWall(overrides: Partial<Wall> = {}): Wall {
  return {
    id: overrides.id || 'test-wall',
    start: overrides.start || { x: 0, y: 0 },
    end: overrides.end || { x: 100, y: 0 },
    thickness: overrides.thickness !== undefined ? overrides.thickness : 5,
    color: overrides.color || '#000000',
    points: overrides.points || [
      { x: 0, y: 0 },
      { x: 100, y: 0 }
    ],
    length: overrides.length !== undefined ? overrides.length : 100,
    roomIds: overrides.roomIds || []
  };
}

/**
 * Creates a test room for testing purposes
 */
export function createTestRoom(overrides: Partial<Room> = {}): Room {
  return {
    id: overrides.id || 'test-room',
    name: overrides.name || 'Test Room',
    type: overrides.type || 'other',
    points: overrides.points || [
      { x: 0, y: 0 },
      { x: 100, y: 0 },
      { x: 100, y: 100 },
      { x: 0, y: 100 }
    ],
    color: overrides.color || '#e0e0e0',
    area: overrides.area !== undefined ? overrides.area : 10000,
    walls: overrides.walls || [],
    level: overrides.level !== undefined ? overrides.level : 0
  };
}

/**
 * Creates a test floor plan for testing purposes
 */
export function createTestFloorPlan(overrides: Partial<FloorPlan> = {}): FloorPlan {
  return {
    id: overrides.id || 'test-floor-plan',
    name: overrides.name || 'Test Floor Plan',
    label: overrides.label || 'Test Floor Plan',
    walls: overrides.walls || [],
    rooms: overrides.rooms || [],
    strokes: overrides.strokes || [],
    level: overrides.level !== undefined ? overrides.level : 0,
    index: overrides.index !== undefined ? overrides.index : 0,
    gia: overrides.gia !== undefined ? overrides.gia : 0,
    canvasData: overrides.canvasData || null,
    canvasJson: overrides.canvasJson || null,
    createdAt: overrides.createdAt || new Date().toISOString(),
    updatedAt: overrides.updatedAt || new Date().toISOString(),
    metadata: overrides.metadata || {
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      paperSize: PaperSize.A4,
      level: 0
    },
    data: overrides.data || {},
    userId: overrides.userId || 'test-user',
    canvasState: overrides.canvasState || null
  };
}
