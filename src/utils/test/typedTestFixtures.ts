
/**
 * Type-safe test fixtures
 * Provides utilities to create test data with proper typing
 */
import { 
  FloorPlan, 
  Stroke, 
  Room, 
  Wall, 
  StrokeTypeLiteral, 
  RoomTypeLiteral, 
  Point,
  asStrokeType,
  asRoomType
} from '@/types/floor-plan/typesBarrel';

/**
 * Creates a properly typed test stroke
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
 * Creates a properly typed test room
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
 * Creates a properly typed test wall
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
    length: overrides.length || length,
    ...overrides
  };
}

/**
 * Creates a properly typed point
 */
export function createTestPoint(x = 0, y = 0): Point {
  return { x, y };
}

/**
 * Creates a properly typed test floor plan
 */
export function createTypedTestFloorPlan(overrides: Partial<FloorPlan> = {}): FloorPlan {
  const now = new Date().toISOString();
  
  return {
    id: overrides.id || `test-fp-${Date.now()}`,
    name: overrides.name || 'Test Floor Plan',
    label: overrides.label || 'Test Floor Plan', // Making label required
    data: overrides.data || {}, // Ensuring required data property is set
    userId: overrides.userId || 'test-user', // Ensuring required userId property is set
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

// Alias to createMockFloorPlan for backward compatibility with tests
export const createMockFloorPlan = createTypedTestFloorPlan;
export const createMockWall = createTestWall;
export const createMockRoom = createTestRoom;
export const createMockStroke = createTestStroke;
