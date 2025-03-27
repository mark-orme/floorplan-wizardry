
/**
 * Numeric constants used throughout the application
 * @module constants/numerics
 */

/**
 * Pixels per meter for scale conversion
 * @constant {number}
 */
export const PIXELS_PER_METER = 100;

/**
 * Grid spacing in pixels
 * @constant {number}
 */
export const GRID_SPACING = 10;

/**
 * Small grid cell size in pixels
 * @constant {number}
 */
export const SMALL_GRID = 10;

/**
 * Large grid cell size in pixels
 * @constant {number}
 */
export const LARGE_GRID = 50;

/**
 * Maximum number of history states to keep
 * @constant {number}
 */
export const MAX_HISTORY_STATES = 50;

/**
 * Maximum number of objects allowed per canvas
 * @constant {number}
 */
export const MAX_OBJECTS_PER_CANVAS = 2000;

/**
 * Default line thickness in pixels
 * @constant {number}
 */
export const DEFAULT_LINE_THICKNESS = 2;

/**
 * Precision for area calculations (decimal places)
 * @constant {number}
 */
export const AREA_PRECISION = 2;

/**
 * Default zoom level
 * @constant {number}
 */
export const DEFAULT_ZOOM = 1.0;

/**
 * Minimum zoom level
 * @constant {number}
 */
export const MIN_ZOOM = 0.1;

/**
 * Maximum zoom level
 * @constant {number}
 */
export const MAX_ZOOM = 10.0;

/**
 * Floating point tolerance for geometry calculations
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
export const MIN_SHAPE_AREA = 25;

/**
 * Threshold for considering points as close in pixels
 * @constant {number}
 */
export const CLOSE_POINT_THRESHOLD = 10;

/**
 * Threshold for closing shapes in pixels
 * @constant {number}
 */
export const SHAPE_CLOSE_THRESHOLD = 15;

/**
 * Threshold for snapping angles in degrees
 * @constant {number}
 */
export const ANGLE_SNAP_THRESHOLD = 5;

/**
 * Width of large grid lines in pixels
 * @constant {number}
 */
export const LARGE_GRID_LINE_WIDTH = 1;

/**
 * Width of small grid lines in pixels
 * @constant {number}
 */
export const SMALL_GRID_LINE_WIDTH = 0.5;

/**
 * Precision for distance measurements (decimal places)
 * @constant {number}
 */
export const DISTANCE_PRECISION = 2;

/**
 * Default canvas width in pixels
 * @constant {number}
 */
export const DEFAULT_CANVAS_WIDTH = 800;

/**
 * Default canvas height in pixels
 * @constant {number}
 */
export const DEFAULT_CANVAS_HEIGHT = 600;

/**
 * Maximum number of small grid lines to render
 * @constant {number}
 */
export const MAX_SMALL_GRID_LINES = 500;

/**
 * Maximum number of large grid lines to render
 * @constant {number}
 */
export const MAX_LARGE_GRID_LINES = 100;

/**
 * Factor by which to extend grid beyond canvas edges
 * @constant {number}
 */
export const GRID_EXTENSION_FACTOR = 1.5;
