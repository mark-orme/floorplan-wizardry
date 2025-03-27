
/**
 * Numeric constants for the application
 */

/** 
 * Number of pixels per meter (for scale calculations)
 * @type {number}
 */
export const PIXELS_PER_METER = 100;

/**
 * Default grid spacing in pixels
 * @type {number}
 */
export const GRID_SPACING = 100;

/**
 * Small grid spacing in pixels (0.1m)
 * @type {number}
 */
export const SMALL_GRID = 10;

/**
 * Large grid spacing in pixels (1m)
 * @type {number}
 */
export const LARGE_GRID = 100;

/**
 * Default line thickness for drawing in pixels
 * @type {number}
 */
export const DEFAULT_LINE_THICKNESS = 2;

/**
 * Maximum number of history states for undo/redo
 * @type {number}
 */
export const MAX_HISTORY_STATES = 50;

/**
 * Maximum number of objects per canvas for performance
 * @type {number}
 */
export const MAX_OBJECTS_PER_CANVAS = 5000;

/**
 * Floating point calculation tolerance
 * @type {number}
 */
export const FLOATING_POINT_TOLERANCE = 0.0001;

/**
 * Minimum line length in pixels to be considered a valid line
 * @type {number}
 */
export const MIN_LINE_LENGTH = 5;

/**
 * Minimum shape area in square pixels to be considered a valid shape
 * @type {number}
 */
export const MIN_SHAPE_AREA = 100;

/**
 * Threshold in pixels to consider points close to each other
 * @type {number}
 */
export const CLOSE_POINT_THRESHOLD = 10;

/**
 * Threshold in pixels to consider a shape closed
 * @type {number}
 */
export const SHAPE_CLOSE_THRESHOLD = 15;

/**
 * Threshold in degrees for angle snapping
 * @type {number}
 */
export const ANGLE_SNAP_THRESHOLD = 5;

/**
 * Width of large grid lines in pixels
 * @type {number}
 */
export const LARGE_GRID_LINE_WIDTH = 1.0;

/**
 * Width of small grid lines in pixels
 * @type {number}
 */
export const SMALL_GRID_LINE_WIDTH = 0.5;

/**
 * Number of decimal places for area calculations
 * @type {number}
 */
export const AREA_PRECISION = 2;

/**
 * Number of decimal places for distance measurements
 * @type {number}
 */
export const DISTANCE_PRECISION = 2;

/**
 * Default canvas width in pixels
 * @type {number}
 */
export const DEFAULT_CANVAS_WIDTH = 800;

/**
 * Default canvas height in pixels
 * @type {number}
 */
export const DEFAULT_CANVAS_HEIGHT = 600;

/**
 * Canvas default width for backward compatibility
 * @type {number}
 */
export const CANVAS_DEFAULT_WIDTH = 800;

/**
 * Canvas default height for backward compatibility
 * @type {number}
 */
export const CANVAS_DEFAULT_HEIGHT = 600;

/**
 * Maximum number of small grid lines for performance
 * @type {number}
 */
export const MAX_SMALL_GRID_LINES = 500;

/**
 * Maximum number of large grid lines for performance
 * @type {number}
 */
export const MAX_LARGE_GRID_LINES = 100;

/**
 * Factor to extend grid beyond canvas edges
 * @type {number}
 */
export const GRID_EXTENSION_FACTOR = 2.0;

/**
 * Major grid spacing (equivalent to LARGE_GRID)
 * @type {number}
 */
export const GRID_MAJOR_SPACING = 100;

/**
 * Maximum number of grid creation attempts
 * @type {number}
 */
export const MAX_GRID_CREATION_ATTEMPTS = 3;

/**
 * Minimum interval between grid creation attempts in ms
 * @type {number}
 */
export const MIN_GRID_CREATION_INTERVAL = 300;
