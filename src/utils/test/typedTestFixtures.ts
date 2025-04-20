
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
  asRoomType,
  createTestFloorPlan as createTypedTestFloorPlan,
  createTestStroke as createTypedTestStroke,
  createTestWall as createTypedTestWall,
  createTestRoom as createTypedTestRoom,
  createTestPoint as createTypedTestPoint
} from '@/types/floor-plan/unifiedTypes';

// Export the functions directly from unifiedTypes.ts
export const createTestStroke = createTypedTestStroke;
export const createTestWall = createTypedTestWall;
export const createTestRoom = createTypedTestRoom;
export const createTestPoint = createTypedTestPoint;
export const createTestFloorPlan = createTypedTestFloorPlan;
export const createTypedTestFloorPlan = createTypedTestFloorPlan; // Export alias to fix import issues

// Alias to createMockFloorPlan for backward compatibility with tests
export const createMockFloorPlan = createTypedTestFloorPlan;
export const createMockWall = createTypedTestWall;
export const createMockRoom = createTypedTestRoom;
export const createMockStroke = createTypedTestStroke;

// Export types as well
export type { FloorPlan, Stroke, Room, Wall, Point, StrokeTypeLiteral, RoomTypeLiteral };
export { asStrokeType, asRoomType };
