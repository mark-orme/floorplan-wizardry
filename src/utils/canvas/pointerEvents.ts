
/**
 * Utilities for handling pointer events
 */

/**
 * Checks if the device supports pressure sensitivity
 */
export const isPressureSupported = (event: PointerEvent): boolean => {
  return 'pressure' in event && typeof event.pressure === 'number' && event.pressure !== 0.5;
};

/**
 * Checks if the device supports tilt sensitivity
 */
export const isTiltSupported = (event: PointerEvent): boolean => {
  return (
    'tiltX' in event && 
    'tiltY' in event && 
    typeof event.tiltX === 'number' && 
    typeof event.tiltY === 'number' && 
    (event.tiltX !== 0 || event.tiltY !== 0)
  );
};

/**
 * Get normalized pressure value from 0 to 1
 */
export const getNormalizedPressure = (event: PointerEvent): number => {
  // Most devices report 0.5 as default/unsupported pressure
  if (!isPressureSupported(event)) return 0.5;
  
  // Normalize between 0 and 1
  return Math.max(0, Math.min(1, event.pressure));
};

/**
 * Detects if the pointer event is from a stylus
 */
export const isStylusPointer = (event: PointerEvent): boolean => {
  return event.pointerType === 'pen';
};
