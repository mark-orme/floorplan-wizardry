
/**
 * Floor Plan Adapter Index
 * Re-exports all adapter utilities
 */

// Export converters
export {
  appToCoreFloorPlans,
  coreToAppFloorPlans,
  convertWall,
  convertRoom,
  convertStroke,
  convertMetadata
} from './converters';

// Export validators
export {
  validatePoint,
  validateColor,
  validateTimestamp,
  validateStrokeType
} from './validators';

// Export type mappers
export {
  mapRoomType,
  mapStrokeType
} from './typeMappers';

// Export utility functions
export {
  calculateArea,
  calculatePerimeter
} from './geometryUtils';
