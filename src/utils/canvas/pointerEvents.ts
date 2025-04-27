
// Utility functions to detect input capabilities

/**
 * Check if pressure sensitivity is supported
 * @returns True if pressure is supported
 */
export const isPressureSupported = (): boolean => {
  return (
    typeof window !== 'undefined' && 
    'PointerEvent' in window && 
    'pressure' in PointerEvent.prototype
  );
};

/**
 * Check if tilt input is supported
 * @returns True if tilt is supported
 */
export const isTiltSupported = (): boolean => {
  return (
    typeof window !== 'undefined' && 
    'PointerEvent' in window && 
    'tiltX' in PointerEvent.prototype && 
    'tiltY' in PointerEvent.prototype
  );
};

/**
 * Check if the current device supports touch input
 * @returns True if touch is supported
 */
export const isTouchSupported = (): boolean => {
  return (
    typeof window !== 'undefined' && 
    ('ontouchstart' in window || 
    (window.navigator.maxTouchPoints > 0))
  );
};

/**
 * Check if the current pointer event is from a pen/stylus
 * @param event PointerEvent to check
 * @returns True if the event is from a pen
 */
export const isPenPointer = (event: PointerEvent): boolean => {
  return event.pointerType === 'pen';
};

/**
 * Get normalized pressure value from pointer event
 * @param event PointerEvent with pressure
 * @returns Normalized pressure between 0 and 1
 */
export const getNormalizedPressure = (event: PointerEvent): number => {
  // Default pressure is 0.5 if not supported
  if (!isPressureSupported() || typeof event.pressure !== 'number') {
    return 0.5;
  }
  
  // Most systems report pressure between 0 and 1
  // Some report 0 when hovering and 0.5 when touching
  if (event.pressure === 0 && event.buttons > 0) {
    return 0.5;
  }
  
  return Math.min(Math.max(event.pressure, 0), 1);
};
