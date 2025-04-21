
/**
 * Barrel file for Floor Plan types
 * Re-exports all floor plan types from the unified source
 * @module types/floor-plan/typesBarrel
 */

console.log('Loading Floor Plan types barrel file');

// Re-export types using export type syntax
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

// Re-export values and functions
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
