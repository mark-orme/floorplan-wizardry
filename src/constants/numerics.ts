
/**
 * Numeric constants used throughout the application
 * @module constants/numerics
 */

/**
 * Grid spacing in pixels (represents 10cm in our scale)
 * @constant {number}
 */
export const GRID_SPACING = 10;

/**
 * Grid major spacing (1m in our scale) in pixels
 * @constant {number}
 */
export const GRID_MAJOR_SPACING = 100;

/**
 * Canvas default width in pixels
 * @constant {number}
 */
export const CANVAS_DEFAULT_WIDTH = 800;

/**
 * Canvas default height in pixels
 * @constant {number}
 */
export const CANVAS_DEFAULT_HEIGHT = 600;

/**
 * Canvas minimum width in pixels
 * @constant {number}
 */
export const CANVAS_MIN_WIDTH = 200;

/**
 * Canvas minimum height in pixels
 * @constant {number}
 */
export const CANVAS_MIN_HEIGHT = 200;

/**
 * Maximum grid creation attempts
 * @constant {number}
 */
export const MAX_GRID_CREATION_ATTEMPTS = 3;

/**
 * Minimum grid creation interval (throttle) in ms
 * @constant {number}
 */
export const MIN_GRID_CREATION_INTERVAL = 500;

/**
 * Precision for rounding measurements for display
 * @constant {number}
 */
export const MEASUREMENT_PRECISION = 2;

/**
 * Default canvas width for initialization
 * @constant {number}
 */
export const DEFAULT_CANVAS_WIDTH = 800;

/**
 * Default canvas height for initialization
 * @constant {number}
 */
export const DEFAULT_CANVAS_HEIGHT = 600;

/**
 * Pixels per meter ratio for scaling
 * @constant {number}
 */
export const PIXELS_PER_METER = 100;

/**
 * Small grid size in pixels (0.1m)
 * @constant {number}
 */
export const SMALL_GRID = 10;

/**
 * Large grid size in pixels (1.0m)
 * @constant {number}
 */
export const LARGE_GRID = 100;

/**
 * Maximum number of states to keep in history
 * @constant {number}
 */
export const MAX_HISTORY_STATES = 50;

/**
 * Maximum number of objects allowed per canvas
 * @constant {number}
 */
export const MAX_OBJECTS_PER_CANVAS = 1000;

/**
 * Default line thickness for drawing
 * @constant {number}
 */
export const DEFAULT_LINE_THICKNESS = 2;

/**
 * Precision for area calculations
 * @constant {number}
 */
export const AREA_PRECISION = 2;

/**
 * Floating point comparison tolerance
 * @constant {number}
 */
export const FLOATING_POINT_TOLERANCE = 0.0001;

/**
 * Minimum line length in pixels
 * @constant {number}
 */
export const MIN_LINE_LENGTH = 5;

/**
 * Minimum shape area in square pixels
 * @constant {number}
 */
export const MIN_SHAPE_AREA = 100;

/**
 * Threshold for considering points as close
 * @constant {number}
 */
export const CLOSE_POINT_THRESHOLD = 10;

/**
 * Threshold for detecting closed shapes
 * @constant {number}
 */
export const SHAPE_CLOSE_THRESHOLD = 20;

/**
 * Threshold for snapping angles in degrees
 * @constant {number}
 */
export const ANGLE_SNAP_THRESHOLD = 5;

/**
 * Line width for large grid lines
 * @constant {number}
 */
export const LARGE_GRID_LINE_WIDTH = 1;

/**
 * Line width for small grid lines
 * @constant {number}
 */
export const SMALL_GRID_LINE_WIDTH = 0.5;

/**
 * Precision for distance display
 * @constant {number}
 */
export const DISTANCE_PRECISION = 2;

/**
 * Maximum number of small grid lines
 * @constant {number}
 */
export const MAX_SMALL_GRID_LINES = 200;

/**
 * Maximum number of large grid lines
 * @constant {number}
 */
export const MAX_LARGE_GRID_LINES = 50;

/**
 * Grid extension factor beyond canvas edges
 * @constant {number}
 */
export const GRID_EXTENSION_FACTOR = 1.2;
