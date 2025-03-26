
/**
 * Central module for numeric constants used throughout the application
 * Each constant has documentation explaining its purpose and usage
 * @module numerics
 */

/**
 * Coordinates and measurements
 */

/**
 * Pixels per meter for coordinate conversion
 * Used for translating between real-world and screen coordinates
 * @constant {number}
 */
export const PIXELS_PER_METER = 100;

/**
 * Grid spacing in meters (0.1m = 10cm)
 * Defines the smallest grid subdivision
 * @constant {number}
 */
export const GRID_SPACING = 0.1;

/**
 * Small grid size in pixels (10px)
 * Derived from GRID_SPACING * PIXELS_PER_METER
 * @constant {number}
 */
export const SMALL_GRID = GRID_SPACING * PIXELS_PER_METER;

/**
 * Large grid size in pixels (100px)
 * Represents 1 meter on the grid
 * @constant {number}
 */
export const LARGE_GRID = PIXELS_PER_METER;

/**
 * Canvas and grid configuration
 */

/**
 * Maximum number of objects allowed per canvas
 * Safety limit to prevent performance degradation
 * @constant {number}
 */
export const MAX_OBJECTS_PER_CANVAS = 1000;

/**
 * Maximum number of small grid lines to render
 * Prevents performance issues on large canvases
 * @constant {number}
 */
export const MAX_SMALL_GRID_LINES = 2000;

/**
 * Maximum number of large grid lines to render
 * Prevents performance issues on large canvases
 * @constant {number}
 */
export const MAX_LARGE_GRID_LINES = 400;

/**
 * Multiplier for extending grid beyond canvas boundaries
 * Ensures grid covers panning area
 * @constant {number}
 */
export const GRID_EXTENSION_FACTOR = 3.0;

/**
 * Drawing settings
 */

/**
 * Default line thickness in pixels
 * Standard width for drawing operations
 * @constant {number}
 */
export const DEFAULT_LINE_THICKNESS = 2;

/**
 * Maximum history states for undo/redo operations
 * Limits memory usage while providing sufficient history
 * @constant {number}
 */
export const MAX_HISTORY_STATES = 50;

/**
 * Tolerance values for geometric operations
 */

/**
 * Threshold in pixels for considering points as close/identical
 * Used in shape closing checks
 * @constant {number}
 */
export const CLOSE_POINT_THRESHOLD = 10;

/**
 * Threshold in pixels for shape closing detection
 * Slightly larger than CLOSE_POINT_THRESHOLD for better usability
 * @constant {number}
 */
export const SHAPE_CLOSE_THRESHOLD = 15;

/**
 * Minimum distance in pixels for a valid line
 * Prevents creation of extremely short lines
 * @constant {number}
 */
export const MIN_LINE_LENGTH = 5;

/**
 * Minimum area in square pixels for a valid shape
 * Prevents creation of extremely small shapes
 * @constant {number}
 */
export const MIN_SHAPE_AREA = 100;

/**
 * Floating point comparison tolerance
 * Used for numerical equality checks
 * @constant {number}
 */
export const FLOATING_POINT_TOLERANCE = 0.00001;

/**
 * Angle snap threshold in degrees
 * Used for forcing lines to 0, 45, 90 degrees etc.
 * @constant {number}
 */
export const ANGLE_SNAP_THRESHOLD = 10;

/**
 * Grid styling
 */

/**
 * Width of large grid lines in pixels
 * @constant {number}
 */
export const LARGE_GRID_LINE_WIDTH = 1.2;

/**
 * Width of small grid lines in pixels
 * @constant {number}
 */
export const SMALL_GRID_LINE_WIDTH = 0.5;

/**
 * Precision settings
 */

/**
 * Number of decimal places for area calculations
 * @constant {number}
 */
export const AREA_PRECISION = 2;

/**
 * Number of decimal places for distance measurements
 * @constant {number}
 */
export const DISTANCE_PRECISION = 1;

/**
 * Performance optimization
 */

/**
 * Default delay in milliseconds for throttled operations
 * @constant {number}
 */
export const DEFAULT_THROTTLE_DELAY = 300;

/**
 * Maximum delay in milliseconds for retried operations
 * @constant {number}
 */
export const MAX_RETRY_DELAY = 2000;

/**
 * Exponential backoff factor for retries
 * @constant {number}
 */
export const RETRY_BACKOFF_FACTOR = 1.5;

/**
 * Maximum number of retry attempts
 * @constant {number}
 */
export const MAX_RETRY_ATTEMPTS = 5;

/**
 * Canvas dimension defaults
 */

/**
 * Default canvas height in pixels when container dimensions are unavailable
 * @constant {number}
 */
export const DEFAULT_CANVAS_HEIGHT = 1000;

/**
 * Default canvas width in pixels when container dimensions are unavailable
 * @constant {number}
 */
export const DEFAULT_CANVAS_WIDTH = 1400;

/**
 * Threshold for skipping small grid on large canvases (in pixels²)
 * @constant {number}
 */
export const SMALL_GRID_SKIP_THRESHOLD = 8000000;

/**
 * Chunk processing
 */

/**
 * Number of strokes to process in each chunk for large floor plans
 * @constant {number}
 */
export const STROKE_CHUNK_SIZE = 20;

/**
 * Delay between chunk processing in milliseconds
 * @constant {number}
 */
export const CHUNK_PROCESSING_DELAY = 10;
