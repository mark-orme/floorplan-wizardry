
/**
 * Barrel file for Floor Plan types
 * Re-exports all floor plan types from the unified source
 * @module types/floor-plan/typesBarrel
 */

console.log('Loading Floor Plan types barrel file');

// Re-export all types from the unified types file
export type { 
  Point, 
  Stroke, 
  Wall, 
  Room, 
  FloorPlan, 
  FloorPlanMetadata,
  StrokeTypeLiteral,
  RoomTypeLiteral
} from './unifiedTypes';

export { 
  PaperSize, 
  asStrokeType, 
  asRoomType,
  createEmptyFloorPlan,
  createEmptyStroke,
  createEmptyWall,
  createEmptyRoom,
  createTestFloorPlan,
  createTestStroke,
  createTestWall,
  createTestRoom,
  createTestPoint
} from './unifiedTypes';
