
/**
 * Utility functions for detecting pointer/stylus capabilities
 */

/**
 * Check if the device supports pressure sensitivity
 */
export const isPressureSupported = (): boolean => {
  // Check if the browser supports pointer events and pressure
  if (window.PointerEvent && 'pressure' in new PointerEvent('pointerdown')) {
    return true;
  }
  return false;
};

/**
 * Check if the device supports tilt detection (e.g., Apple Pencil)
 */
export const isTiltSupported = (): boolean => {
  // Check if the browser supports pointer events and tiltX/tiltY
  if (window.PointerEvent && 'tiltX' in new PointerEvent('pointerdown')) {
    return true;
  }
  return false;
};

/**
 * Check if the pointer is likely a pen/stylus
 */
export const isPenPointer = (event: PointerEvent): boolean => {
  return event.pointerType === 'pen';
};

/**
 * Get pressure value from pointer event, normalized to 0-1 range
 */
export const getNormalizedPressure = (event: PointerEvent): number => {
  // Most devices that don't support pressure return 0.5 as default value
  // or 1 for mouse clicks
  if (event.pressure === 0.5 || event.pressure === 1) {
    return event.pointerType === 'pen' ? 0.7 : 0.5; // Default value
  }
  return event.pressure;
};

