
/**
 * Types for the floor plan adapter
 * Re-exports type definitions from the floor plan barrel
 * @module utils/floorPlanAdapter/types
 */

// Re-export from the floor plan barrel types
import {
  FloorPlan,
  Stroke,
  Wall,
  Room,
  Point,
  StrokeTypeLiteral,
  RoomTypeLiteral,
  FloorPlanMetadata,
  asStrokeType,
  asRoomType
} from '@/types/floor-plan/typesBarrel';

// Re-export all of these
export {
  FloorPlan,
  Stroke,
  Wall,
  Room,
  Point,
  StrokeTypeLiteral,
  RoomTypeLiteral,
  FloorPlanMetadata,
  asStrokeType,
  asRoomType
};

// We don't re-export these since they're now in validators.ts
// They are imported directly from there in index.ts
