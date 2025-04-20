
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

// Re-export all of these with proper type export syntax for isolated modules
export type { FloorPlan };
export type { Stroke };
export type { Wall };
export type { Room };
export type { Point };
export type { StrokeTypeLiteral };
export type { RoomTypeLiteral };
export type { FloorPlanMetadata };
export { asStrokeType, asRoomType };

// Also export validator functions for backwards compatibility
export { validateStrokeType, validateRoomType, mapRoomType } from './validators';
