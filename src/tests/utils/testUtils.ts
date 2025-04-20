
import { 
  FloorPlan, 
  Room, 
  Stroke, 
  Wall,
  Point,
  asStrokeType,
  asRoomType,
  createTestFloorPlan,
  createTestRoom,
  createTestStroke,
  createTestWall
} from '@/types/floor-plan/unifiedTypes';

// Re-export testing utilities
export { 
  createTestFloorPlan,
  createTestRoom,
  createTestStroke, 
  createTestWall
};

/**
 * Creates a test point with x and y coordinates
 * @param x X coordinate
 * @param y Y coordinate
 * @returns Point object
 */
export function createTestPoint(x = 0, y = 0): Point {
  return { x, y };
}
