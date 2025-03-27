
/**
 * Floor plan types module
 * Re-exports all floor plan related types
 * @module types/floorPlanTypes
 */

// Re-export all types from the core FloorPlan module
export type {
  FloorPlan,
  FloorPlanMetadata,
  Wall,
  Room,
  Stroke,
  StrokeType,
  RoomType,
  Floor
} from './core/FloorPlan';

export {
  PaperSize,
  stringToPaperSize
} from './core/FloorPlan';

// Re-export Point for use with floor plan types
export type { Point } from './core/Point';
