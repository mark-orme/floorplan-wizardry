
/**
 * Type-safe test fixtures
 * Provides utilities to create test data with proper typing
 */
import { v4 as uuidv4 } from 'uuid';
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
} from '@/types/floor-plan/unifiedTypes';

/**
 * Create a test point with default values
 * @param overrides - Values to override defaults
 * @returns A Point object
 */
export const createTestPoint = (overrides: Partial<Point> = {}): Point => ({
  x: 100,
  y: 100,
  ...overrides
});

/**
 * Create a test stroke with default values
 * @param overrides - Values to override defaults
 * @returns A Stroke object
 */
export const createTestStroke = (overrides: Partial<Stroke> = {}): Stroke => {
  return {
    id: uuidv4(),
    points: [createTestPoint(), createTestPoint({ x: 200 })],
    type: asStrokeType('freehand'),
    color: '#000000',
    thickness: 2,
    width: 2,
    ...overrides
  };
};

/**
 * Create a test wall with default values
 * @param overrides - Values to override defaults
 * @returns A Wall object
 */
export const createTestWall = (overrides: Partial<Wall> = {}): Wall => {
  const start = createTestPoint();
  const end = createTestPoint({ x: 200 });
  
  // Calculate length
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const length = Math.sqrt(dx * dx + dy * dy);
  
  return {
    id: uuidv4(),
    start,
    end,
    thickness: 5,
    color: '#333333',
    height: 240,
    roomIds: [],
    length,
    ...overrides
  };
};

/**
 * Create a test room with default values
 * @param overrides - Values to override defaults
 * @returns A Room object
 */
export const createTestRoom = (overrides: Partial<Room> = {}): Room => {
  return {
    id: uuidv4(),
    name: 'Test Room',
    type: asRoomType('living'),
    vertices: [
      createTestPoint(),
      createTestPoint({ x: 200 }),
      createTestPoint({ x: 200, y: 200 }),
      createTestPoint({ y: 200 })
    ],
    area: 10000,
    color: '#f5f5f5',
    ...overrides
  };
};

/**
 * Create a test floor plan with default values
 * @param overrides - Values to override defaults
 * @returns A FloorPlan object
 */
export const createTestFloorPlan = (overrides: Partial<FloorPlan> = {}): FloorPlan => {
  const now = new Date().toISOString();
  
  return {
    id: uuidv4(),
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
      version: '1.0',
      author: 'Test User',
      dateCreated: now,
      lastModified: now,
      notes: '',
      createdAt: now,
      updatedAt: now,
      paperSize: 'A4',
      level: 0
    },
    // Required properties for FloorPlan compatibility
    data: {},
    userId: 'test-user'
  };
};

// Alias for backward compatibility
export const createTypedTestStroke = createTestStroke;
export const createTypedTestWall = createTestWall;
export const createTypedTestRoom = createTestRoom;
export const createTypedTestPoint = createTestPoint;
export const createTypedTestFloorPlan = createTestFloorPlan;

// Alias to createMockFloorPlan for backward compatibility with tests
export const createMockFloorPlan = createTestFloorPlan;
export const createMockWall = createTestWall;
export const createMockRoom = createTestRoom;
export const createMockStroke = createTestStroke;

// Export types as well
export type { FloorPlan, Stroke, Room, Wall, Point, StrokeTypeLiteral, RoomTypeLiteral };
export { asStrokeType, asRoomType };
