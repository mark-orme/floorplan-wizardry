
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
export const GRID_SPACING = {
  SMALL: 10,
  LARGE: 100
};

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

/**
 * Default canvas dimensions
 */
export const DEFAULT_CANVAS_WIDTH = 800;
export const DEFAULT_CANVAS_HEIGHT = 600;

/**
 * Grid line widths
 */
export const SMALL_GRID_LINE_WIDTH = 0.5;
export const LARGE_GRID_LINE_WIDTH = 1;

/**
 * Grid creation limits
 */
export const MAX_SMALL_GRID_LINES = 200;
export const MAX_LARGE_GRID_LINES = 40;
export const GRID_EXTENSION_FACTOR = 1.2;

/**
 * Geometry constants
 */
export const FLOATING_POINT_TOLERANCE = 0.0001;
export const MIN_LINE_LENGTH = 2;
export const MIN_SHAPE_AREA = 4;
export const CLOSE_POINT_THRESHOLD = 5;
export const SHAPE_CLOSE_THRESHOLD = 10;
export const ANGLE_SNAP_THRESHOLD = 10; // degrees
export const DISTANCE_PRECISION = 2;
