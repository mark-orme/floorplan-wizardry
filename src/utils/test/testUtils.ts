
/**
 * Test utilities
 * Re-exports specific test utility functions
 * @module utils/test/testUtils
 */

// Re-export specific utilities from test fixtures
import { createTestPoint, createMockFunctionParams } from './mockUtils';
import { adaptRoom, adaptWall, adaptStroke } from '@/utils/typeAdapters';
import {
  createTestFloorPlan,
  createTestRoom,
  createTestStroke,
  createTestWall
} from './typedTestFixtures';

// Export all test utilities
export {
  createTestPoint,
  createMockFunctionParams,
  createTestFloorPlan,
  createTestRoom,
  createTestStroke,
  createTestWall,
  adaptRoom,
  adaptWall,
  adaptStroke
};
