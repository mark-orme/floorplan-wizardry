
/**
 * Canvas constants
 * Centralized configuration for canvas rendering and behavior
 * @module constants/canvas
 */

/**
 * Canvas sizing and scaling constants
 * @constant {Object}
 */
export const CANVAS_SCALING = {
  /**
   * Default canvas width in pixels
   * @constant {number}
   */
  DEFAULT_WIDTH: 800,
  
  /**
   * Default canvas height in pixels
   * @constant {number}
   */
  DEFAULT_HEIGHT: 600,
  
  /**
   * Minimum zoom level
   * @constant {number}
   */
  MIN_ZOOM: 0.1,
  
  /**
   * Maximum zoom level
   * @constant {number}
   */
  MAX_ZOOM: 5.0,
  
  /**
   * Default zoom level
   * @constant {number}
   */
  DEFAULT_ZOOM: 1.0,
  
  /**
   * Zoom increment per step
   * @constant {number}
   */
  ZOOM_STEP: 0.1,
  
  /**
   * Zoom factor for touch gestures
   * @constant {number}
   */
  TOUCH_ZOOM_FACTOR: 0.005,
  
  /**
   * Touch tolerance for iOS devices
   * @constant {number}
   */
  IOS_TOUCH_TOLERANCE: 10,
  
  /**
   * Pan sensitivity multiplier
   * @constant {number}
   */
  PAN_SENSITIVITY: 1.0
};

/**
 * Canvas visual styling constants
 * @constant {Object}
 */
export const CANVAS_STYLES = {
  /**
   * Canvas background color
   * @constant {string}
   */
  BACKGROUND_COLOR: '#ffffff',
  
  /**
   * Canvas border CSS
   * @constant {string}
   */
  BORDER: '1px solid #e2e8f0',
  
  /**
   * CSS class for canvas wrapper
   * @constant {string}
   */
  WRAPPER_CLASS: 'w-full h-full border border-gray-200 rounded shadow-sm',
  
  /**
   * Selection color
   * @constant {string}
   */
  SELECTION_COLOR: 'rgba(100, 100, 255, 0.3)',
  
  /**
   * Selection border color
   * @constant {string}
   */
  SELECTION_BORDER_COLOR: 'rgba(100, 100, 255, 0.8)',
  
  /**
   * Canvas shadow effect
   * @constant {string}
   */
  SHADOW: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
};

/**
 * Maximum number of grid creation attempts
 * Used for preventing infinite creation loops
 * @constant {number}
 */
export const MAX_GRID_CREATION_ATTEMPTS = 3;

/**
 * Canvas event constants
 * Timing and threshold values for event handling
 * @constant {Object}
 */
export const CANVAS_EVENTS = {
  /**
   * Threshold in milliseconds for double-click detection
   * @constant {number}
   */
  DOUBLE_CLICK_TIME: 300,
  
  /**
   * Threshold in pixels for move detection
   * @constant {number}
   */
  MOVE_THRESHOLD: 5,
  
  /**
   * Time in milliseconds to wait for gesture recognition
   * @constant {number}
   */
  GESTURE_RECOGNITION_DELAY: 100
};

/**
 * Rendering and performance constants
 * Timing values for rendering optimizations
 * @constant {Object}
 */
export const RENDERING_CONSTANTS = {
  /**
   * Throttle delay for canvas updates in ms 
   * (approx. 60fps time budget)
   * @constant {number}
   */
  THROTTLE_DELAY: 16,
  
  /**
   * Debounce delay for expensive operations in ms
   * @constant {number}
   */
  DEBOUNCE_DELAY: 150,
  
  /**
   * Maximum canvas size for optimal performance
   * @constant {Object}
   */
  MAX_CANVAS_SIZE: {
    WIDTH: 3000,
    HEIGHT: 3000
  }
};

/**
 * Minimum canvas dimensions
 * Prevents canvas from becoming too small to be usable
 * @constant {number}
 */
export const MIN_CANVAS_WIDTH = 300;
export const MIN_CANVAS_HEIGHT = 200;
