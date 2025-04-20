
/**
 * Unified Types for Floor Plans
 * Central source of truth for all floor plan related types
 * @module types/floor-plan/unifiedTypes
 */

/**
 * Point interface for coordinates
 */
export interface Point {
  x: number;
  y: number;
}

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
 * Valid stroke types
 * IMPORTANT: 'straight' must be included for compatibility
 */
export type StrokeTypeLiteral = 
  | 'line' 
  | 'polyline' 
  | 'wall' 
  | 'room' 
  | 'freehand' 
  | 'door' 
  | 'window' 
  | 'furniture' 
  | 'annotation' 
  | 'straight' 
  | 'other';

/**
 * Valid room types
 */
export type RoomTypeLiteral = 
  | 'living' 
  | 'bedroom' 
  | 'kitchen' 
  | 'bathroom' 
  | 'office' 
  | 'other';

/**
 * Type guard for stroke type
 * @param type Stroke type to check
 * @returns Validated stroke type
 */
export function asStrokeType(type: unknown): StrokeTypeLiteral {
  console.log('Validating stroke type:', type);
  const validTypes: StrokeTypeLiteral[] = [
    'line', 'polyline', 'wall', 'room', 'freehand', 
    'door', 'window', 'furniture', 'annotation', 'straight', 'other'
  ];
  
  const typeString = String(type).toLowerCase();
  const isValid = validTypes.includes(typeString as StrokeTypeLiteral);
  
  if (!isValid) {
    console.warn(`Invalid stroke type: ${type}, defaulting to 'other'`);
  }
  
  return isValid ? (typeString as StrokeTypeLiteral) : 'other';
}

/**
 * Type guard for room type
 * @param type Room type to check
 * @returns Validated room type
 */
export function asRoomType(type: unknown): RoomTypeLiteral {
  console.log('Validating room type:', type);
  const validTypes: RoomTypeLiteral[] = [
    'living', 'bedroom', 'kitchen', 'bathroom', 'office', 'other'
  ];
  
  const typeString = String(type).toLowerCase();
  const isValid = validTypes.includes(typeString as RoomTypeLiteral);
  
  if (!isValid) {
    console.warn(`Invalid room type: ${type}, defaulting to 'other'`);
  }
  
  return isValid ? (typeString as RoomTypeLiteral) : 'other';
}

/**
 * Stroke interface
 */
export interface Stroke {
  /** Unique identifier */
  id: string;
  
  /** Points array */
  points: Point[];
  
  /** Stroke type */
  type: StrokeTypeLiteral;
  
  /** Stroke color */
  color: string;
  
  /** Stroke thickness */
  thickness: number;
  
  /** Stroke width (required for compatibility) */
  width: number;
}

/**
 * Wall interface
 */
export interface Wall {
  /** Unique identifier */
  id: string;
  
  /** Start point */
  start: Point;
  
  /** End point */
  end: Point;
  
  /** Wall points array */
  points: Point[];
  
  /** Wall thickness */
  thickness: number;
  
  /** Wall color */
  color: string;
  
  /** Room IDs this wall belongs to (REQUIRED) */
  roomIds: string[];
  
  /** Wall length */
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
  
  /** Room points */
  points: Point[];
  
  /** Room color */
  color: string;
  
  /** Room area */
  area: number;
  
  /** Room level */
  level: number;
  
  /** Walls in this room */
  walls: any[];
}

/**
 * Floor plan metadata
 */
export interface FloorPlanMetadata {
  /** Creation date */
  createdAt: string;
  
  /** Last update */
  updatedAt: string;
  
  /** Paper size */
  paperSize: PaperSize | string;
  
  /** Floor level */
  level: number;
  
  /** Schema version */
  version?: string;
  
  /** Author name */
  author?: string;
  
  /** Creation date (ISO string) */
  dateCreated?: string;
  
  /** Last modified date (ISO string) */
  lastModified?: string;
  
  /** Additional notes */
  notes?: string;
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
  
  /** Additional data for the floor plan (REQUIRED) */
  data: any;
  
  /** User ID who owns the floor plan (REQUIRED) */
  userId: string;
  
  /** Canvas state (optional, used in some components) */
  canvasState?: any;
}

/**
 * Create an empty floor plan
 * @returns Empty floor plan with default values
 */
