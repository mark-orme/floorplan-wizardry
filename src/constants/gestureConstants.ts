
/**
 * Constants for touch and gesture interactions
 * Defines thresholds and timing values for touch-based interactions
 * @module constants/gestureConstants
 */

/**
 * Minimum distance in pixels to recognize a drag operation
 * Prevents small movements from being interpreted as drags
 * @constant {number}
 */
export const DRAG_THRESHOLD = 10;

/**
 * Maximum time in milliseconds to recognize a tap (vs. a drag)
 * Helps distinguish between taps and the start of drag operations
 * @constant {number}
 */
export const TAP_DURATION = 200;

/**
 * Minimum distance in pixels between two touch points to recognize a pinch
 * Required for accurate pinch gesture detection
 * @constant {number}
 */
export const PINCH_THRESHOLD = 30;

/**
 * Time in milliseconds to throttle touch move events
 * Prevents excessive event handling during continuous gestures
 * Roughly corresponds to 60fps for smooth animation
 * @constant {number}
 */
export const TOUCH_MOVE_THROTTLE = 16;

/**
 * Minimum scale change to trigger a zoom update
 * Prevents tiny pinch movements from causing zoom changes
 * @constant {number}
 */
export const MIN_SCALE_CHANGE = 0.01;

/**
 * Maximum zoom level allowed
 * Prevents excessive zooming that could cause performance issues
 * @constant {number}
 */
export const MAX_ZOOM = 10;

/**
 * Minimum zoom level allowed
 * Prevents zooming out too far where content becomes unreadable
 * @constant {number}
 */
export const MIN_ZOOM = 0.1;

/**
 * Delay after a touch action before allowing another (debounce)
 * Prevents accidental double-taps and other unwanted rapid interactions
 * @constant {number}
 */
export const TOUCH_DEBOUNCE = 50;

/**
 * Pressure sensitivity factor for stylus/pencil input
 * Higher values make pressure changes more pronounced
 * Improves the responsiveness of pressure-sensitive drawing
 * @constant {number}
 */
export const PRESSURE_SENSITIVITY = 1.5;

/**
 * Base pressure value when none is detected
 * Provides a fallback when pressure information is unavailable
 * @constant {number}
 */
export const DEFAULT_PRESSURE = 0.5;

/**
 * Default touch tolerance to make touch targets easier to hit
 * Increases the interactive area of UI elements for better touch usability
 * @constant {number}
 */
export const DEFAULT_TOUCH_TOLERANCE = 8;

/**
 * Increased touch tolerance specifically for iOS devices
 * Compensates for the unique characteristics of iOS touch behavior
 * @constant {number}
 */
export const IOS_TOUCH_TOLERANCE = 15;
