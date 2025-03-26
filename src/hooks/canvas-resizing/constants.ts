
/**
 * Canvas resizing constants
 * @module canvas-resizing/constants
 */

/**
 * Minimum time between resize operations in milliseconds
 * Prevents too frequent resizing operations
 * @constant {number}
 */
export const MIN_RESIZE_INTERVAL = 2000;

/**
 * Horizontal padding in pixels for canvas width calculation
 * @constant {number}
 */
export const HORIZONTAL_PADDING = 20;

/**
 * Vertical padding in pixels for canvas height calculation
 * @constant {number}
 */
export const VERTICAL_PADDING = 20;

/**
 * Minimum width of the canvas in pixels
 * @constant {number}
 */
export const MIN_WIDTH = 600;

/**
 * Minimum height of the canvas in pixels
 * @constant {number}
 */
export const MIN_HEIGHT = 400;

/**
 * Dimension change tolerance in pixels
 * Resize is only performed if dimensions change by more than this value
 * @constant {number}
 */
export const DIMENSION_TOLERANCE = 5;

/**
 * Debounce delay for window resize events in milliseconds
 * @constant {number}
 */
export const RESIZE_DEBOUNCE_DELAY = 1500;

/**
 * Initial resize delay in milliseconds
 * @constant {number}
 */
export const INITIAL_RESIZE_DELAY = 1000;

/**
 * Cool-down period after resize in milliseconds
 * @constant {number}
 */
export const RESIZE_COOLDOWN = 100;
