
/**
 * Re-export all floor plan types from core
 * @module types/floorPlanTypes
 */

export type {
  Floor,
  FloorOptions,
  FloorMetadata,
  FloorPlan,
  PaperSize,
  Stroke,
  Wall,
  Room,
} from './core/FloorPlan';

export { createFloorPlan } from './core/FloorPlan';
