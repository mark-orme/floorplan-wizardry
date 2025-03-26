
/**
 * Geometry constants for calculations and operations
 * @module constants
 */

/**
 * Grid spacing in meters
 * @constant {number}
 */
export const GRID_SPACING = 0.1;

/**
 * Threshold for considering points as close/identical (in pixels)
 * Used in shape closing checks
 * @constant {number}
 */
export const CLOSE_POINT_THRESHOLD = 10;

/**
 * Specific threshold for shape closing detection (in pixels)
 * @constant {number}
 */
export const SHAPE_CLOSE_THRESHOLD = 15;

/**
 * Floating point comparison tolerance
 * Used for numerical equality checks
 * @constant {number}
 */
export const FLOATING_POINT_TOLERANCE = 0.00001;

/**
 * Minimum distance between points to be considered a valid line (in pixels)
 * @constant {number}
 */
export const MIN_LINE_LENGTH = 5;

/**
 * Minimum area for a shape to be considered valid (in square pixels)
 * @constant {number}
 */
export const MIN_SHAPE_AREA = 100;

/**
 * Angle snap threshold in degrees
 * Used for forcing lines to 0, 45, 90 degrees etc.
 * @constant {number}
 */
export const ANGLE_SNAP_THRESHOLD = 10;

/**
 * Pixel width of the large grid lines
 * @constant {number}
 */
export const LARGE_GRID_LINE_WIDTH = 1;

/**
 * Pixel width of the small grid lines
 * @constant {number}
 */
export const SMALL_GRID_LINE_WIDTH = 0.5;

/**
 * Grid area calculation precision
 * Number of decimal places for calculated areas
 * @constant {number}
 */
export const AREA_PRECISION = 2;

/**
 * Distance precision for measurements
 * @constant {number}
 */
export const DISTANCE_PRECISION = 2;
