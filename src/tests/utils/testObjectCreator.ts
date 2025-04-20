
import { 
  FloorPlan, 
  Stroke, 
  Wall, 
  Room, 
  Point, 
  createTestFloorPlan,
  createTestRoom,
  createTestStroke,
  createTestWall,
  createTestPoint
} from '@/types/floor-plan/unifiedTypes';

// Re-export all test creation functions from the unified types
export {
  createTestFloorPlan,
  createTestRoom,
  createTestStroke,
  createTestWall,
  createTestPoint
};

// Console log for debugging
console.log('Loading testObjectCreator.ts - using unified type definitions');
