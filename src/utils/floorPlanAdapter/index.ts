
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
  coreToAppFloorPlan,
  normalizeDrawingMode,
  validateStrokeType,
  asStrokeType,
  validateRoomType,
  asRoomType,
  VALID_STROKE_TYPES,
  VALID_ROOM_TYPES
} from './converters';

// Re-export validators
export {
  validatePoint,
  validateColor,
  validateTimestamp,
  validateStrokeType as validateStrokeTypeValidator,
  validateRoomType as validateRoomTypeValidator,
  mapRoomType,
  logValidation
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

/**
 * Creates an empty floor plan
 * @param index Index for the new floor plan
 * @returns An empty floor plan
 */
export function createEmptyFloorPlan(index: number = 0): any {
  const { createEmptyFloorPlan } = require('../floor-plan/unifiedTypes');
  return createEmptyFloorPlan(index);
}
