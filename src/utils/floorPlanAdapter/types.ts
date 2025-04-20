
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

// Re-export validateStrokeType and validateRoomType for backward compatibility
export { validateStrokeType, validateRoomType, mapRoomType } from '../floorPlanAdapter';
