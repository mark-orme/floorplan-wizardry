
/**
 * Geometry constants module
 * Defines constants used for geometric calculations
 * @module geometry/constants
 */

import { 
  PIXELS_PER_METER, 
  FLOATING_POINT_TOLERANCE,
  MIN_LINE_LENGTH,
  MIN_SHAPE_AREA,
  CLOSE_POINT_THRESHOLD,
  SHAPE_CLOSE_THRESHOLD,
  ANGLE_SNAP_THRESHOLD,
  LARGE_GRID_LINE_WIDTH,
  SMALL_GRID_LINE_WIDTH,
  AREA_PRECISION,
  DISTANCE_PRECISION,
  GRID_SPACING
} from '@/constants/numerics';

// Re-export constants
export { 
  PIXELS_PER_METER, 
  FLOATING_POINT_TOLERANCE,
  MIN_LINE_LENGTH,
  MIN_SHAPE_AREA,
  CLOSE_POINT_THRESHOLD,
  SHAPE_CLOSE_THRESHOLD,
  ANGLE_SNAP_THRESHOLD,
  LARGE_GRID_LINE_WIDTH,
  SMALL_GRID_LINE_WIDTH,
  AREA_PRECISION,
  DISTANCE_PRECISION,
  GRID_SPACING
};

// Angular constants
export const DEGREES_TO_RADIANS = Math.PI / 180;
export const RADIANS_TO_DEGREES = 180 / Math.PI;

// Standard angles for snapping (in degrees)
export const STANDARD_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315];

// Precision constants
export const COORDINATE_PRECISION = 3; // Decimal places for coordinate display
export const ANGLE_PRECISION = 1; // Decimal places for angle display
