
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
  asRoomType,
  createTestFloorPlan as createUnifiedTestFloorPlan,
  createTestStroke as createUnifiedTestStroke,
  createTestWall as createUnifiedTestWall,
  createTestRoom as createUnifiedTestRoom,
  createTestPoint as createUnifiedTestPoint
} from '@/types/floor-plan/unifiedTypes';

/**
 * Create a test point with default values
 * @param overrides - Values to override defaults
 * @returns A Point object
 */
export const createTestPoint = (overrides: Partial<Point> = {}): Point => createUnifiedTestPoint(overrides);

/**
 * Create a test stroke with default values
 * @param overrides - Values to override defaults
 * @returns A Stroke object
 */
export const createTestStroke = (overrides: Partial<Stroke> = {}): Stroke => createUnifiedTestStroke(overrides);

/**
 * Create a test wall with default values
 * @param overrides - Values to override defaults
 * @returns A Wall object
 */
export const createTestWall = (overrides: Partial<Wall> = {}): Wall => createUnifiedTestWall(overrides);

/**
 * Create a test room with default values
 * @param overrides - Values to override defaults
 * @returns A Room object
 */
export const createTestRoom = (overrides: Partial<Room> = {}): Room => createUnifiedTestRoom(overrides);

/**
 * Create a test floor plan with default values
 * @param overrides - Values to override defaults
 * @returns A FloorPlan object
 */
export const createTestFloorPlan = (overrides: Partial<FloorPlan> = {}): FloorPlan => createUnifiedTestFloorPlan(overrides);

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
