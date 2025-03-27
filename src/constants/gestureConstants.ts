
/**
 * Constants for touch and gesture interactions
 * @module constants/gestureConstants
 */

/**
 * Minimum distance in pixels to recognize a drag operation
 * @constant {number}
 */
export const DRAG_THRESHOLD = 10;

/**
 * Maximum time in milliseconds to recognize a tap (vs. a drag)
 * @constant {number}
 */
export const TAP_DURATION = 200;

/**
 * Minimum distance in pixels between two touch points to recognize a pinch
 * @constant {number}
 */
export const PINCH_THRESHOLD = 30;

/**
 * Time in milliseconds to throttle touch move events
 * @constant {number}
 */
export const TOUCH_MOVE_THROTTLE = 16; // Roughly 60fps

/**
 * Minimum scale change to trigger a zoom update
 * @constant {number}
 */
export const MIN_SCALE_CHANGE = 0.01;

/**
 * Maximum zoom level allowed
 * @constant {number}
 */
export const MAX_ZOOM = 10;

/**
 * Minimum zoom level allowed
 * @constant {number}
 */
export const MIN_ZOOM = 0.1;

/**
 * Delay after a touch action before allowing another (debounce)
 * @constant {number}
 */
export const TOUCH_DEBOUNCE = 50;

/**
 * Pressure sensitivity factor for stylus/pencil input
 * Higher values make pressure changes more pronounced
 * @constant {number}
 */
export const PRESSURE_SENSITIVITY = 1.5;

/**
 * Base pressure value when none is detected
 * @constant {number}
 */
export const DEFAULT_PRESSURE = 0.5;

/**
 * Default touch tolerance to make touch targets easier to hit
 * @constant {number}
 */
export const DEFAULT_TOUCH_TOLERANCE = 8;

/**
 * Increased touch tolerance specifically for iOS devices
 * @constant {number}
 */
export const IOS_TOUCH_TOLERANCE = 15;
