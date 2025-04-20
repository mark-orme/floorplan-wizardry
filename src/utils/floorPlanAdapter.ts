
/**
 * Floor plan adapter
 * Provides utilities for adapting between different floor plan formats
 * @module utils/floorPlanAdapter
 */

// Re-export everything from the converters module
export {
  adaptFloorPlan,
  appToCoreFloorPlans,
  appToCoreFloorPlan,
  coreToAppFloorPlans,
  coreToAppFloorPlan,
  validatePoint,
  validateColor,
  validateTimestamp,
  validateStrokeType,
  asStrokeType,
  validateRoomType,
  asRoomType,
  mapRoomType,
  normalizeDrawingMode
} from './floorPlanAdapter/converters';

// Re-export validators from the validators module
export {
  validatePoint,
  validateColor,
  validateTimestamp,
  validateStrokeType,
  validateRoomType,
  mapRoomType,
  logValidation
} from './floorPlanAdapter/validators';
