
/**
 * Constants for geometry calculations and grid operations
 * @module geometryConstants
 */

/**
 * Precision for distance measurements (0.1m)
 * @constant
 */
export const DISTANCE_PRECISION = 0.1;

/**
 * Threshold for considering points "close" (5cm)
 * @constant
 */
export const CLOSE_POINT_THRESHOLD = 0.05;

/**
 * Tolerance for floating point comparisons (1mm)
 * @constant
 */
export const FLOATING_POINT_TOLERANCE = 0.001;

/**
 * Bias factor for favoring horizontal lines
 * @constant
 */
export const HORIZONTAL_BIAS = 1.2;

/**
 * Bias factor for favoring vertical lines
 * @constant
 */
export const VERTICAL_BIAS = 1.2;
