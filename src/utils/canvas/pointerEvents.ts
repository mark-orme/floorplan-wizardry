
/**
 * Enhanced pointer events for canvas interaction
 * @module utils/canvas/pointerEvents
 */

/**
 * Enhanced pointer event interface with additional properties
 * for stylus and pressure sensitivity
 */
export interface EnhancedPointerEvent extends Omit<PointerEvent, "pressure" | "width" | "height" | "tangentialPressure" | "tiltX" | "tiltY" | "twist"> {
  /** Pointer pressure level (0-1) */
  pressure: number;
  /** Width of the contact area */
  width?: number;
  /** Height of the contact area */
  height?: number;
  /** Tangential pressure - optional property for stylus */
  tangentialPressure?: number;
  /** Tilt X value - for stylus angle detection */
  tiltX?: number;
  /** Tilt Y value - for stylus angle detection */
  tiltY?: number;
  /** Twist value - for stylus rotation detection */
  twist?: number;
}

/**
 * Provide haptic feedback using the vibration API
 * @param duration - Vibration duration in milliseconds
 */
export const vibrateFeedback = (duration: number = 20) => {
  if (navigator.vibrate) {
    navigator.vibrate(duration);
  }
};
