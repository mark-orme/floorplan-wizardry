
/**
 * Geometry constants module
 * Constants for geometry calculations and conversions
 * @module geometryConstants
 */

/**
 * Horizontal bias factor for line straightening
 * Higher values make it easier to draw horizontal lines
 */
export const HORIZONTAL_BIAS = 1.5;

/**
 * Vertical bias factor for line straightening
 * Higher values make it easier to draw vertical lines 
 */
export const VERTICAL_BIAS = 1.5;

/**
 * Distance precision for measurement calculations
 * Rounds measurements to this precision (0.1m)
 */
export const DISTANCE_PRECISION = 0.1;

/**
 * Measurement update interval in milliseconds
 * How frequently to update measurements during drawing
 */
export const MEASUREMENT_UPDATE_INTERVAL = 33;

/**
 * Threshold for determining if shapes are closed
 * Maximum distance between start and end points to be considered closed
 */
export const SHAPE_CLOSE_THRESHOLD = 0.3;

/**
 * Minimum line length in meters to be straightened
 * Lines shorter than this may not be straightened
 */
export const MIN_LINE_LENGTH = 0.2;

/**
 * Maximum angle deviation for straightening
 * Lines with angle deviations less than this will be straightened
 */
export const MAX_ANGLE_DEVIATION = 10;

/**
 * Grid spacing in meters (0.1m = 10cm)
 */
export const GRID_SPACING = 0.1;

/**
 * Threshold for determining if a point is close to another
 * Used for point snapping and shape closing detection
 */
export const CLOSE_POINT_THRESHOLD = 0.15;

/**
 * Floating point tolerance for equality comparisons
 * Used to handle JS floating point arithmetic issues
 */
export const FLOATING_POINT_TOLERANCE = 0.0001;
