
/**
 * Numeric constants used throughout the application
 * @module constants/numerics
 */

/**
 * Pixels per meter for unit conversion
 */
export const PIXELS_PER_METER = 100;

/**
 * Grid spacing in pixels
 */
export const GRID_SPACING = 10;

/**
 * Grid size constants for small and large grid lines
 */
export const GRID_SIZE = {
  SMALL: 10,
  LARGE: 100
};

/**
 * Grid size constants - backward compatibility
 */
export const SMALL_GRID = GRID_SIZE.SMALL;
export const LARGE_GRID = GRID_SIZE.LARGE;

/**
 * Maximum number of history states to keep
 */
export const MAX_HISTORY_STATES = 100;

/**
 * Default line thickness in pixels
 */
export const DEFAULT_LINE_THICKNESS = 2;

/**
 * Precision for area calculations (decimal places)
 */
export const AREA_PRECISION = 2;

/**
 * Maximum number of objects per canvas
 */
export const MAX_OBJECTS_PER_CANVAS = 1000;

/**
 * Threshold for snapping to grid in pixels
 */
export const SNAP_THRESHOLD = 5;

/**
 * Zoom constraints
 */
export const ZOOM_CONSTRAINTS = {
  MIN: 0.1,
  MAX: 10,
  DEFAULT: 1
};

/**
 * Zoom level steps
 */
export const ZOOM_LEVEL_STEPS = [0.1, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 3, 5, 10];
