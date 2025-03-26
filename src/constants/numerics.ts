
/**
 * Numeric constants used throughout the application
 * Centralizes numeric values to avoid magic numbers
 * @module numerics
 */

/**
 * Grid spacing in meters
 * Default grid size for the canvas grid system
 * @constant {number}
 */
export const GRID_SPACING = 0.5;

/**
 * Pixels per meter conversion ratio
 * Used to convert between real-world meters and pixels on screen
 * @constant {number}
 */
export const PIXELS_PER_METER = 100;

/**
 * Small grid cell size in meters
 * Used for the smaller grid lines
 * @constant {number}
 */
export const SMALL_GRID = 0.5;

/**
 * Large grid cell size in meters
 * Used for the larger, more prominent grid lines
 * @constant {number}
 */
export const LARGE_GRID = 1.0;

/**
 * Maximum number of history states to keep
 * For undo/redo functionality
 * @constant {number}
 */
export const MAX_HISTORY_STATES = 100;

/**
 * Maximum number of objects allowed on a canvas
 * For performance considerations
 * @constant {number}
 */
export const MAX_OBJECTS_PER_CANVAS = 5000;

/**
 * Default line thickness in pixels
 * Used as the starting thickness for drawing tools
 * @constant {number}
 */
export const DEFAULT_LINE_THICKNESS = 2;

/**
 * Threshold in pixels to consider points as close
 * Used for snapping and selection
 * @constant {number}
 */
export const CLOSE_POINT_THRESHOLD = 10;

/**
 * Threshold in pixels to consider a shape as closed
 * Used for polygon completion
 * @constant {number}
 */
export const SHAPE_CLOSE_THRESHOLD = 15;

/**
 * Tolerance for floating point comparisons
 * Used when checking equality of coordinates
 * @constant {number}
 */
export const FLOATING_POINT_TOLERANCE = 0.0001;

/**
 * Minimum line length in pixels to be considered valid
 * Prevents creation of tiny/accidental lines
 * @constant {number}
 */
export const MIN_LINE_LENGTH = 5;

/**
 * Minimum shape area in square pixels to be considered valid
 * Prevents creation of tiny/accidental shapes
 * @constant {number}
 */
export const MIN_SHAPE_AREA = 100;

/**
 * Threshold in degrees for angle snapping
 * Used to determine when to snap to preset angles
 * @constant {number}
 */
export const ANGLE_SNAP_THRESHOLD = 5;

/**
 * Width of large grid lines in pixels
 * Used for visual styling of the grid
 * @constant {number}
 */
export const LARGE_GRID_LINE_WIDTH = 1;

/**
 * Width of small grid lines in pixels
 * Used for visual styling of the grid
 * @constant {number}
 */
export const SMALL_GRID_LINE_WIDTH = 0.5;

/**
 * Precision for area calculations
 * Number of decimal places to round to
 * @constant {number}
 */
export const AREA_PRECISION = 2;

/**
 * Precision for distance measurements
 * Number of decimal places to round to
 * @constant {number}
 */
export const DISTANCE_PRECISION = 2;
