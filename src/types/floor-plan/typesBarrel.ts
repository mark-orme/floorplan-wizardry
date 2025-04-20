
/**
 * Floor Plan Types Barrel
 * Re-exports all floor plan types from a single source of truth
 * to prevent duplicate type definitions
 * @module types/floor-plan/typesBarrel
 */

// Import all types from floorPlanTypes.ts (main source of truth)
import {
  FloorPlan,
  Stroke,
  Wall,
  Room,
  Point,
  StrokeTypeLiteral,
  RoomTypeLiteral,
  FloorPlanMetadata,
  PaperSize,
  DrawingMode
} from '../floorPlanTypes';

// Re-export all types
export {
  FloorPlan,
  Stroke,
  Wall,
  Room,
  Point,
  StrokeTypeLiteral,
  RoomTypeLiteral,
  FloorPlanMetadata,
  PaperSize,
  DrawingMode
};
