
/**
 * Floor Plan Adapter index
 * Re-exports all adapter functionality
 * @module utils/floorPlanAdapter
 */

// Re-export converters
export {
  adaptFloorPlan,
  appToCoreFloorPlans,
  appToCoreFloorPlan,
  coreToAppFloorPlans,
  coreToAppFloorPlan
} from './converters';

// Re-export validators
export {
  validateStrokeType,
  validateRoomType,
  validatePoint,
  validateColor,
  validateTimestamp,
  mapRoomType
} from './validators';

// Re-export types 
export type {
  FloorPlan,
  Stroke,
  Wall,
  Room,
  Point,
  StrokeTypeLiteral,
  RoomTypeLiteral,
  FloorPlanMetadata
} from './types';

export { asStrokeType, asRoomType } from './types';

/**
 * Normalizes a drawing mode value to ensure it's a valid DrawingMode
 * @param mode The drawing mode to normalize
 * @returns A valid DrawingMode enum value
 */
export { normalizeDrawingMode } from '../floorPlanAdapter';

/**
 * Creates an empty floor plan
 * @param index Index for the new floor plan
 * @returns An empty floor plan
 */
export { createEmptyFloorPlan } from '../floorPlanAdapter';
