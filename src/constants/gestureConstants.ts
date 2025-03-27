
/**
 * Constants for touch and gesture interactions
 * Defines thresholds and timing values for touch-based interactions
 * @module constants/gestureConstants
 */

/**
 * Drag interaction constants
 * Controls when drags are recognized and how they behave
 */
export const DRAG = {
  /**
   * Minimum distance in pixels to recognize a drag operation
   * Prevents small movements from being interpreted as drags
   * Essential for distinguishing taps from the start of drag gestures
   * @constant {number}
   */
  THRESHOLD: 10
};

/**
 * Tap interaction constants
 * Defines timing for tap recognition
 */
export const TAP = {
  /**
   * Maximum time in milliseconds to recognize a tap (vs. a drag)
   * Helps distinguish between taps and the start of drag operations
   * Longer presses are considered candidates for dragging operations
   * @constant {number}
   */
  DURATION: 200
};

/**
 * Pinch gesture constants
 * Controls zoom behaviors using pinch gestures
 */
export const PINCH = {
  /**
   * Minimum distance in pixels between two touch points to recognize a pinch
   * Required for accurate pinch gesture detection
   * Too small values could misinterpret other gestures as pinches
   * @constant {number}
   */
  THRESHOLD: 30,
  
  /**
   * Minimum scale change to trigger a zoom update
   * Prevents tiny pinch movements from causing zoom changes
   * Improves performance by reducing unnecessary zoom operations
   * @constant {number}
   */
  MIN_SCALE_CHANGE: 0.01
};

/**
 * Touch event handling constants
 * Optimizes touch responsiveness across devices
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
   * Improves reliability of touch gestures, especially on older devices
   * @constant {number}
   */
  DEBOUNCE: 50,
  
  /**
   * Default touch tolerance to make touch targets easier to hit
   * Increases the interactive area of UI elements for better touch usability
   * Based on standard touch accessibility guidelines
   * @constant {number}
   */
  DEFAULT_TOLERANCE: 8,
  
  /**
   * Increased touch tolerance specifically for iOS devices
   * Compensates for the unique characteristics of iOS touch behavior
   * Provides more accurate touch target acquisition on iOS
   * @constant {number}
   */
  IOS_TOLERANCE: 15
};

/**
 * Zoom limits
 * Constrains zoom levels to maintain usability
 */
export const ZOOM_LIMITS = {
  /**
   * Maximum zoom level allowed
   * Prevents excessive zooming that could cause performance issues
   * Also prevents users from getting disoriented with extreme zoom
   * @constant {number}
   */
  MAX: 10,
  
  /**
   * Minimum zoom level allowed
   * Prevents zooming out too far where content becomes unreadable
   * Ensures users can't lose content by excessive zooming out
   * @constant {number}
   */
  MIN: 0.1
};

/**
 * Pressure sensitivity constants
 * Enhances drawing experience with pressure-sensitive devices
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
   * Middle value provides neutral starting point for pressure effects
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
