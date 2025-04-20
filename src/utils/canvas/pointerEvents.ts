
/**
 * Pointer Events Utilities
 * Helper functions for handling pointer/stylus input
 */

/**
 * Check if pressure is supported
 * @returns {boolean} Whether pressure is supported
 */
export const isPressureSupported = (): boolean => {
  return 'PointerEvent' in window && 'pressure' in PointerEvent.prototype;
};

/**
 * Check if tilt is supported
 * @returns {boolean} Whether tilt is supported
 */
export const isTiltSupported = (): boolean => {
  return 'PointerEvent' in window && 'tiltX' in PointerEvent.prototype;
};

/**
 * Get pressure from a pointer event
 * @param {PointerEvent} event The pointer event
 * @returns {number} The pressure value (0-1)
 */
export const getPressure = (event: PointerEvent): number => {
  return event.pressure || 0.5;
};

/**
 * Get tilt from a pointer event
 * @param {PointerEvent} event The pointer event
 * @returns {{x: number, y: number}} The tilt values
 */
export const getTilt = (event: PointerEvent): {x: number, y: number} => {
  return {
    x: event.tiltX || 0,
    y: event.tiltY || 0
  };
};

/**
 * Check if event is from a stylus
 * @param {PointerEvent} event The pointer event
 * @returns {boolean} Whether the event is from a stylus
 */
export const isStylus = (event: PointerEvent): boolean => {
  return event.pointerType === 'pen';
};

/**
 * Check if event is from a touch
 * @param {PointerEvent} event The pointer event
 * @returns {boolean} Whether the event is from a touch
 */
export const isTouch = (event: PointerEvent): boolean => {
  return event.pointerType === 'touch';
};

/**
 * Provide haptic feedback if available
 * @param {number} duration Vibration duration in milliseconds
 */
export const vibrateFeedback = (duration: number = 10): void => {
  if (navigator.vibrate) {
    navigator.vibrate(duration);
  }
};