export function createEmptyFloorPlan(): FloorPlan {
  console.log('Creating empty floor plan with required properties');
  const now = new Date().toISOString();
  return {
    id: '',
    name: 'New Floor Plan',
    label: 'New Floor Plan',
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
      level: 0
    },
    data: {}, // CRITICAL: Required property
    userId: 'unknown' // CRITICAL: Required property
  };
}

/**
 * Create an empty stroke
 * @returns Empty stroke with default values
 */
export function createEmptyStroke(): Stroke {
  return {
    id: '',
    points: [],
    type: 'line',
    color: '#000000',
    thickness: 1,
    width: 1
  };
}

/**
 * Create an empty wall
 * @returns Empty wall with default values
 */
export function createEmptyWall(): Wall {
  return {
    id: '',
    start: { x: 0, y: 0 },
    end: { x: 0, y: 0 },
    points: [{ x: 0, y: 0 }, { x: 0, y: 0 }],
    thickness: 5,
    color: '#000000',
    roomIds: [], // CRITICAL: Required property
    length: 0
  };
}

/**
 * Create an empty room
 * @returns Empty room with default values
 */
export function createEmptyRoom(): Room {
  return {
    id: '',
    name: 'Unnamed Room',
    type: 'other',
    points: [],
    color: '#ffffff',
    area: 0,
    level: 0,
    walls: []
  };
}

/**
 * Create a test point for testing
 * @returns Test point
 */
export function createTestPoint(x = 0, y = 0): Point {
  return { x, y };
}

/**
 * Create a test stroke for testing
 * @returns Test stroke
 */
export function createTestStroke(overrides: Partial<Stroke> = {}): Stroke {
  console.log('Creating test stroke with type:', overrides.type);
  const baseStroke = createEmptyStroke();
  baseStroke.id = `test-stroke-${Date.now()}`;
  baseStroke.points = [{ x: 0, y: 0 }, { x: 100, y: 100 }];
  
  // Ensure type is a valid StrokeTypeLiteral
  if (overrides.type && typeof overrides.type === 'string') {
    overrides.type = asStrokeType(overrides.type);
  }
  
  return { ...baseStroke, ...overrides };
}

/**
 * Create a test wall for testing
 * @returns Test wall
 */
export function createTestWall(overrides: Partial<Wall> = {}): Wall {
  console.log('Creating test wall with roomIds:', overrides.roomIds);
  const baseWall = createEmptyWall();
  baseWall.id = `test-wall-${Date.now()}`;
  baseWall.start = { x: 0, y: 0 };
  baseWall.end = { x: 100, y: 0 };
  baseWall.points = [baseWall.start, baseWall.end];
  baseWall.length = 100;
  
  // Ensure roomIds is present
  if (!overrides.roomIds) {
    console.log('Adding missing roomIds to wall');
    overrides.roomIds = [];
  }
  
  return { ...baseWall, ...overrides };
}

/**
 * Create a test room for testing
 * @returns Test room
 */
export function createTestRoom(overrides: Partial<Room> = {}): Room {
  console.log('Creating test room with type:', overrides.type);
  const baseRoom = createEmptyRoom();
  baseRoom.id = `test-room-${Date.now()}`;
  baseRoom.points = [
    { x: 0, y: 0 },
    { x: 100, y: 0 },
    { x: 100, y: 100 },
    { x: 0, y: 100 }
  ];
  baseRoom.area = 10000;
  
  // Ensure type is a valid RoomTypeLiteral
  if (overrides.type && typeof overrides.type === 'string') {
    overrides.type = asRoomType(overrides.type);
  }
  
  return { ...baseRoom, ...overrides };
}

/**
 * Create a test floor plan for testing
 * @returns Test floor plan
 */
export function createTestFloorPlan(overrides: Partial<FloorPlan> = {}): FloorPlan {
  console.log('Creating test floor plan with data and userId');
  const baseFloorPlan = createEmptyFloorPlan();
  baseFloorPlan.id = `test-fp-${Date.now()}`;
  
  // CRITICAL: Ensure required properties are always present
  if (!overrides.data) {
    console.log('Adding missing data property to floor plan');
    overrides.data = {};
  }
  
  if (!overrides.userId) {
    console.log('Adding missing userId property to floor plan');
    overrides.userId = 'test-user';
  }
  
  return { ...baseFloorPlan, ...overrides };
}
