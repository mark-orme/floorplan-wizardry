
/**
 * Canvas pointer event utilities
 */

/**
 * Trigger device vibration for tactile feedback
 */
export function vibrateFeedback() {
  // Check if the vibrate API is available
  if (navigator.vibrate) {
    navigator.vibrate(50); // Vibrate for 50ms
  }
}

/**
 * Get pressure value from pointer event
 * @param e Pointer event
 * @returns Pressure value (0-1)
 */
export function getPressure(e: PointerEvent) {
  return e.pressure;
}

/**
 * Get tilt values from pointer event
 * @param e Pointer event
 * @returns Object with x and y tilt values
 */
export function getTilt(e: PointerEvent) {
  return { x: e.tiltX, y: e.tiltY };
}

/**
 * Check if the pointer is a stylus
 * @param e Pointer event
 * @returns True if the pointer is a stylus/pen
 */
export function isStylus(e: PointerEvent) {
  return e.pointerType === 'pen';
}
