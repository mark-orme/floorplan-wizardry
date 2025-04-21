/**
 * Type-safe test fixtures (refactored as barrel file)
 * @module utils/test/typedTestFixtures
 */

// Individual interfaces (keep for typing in tests)
export type { Room, Wall, Stroke, FloorPlan } from '@/types/floor-plan/unifiedTypes';

// Export the utility functions from the new focused files:
export { createTestPoint } from './fixtures/createTestPoint';
export { createTestStroke } from './fixtures/createTestStroke';
export { createTestWall } from './fixtures/createTestWall';
export { createTestRoom } from './fixtures/createTestRoom';
export { createTestFloorPlan } from './fixtures/createTestFloorPlan';

// Re-export adapters (can be from typeAdapters or kept here if needed)
export { asStrokeType, asRoomType } from '@/utils/typeAdapters';
