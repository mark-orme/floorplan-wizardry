
/**
 * Geometry constants
 * @module utils/geometry/constants
 */

/**
 * Grid size constants for snapping
 */
export const GRID_SIZE = {
  SMALL: 10,
  LARGE: 50,
  DEFAULT: 25
};

/**
 * Tolerance constants for geometry operations
 */
export const TOLERANCE = {
  SMALL: 0.5,
  MEDIUM: 1.0,
  LARGE: 2.0
};

/**
 * Default grid size for general operations
 */
export const DEFAULT_GRID_SIZE = GRID_SIZE.DEFAULT;

/**
 * Default tolerance for geometry operations
 */
export const DEFAULT_TOLERANCE = TOLERANCE.MEDIUM;

/**
 * Precision for area calculations (decimal places)
 */
export const AREA_PRECISION = 2;

/**
 * Default threshold for straightening lines (in degrees)
 */
export const DEFAULT_STRAIGHTENING_THRESHOLD = 5;

/**
 * Threshold for wall alignment (in pixels)
 */
export const WALL_ALIGNMENT_THRESHOLD = 10;

/**
 * Default pixels per meter conversion
 */
export const PIXELS_PER_METER = 100;

