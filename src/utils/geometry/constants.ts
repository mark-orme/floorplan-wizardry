
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
  SNAP_THRESHOLD,
  LARGE_GRID_LINE_WIDTH,
  SMALL_GRID_LINE_WIDTH,
  AREA_PRECISION,
  DISTANCE_PRECISION,
  GRID_SPACING,
  ANGLE_SNAP_THRESHOLD
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

/**
 * Angular conversion constants
 */
export const ANGLE_CONVERSION = {
  /**
   * Conversion factor from degrees to radians
   * @constant {number}
   */
  DEGREES_TO_RADIANS: Math.PI / 180,
  
  /**
   * Conversion factor from radians to degrees
   * @constant {number}
   */
  RADIANS_TO_DEGREES: 180 / Math.PI
};

/**
 * Angle constants
 */
export const ANGLES = {
  /**
   * Standard angles for snapping (in degrees)
   * @constant {number[]}
   */
  STANDARD: [0, 45, 90, 135, 180, 225, 270, 315]
};

/**
 * Precision constants
 */
export const PRECISION = {
  /**
   * Decimal places for coordinate display
   * @constant {number}
   */
  COORDINATE: 3,
  
  /**
   * Decimal places for angle display
   * @constant {number}
   */
  ANGLE: 1
};

/**
 * Distance constants
 */
export const DISTANCE = {
  /**
   * Minimum distance to show measurement tooltip (in meters)
   * @constant {number}
   */
  MIN_VISIBLE: 0.05,
  
  /**
   * Default max width for tooltips in pixels
   * @constant {number}
   */
  DEFAULT_TOOLTIP_MAX_WIDTH: 120
};

/**
 * Straightening constants
 */
export const STRAIGHTENING = {
  /**
   * Default threshold for line straightening (in degrees)
   * @constant {number}
   */
  DEFAULT_THRESHOLD: 5,
  
  /**
   * Threshold for detecting aligned walls (in degrees)
   * @constant {number}
   */
  WALL_ALIGNMENT_THRESHOLD: 3
};

/**
 * Origin point
 * @constant {Object}
 */
export const ORIGIN_POINT = { x: 0, y: 0 };

/**
 * Rounding constants
 */
export const ROUNDING = {
  /**
   * Factor used for consistent rounding in area calculations
   * @constant {number}
   */
  FACTOR: 100
};

// For backward compatibility
export const DEGREES_TO_RADIANS = ANGLE_CONVERSION.DEGREES_TO_RADIANS;
export const RADIANS_TO_DEGREES = ANGLE_CONVERSION.RADIANS_TO_DEGREES;
export const STANDARD_ANGLES = ANGLES.STANDARD;
export const COORDINATE_PRECISION = PRECISION.COORDINATE;
export const ANGLE_PRECISION = PRECISION.ANGLE;
export const MIN_VISIBLE_DISTANCE = DISTANCE.MIN_VISIBLE;
export const DEFAULT_TOOLTIP_MAX_WIDTH = DISTANCE.DEFAULT_TOOLTIP_MAX_WIDTH;
export const DEFAULT_STRAIGHTENING_THRESHOLD = STRAIGHTENING.DEFAULT_THRESHOLD;
export const WALL_ALIGNMENT_THRESHOLD = STRAIGHTENING.WALL_ALIGNMENT_THRESHOLD;
export const ROUNDING_FACTOR = ROUNDING.FACTOR;
