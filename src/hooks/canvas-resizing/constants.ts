
/**
 * Canvas resizing constants
 * Defines timing, limits, and thresholds for canvas resize operations
 * @module canvas-resizing/constants
 */

/**
 * Minimum time between resize operations in milliseconds
 * Prevents too frequent resizing operations that could impact performance
 * @constant {number}
 */
export const MIN_RESIZE_INTERVAL = 2000;

/**
 * Horizontal padding in pixels for canvas width calculation
 * Ensures content doesn't touch the edge of the canvas
 * @constant {number}
 */
export const HORIZONTAL_PADDING = 20;

/**
 * Vertical padding in pixels for canvas height calculation
 * Ensures content doesn't touch the edge of the canvas
 * @constant {number}
 */
export const VERTICAL_PADDING = 20;

/**
 * Minimum width of the canvas in pixels
 * Prevents canvas from becoming too narrow to be usable
 * @constant {number}
 */
export const MIN_WIDTH = 600;

/**
 * Minimum height of the canvas in pixels
 * Prevents canvas from becoming too short to be usable
 * @constant {number}
 */
export const MIN_HEIGHT = 400;

/**
 * Dimension change tolerance in pixels
 * Resize is only performed if dimensions change by more than this value
 * Prevents minor size fluctuations from triggering resize operations
 * @constant {number}
 */
export const DIMENSION_TOLERANCE = 5;

/**
 * Debounce delay for window resize events in milliseconds
 * Waits for resize to stop before applying changes
 * @constant {number}
 */
export const RESIZE_DEBOUNCE_DELAY = 1500;

/**
 * Initial resize delay in milliseconds
 * Delay before first resize operation after component mount
 * @constant {number}
 */
export const INITIAL_RESIZE_DELAY = 1000;

/**
 * Cool-down period after resize in milliseconds
 * Minimum time between resize completion and next resize operation
 * @constant {number}
 */
export const RESIZE_COOLDOWN = 100;
