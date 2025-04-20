
/**
 * Central type definition exports
 * Re-exports all application types from a single location
 */

// Export Point type
export type { Point } from './floor-plan/unifiedTypes';

// Export debug info types
export type { DebugInfoState } from './core/DebugInfo';
export { DEFAULT_DEBUG_STATE } from './core/DebugInfo';

// Export zoom options type
export type { ZoomOptions } from './core/ZoomOptions';
export { ZOOM_CONSTANTS } from './core/ZoomOptions';

// Export types from the unified floor plan types
export type {
  FloorPlan,
  Room,
  Wall,
  Stroke,
  StrokeTypeLiteral,
  RoomTypeLiteral,
  FloorPlanMetadata
} from './floor-plan/unifiedTypes';

export {
  PaperSize,
  asStrokeType,
  asRoomType,
  createEmptyFloorPlan,
  createEmptyRoom,
  createEmptyStroke,
  createEmptyWall,
  createTestFloorPlan,
  createTestRoom,
  createTestStroke,
  createTestWall,
  createTestPoint
} from './floor-plan/unifiedTypes';

// Export testing mock interfaces
export type { ICanvasMock } from './testing/ICanvasMock';
export { createMinimalCanvasMock, asMockCanvas } from './testing/ICanvasMock';

// Console log for debugging imports
console.log('Loading types/index.ts - using unified type definitions');
