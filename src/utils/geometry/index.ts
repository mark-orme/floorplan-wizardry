
/**
 * Geometry utilities module
 * Exports all geometry-related functions and constants
 * @module geometry
 */

// Re-export constants
export {
  GRID_SPACING,
  CLOSE_POINT_THRESHOLD,
  SHAPE_CLOSE_THRESHOLD,
  FLOATING_POINT_TOLERANCE,
  MIN_LINE_LENGTH,
  MIN_SHAPE_AREA,
  ANGLE_SNAP_THRESHOLD,
  LARGE_GRID_LINE_WIDTH,
  SMALL_GRID_LINE_WIDTH,
  AREA_PRECISION,
  DISTANCE_PRECISION
} from './constants';

// Re-export line operations
export * from './lineOperations';

// Re-export area calculations
export * from './areaCalculations';

// Re-export coordinate transforms
export * from './coordinateTransforms';

// Re-export midpoint calculation
export * from './midpointCalculation';

// Re-export straightening functions
export * from './straightening';
