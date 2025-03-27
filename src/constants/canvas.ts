
/**
 * Canvas-related constants used throughout the application
 * @module constants/canvas
 */

/**
 * Maximum number of grid creation attempts
 * Limits how many times we'll retry creating a grid before giving up
 * @constant {number}
 */
export const MAX_GRID_CREATION_ATTEMPTS = 3;

/**
 * Base delay between grid creation attempts in milliseconds
 * Used as the starting point for exponential backoff
 * @constant {number}
 */
export const GRID_CREATION_BASE_DELAY = 100;

/**
 * Minimum canvas initialization timeout in milliseconds
 * We won't attempt any operations before this time has passed
 * @constant {number}
 */
export const MIN_CANVAS_INIT_TIMEOUT = 300;

/**
 * Maximum canvas initialization timeout in milliseconds
 * We'll fail initialization if it takes longer than this
 * @constant {number}
 */
export const MAX_CANVAS_INIT_TIMEOUT = 5000;

/**
 * Minimum canvas width for valid grid creation in pixels
 * @constant {number}
 */
export const MIN_CANVAS_WIDTH = 100;

/**
 * Minimum canvas height for valid grid creation in pixels
 * @constant {number}
 */
export const MIN_CANVAS_HEIGHT = 100;

/**
 * Overlay check interval in milliseconds
 * How often the debug overlay refreshes its status
 * @constant {number}
 */
export const OVERLAY_CHECK_INTERVAL = 1000;

/**
 * Canvas ready delay in milliseconds
 * How long to wait after DOM is ready before initializing the canvas
 * @constant {number}
 */
export const CANVAS_READY_DELAY = 200;

/**
 * Maximum number of grid objects to protect against performance issues
 * @constant {number}
 */
export const MAX_GRID_OBJECTS = 2000;
