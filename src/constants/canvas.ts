
/**
 * Canvas constants
 * Centralized configuration for canvas rendering and behavior
 * @module constants/canvas
 */

/**
 * Canvas sizing and scaling constants
 * These values control all aspects of canvas dimensions and zoom behavior
 * @constant {Object}
 */
export const CANVAS_SCALING = {
  /**
   * Default canvas width in pixels
   * Used for initial canvas setup when no specific size is provided
   * @constant {number}
   */
  DEFAULT_WIDTH: 800,
  
  /**
   * Default canvas height in pixels
   * Used for initial canvas setup when no specific size is provided
   * @constant {number}
   */
  DEFAULT_HEIGHT: 600,
  
  /**
   * Minimum zoom level
   * Prevents zooming out too far where content becomes too small
   * @constant {number}
   */
  MIN_ZOOM: 0.1,
  
  /**
   * Maximum zoom level
   * Prevents excessive zooming where performance issues may occur
   * @constant {number}
   */
  MAX_ZOOM: 5.0,
  
  /**
   * Default zoom level
   * Standard 1:1 display ratio
   * @constant {number}
   */
  DEFAULT_ZOOM: 1.0,
  
  /**
   * Zoom increment per step
   * Controls how much zoom changes with each zoom action (wheel, button, etc.)
   * @constant {number}
   */
  ZOOM_STEP: 0.1,
  
  /**
   * Zoom factor for touch gestures
   * Multiplier applied to pinch gesture movements to control zoom sensitivity
   * @constant {number}
   */
  TOUCH_ZOOM_FACTOR: 0.005,
  
  /**
   * Touch tolerance for iOS devices
   * Increased hit area (in pixels) for touch targets on iOS to improve usability
   * @constant {number}
   */
  IOS_TOUCH_TOLERANCE: 10,
  
  /**
   * Pan sensitivity multiplier
   * Controls how quickly the canvas pans in response to drag operations
   * @constant {number}
   */
  PAN_SENSITIVITY: 1.0
};

/**
 * Canvas visual styling constants
 * Defines the appearance of the canvas and its elements
 * @constant {Object}
 */
export const CANVAS_STYLES = {
  /**
   * Canvas background color
   * Default white background for new canvases
   * @constant {string}
   */
  BACKGROUND_COLOR: '#ffffff',
  
  /**
   * Canvas border CSS
   * Standard border to visually define the canvas area
   * @constant {string}
   */
  BORDER: '1px solid #e2e8f0',
  
  /**
   * CSS class for canvas wrapper
   * Tailwind classes for consistent canvas container styling
   * @constant {string}
   */
  WRAPPER_CLASS: 'w-full h-full border border-gray-200 rounded shadow-sm',
  
  /**
   * Selection color
   * Semi-transparent blue fill for selected objects
   * @constant {string}
   */
  SELECTION_COLOR: 'rgba(100, 100, 255, 0.3)',
  
  /**
   * Selection border color
   * Visible border around selected objects
   * @constant {string}
   */
  SELECTION_BORDER_COLOR: 'rgba(100, 100, 255, 0.8)',
  
  /**
   * Canvas shadow effect
   * Subtle shadow to give canvas depth on the page
   * @constant {string}
   */
  SHADOW: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
};

/**
 * Grid creation constants
 */
export const GRID_CREATION = {
  /**
   * Maximum number of grid creation attempts
   * Used for preventing infinite creation loops
   * Critical for maintaining application stability
   * @constant {number}
   */
  MAX_ATTEMPTS: 3
};

/**
 * Canvas event constants
 * Timing and threshold values for event handling
 * These values ensure consistent event behavior across devices
 * @constant {Object}
 */
export const CANVAS_EVENTS = {
  /**
   * Threshold in milliseconds for double-click detection
   * Controls how quickly two clicks must occur to register as a double-click
   * @constant {number}
   */
  DOUBLE_CLICK_TIME: 300,
  
  /**
   * Threshold in pixels for move detection
   * Minimum distance pointer must move to be considered a drag rather than a click
   * @constant {number}
   */
  MOVE_THRESHOLD: 5,
  
  /**
   * Time in milliseconds to wait for gesture recognition
   * Delay before committing to a specific gesture interpretation
   * @constant {number}
   */
  GESTURE_RECOGNITION_DELAY: 100
};

/**
 * Rendering and performance constants
 * Timing values for rendering optimizations
 * These values balance smooth rendering with performance
 * @constant {Object}
 */
export const RENDERING_CONSTANTS = {
  /**
   * Throttle delay for canvas updates in ms 
   * (approx. 60fps time budget)
   * Prevents excessive renders during rapid interactions
   * @constant {number}
   */
  THROTTLE_DELAY: 16,
  
  /**
   * Debounce delay for expensive operations in ms
   * Prevents performance spikes during continuous events like resize
   * @constant {number}
   */
  DEBOUNCE_DELAY: 150,
  
  /**
   * Maximum canvas size for optimal performance
   * Beyond these dimensions, performance optimizations are applied
   * @constant {Object}
   */
  MAX_CANVAS_SIZE: {
    /**
     * Maximum width in pixels
     * @constant {number}
     */
    WIDTH: 3000,
    
    /**
     * Maximum height in pixels
     * @constant {number}
     */
    HEIGHT: 3000
  }
};

/**
 * Canvas dimension limits
 */
export const CANVAS_LIMITS = {
  /**
   * Minimum canvas width in pixels
   * Prevents canvas from becoming too small to be usable
   * Essential for maintaining a minimum workable area
   * @constant {number}
   */
  MIN_WIDTH: 300,
  
  /**
   * Minimum canvas height in pixels
   * Prevents canvas from becoming too small to be usable
   * Essential for maintaining a minimum workable area
   * @constant {number}
   */
  MIN_HEIGHT: 200
};

// For backward compatibility
export const MAX_GRID_CREATION_ATTEMPTS = GRID_CREATION.MAX_ATTEMPTS;
export const MIN_CANVAS_WIDTH = CANVAS_LIMITS.MIN_WIDTH;
export const MIN_CANVAS_HEIGHT = CANVAS_LIMITS.MIN_HEIGHT;
