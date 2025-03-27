
/**
 * Canvas resizing constants
 * Defines timing, limits, and thresholds for canvas resize operations
 * @module canvas-resizing/constants
 */

/**
 * Timing constraints for resize operations
 */
export const RESIZE_TIMING = {
  /**
   * Minimum time between resize operations in milliseconds
   * Prevents too frequent resizing operations that could impact performance
   * @constant {number}
   */
  MIN_INTERVAL: 2000,
  
  /**
   * Debounce delay for window resize events in milliseconds
   * Waits for resize to stop before applying changes
   * @constant {number}
   */
  DEBOUNCE_DELAY: 1500,
  
  /**
   * Initial resize delay in milliseconds
   * Delay before first resize operation after component mount
   * @constant {number}
   */
  INITIAL_DELAY: 1000,
  
  /**
   * Cool-down period after resize in milliseconds
   * Minimum time between resize completion and next resize operation
   * @constant {number}
   */
  COOLDOWN: 100
};

/**
 * Padding constants for canvas dimensions
 */
export const CANVAS_PADDING = {
  /**
   * Horizontal padding in pixels for canvas width calculation
   * Ensures content doesn't touch the edge of the canvas
   * @constant {number}
   */
  HORIZONTAL: 20,
  
  /**
   * Vertical padding in pixels for canvas height calculation
   * Ensures content doesn't touch the edge of the canvas
   * @constant {number}
   */
  VERTICAL: 20
};

/**
 * Minimum size constraints for canvas
 */
export const CANVAS_MIN_SIZE = {
  /**
   * Minimum width of the canvas in pixels
   * Prevents canvas from becoming too narrow to be usable
   * @constant {number}
   */
  WIDTH: 600,
  
  /**
   * Minimum height of the canvas in pixels
   * Prevents canvas from becoming too short to be usable
   * @constant {number}
   */
  HEIGHT: 400
};

/**
 * Threshold constants for resize operations
 */
export const RESIZE_THRESHOLDS = {
  /**
   * Dimension change tolerance in pixels
   * Resize is only performed if dimensions change by more than this value
   * Prevents minor size fluctuations from triggering resize operations
   * @constant {number}
   */
  DIMENSION_TOLERANCE: 5
};

// For backward compatibility
export const MIN_RESIZE_INTERVAL = RESIZE_TIMING.MIN_INTERVAL;
export const HORIZONTAL_PADDING = CANVAS_PADDING.HORIZONTAL;
export const VERTICAL_PADDING = CANVAS_PADDING.VERTICAL;
export const MIN_WIDTH = CANVAS_MIN_SIZE.WIDTH;
export const MIN_HEIGHT = CANVAS_MIN_SIZE.HEIGHT;
export const DIMENSION_TOLERANCE = RESIZE_THRESHOLDS.DIMENSION_TOLERANCE;
export const RESIZE_DEBOUNCE_DELAY = RESIZE_TIMING.DEBOUNCE_DELAY;
export const INITIAL_RESIZE_DELAY = RESIZE_TIMING.INITIAL_DELAY;
export const RESIZE_COOLDOWN = RESIZE_TIMING.COOLDOWN;
