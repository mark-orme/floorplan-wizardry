
/**
 * Constants for touch and gesture interactions
 * Defines thresholds and timing values for touch-based interactions
 * @module constants/gestureConstants
 */

/**
 * Drag interaction constants
 */
export const DRAG = {
  /**
   * Minimum distance in pixels to recognize a drag operation
   * Prevents small movements from being interpreted as drags
   * @constant {number}
   */
  THRESHOLD: 10
};

/**
 * Tap interaction constants
 */
export const TAP = {
  /**
   * Maximum time in milliseconds to recognize a tap (vs. a drag)
   * Helps distinguish between taps and the start of drag operations
   * @constant {number}
   */
  DURATION: 200
};

/**
 * Pinch gesture constants
 */
export const PINCH = {
  /**
   * Minimum distance in pixels between two touch points to recognize a pinch
   * Required for accurate pinch gesture detection
   * @constant {number}
   */
  THRESHOLD: 30,
  
  /**
   * Minimum scale change to trigger a zoom update
   * Prevents tiny pinch movements from causing zoom changes
   * @constant {number}
   */
  MIN_SCALE_CHANGE: 0.01
};

/**
 * Touch event handling constants
 */
export const TOUCH = {
  /**
   * Time in milliseconds to throttle touch move events
   * Prevents excessive event handling during continuous gestures
   * Roughly corresponds to 60fps for smooth animation
   * @constant {number}
   */
  MOVE_THROTTLE: 16,
  
  /**
   * Delay after a touch action before allowing another (debounce)
   * Prevents accidental double-taps and other unwanted rapid interactions
   * @constant {number}
   */
  DEBOUNCE: 50,
  
  /**
   * Default touch tolerance to make touch targets easier to hit
   * Increases the interactive area of UI elements for better touch usability
   * @constant {number}
   */
  DEFAULT_TOLERANCE: 8,
  
  /**
   * Increased touch tolerance specifically for iOS devices
   * Compensates for the unique characteristics of iOS touch behavior
   * @constant {number}
   */
  IOS_TOLERANCE: 15
};

/**
 * Zoom limits
 */
export const ZOOM_LIMITS = {
  /**
   * Maximum zoom level allowed
   * Prevents excessive zooming that could cause performance issues
   * @constant {number}
   */
  MAX: 10,
  
  /**
   * Minimum zoom level allowed
   * Prevents zooming out too far where content becomes unreadable
   * @constant {number}
   */
  MIN: 0.1
};

/**
 * Pressure sensitivity constants
 */
export const PRESSURE = {
  /**
   * Pressure sensitivity factor for stylus/pencil input
   * Higher values make pressure changes more pronounced
   * Improves the responsiveness of pressure-sensitive drawing
   * @constant {number}
   */
  SENSITIVITY: 1.5,
  
  /**
   * Base pressure value when none is detected
   * Provides a fallback when pressure information is unavailable
   * @constant {number}
   */
  DEFAULT: 0.5
};

// For backward compatibility
export const DRAG_THRESHOLD = DRAG.THRESHOLD;
export const TAP_DURATION = TAP.DURATION;
export const PINCH_THRESHOLD = PINCH.THRESHOLD;
export const TOUCH_MOVE_THROTTLE = TOUCH.MOVE_THROTTLE;
export const MIN_SCALE_CHANGE = PINCH.MIN_SCALE_CHANGE;
export const MAX_ZOOM = ZOOM_LIMITS.MAX;
export const MIN_ZOOM = ZOOM_LIMITS.MIN;
export const TOUCH_DEBOUNCE = TOUCH.DEBOUNCE;
export const PRESSURE_SENSITIVITY = PRESSURE.SENSITIVITY;
export const DEFAULT_PRESSURE = PRESSURE.DEFAULT;
export const DEFAULT_TOUCH_TOLERANCE = TOUCH.DEFAULT_TOLERANCE;
export const IOS_TOUCH_TOLERANCE = TOUCH.IOS_TOLERANCE;
