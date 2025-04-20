
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
  asRoomType,
  createEmptyFloorPlan,
  createEmptyStroke,
  createEmptyWall,
  createEmptyRoom
} from '@/types/floor-plan/typesBarrel';

// Re-export all of these with proper type export syntax for isolated modules
export type { FloorPlan, Stroke, Wall, Room, Point, StrokeTypeLiteral, RoomTypeLiteral, FloorPlanMetadata };
export { asStrokeType, asRoomType, createEmptyFloorPlan, createEmptyStroke, createEmptyWall, createEmptyRoom };

// Export validator functions directly rather than re-exporting
// This ensures type-safe exports without circular references
export function validateStrokeType(type: string): StrokeTypeLiteral {
  return asStrokeType(type);
}

export function validateRoomType(type: string): RoomTypeLiteral {
  return asRoomType(type);
}

export const mapRoomType = validateRoomType;
