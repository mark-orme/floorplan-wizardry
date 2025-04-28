
/**
 * Utility functions for handling pointer events in canvas
 */

/**
 * Check if pressure is supported in the current browser
 */
export const isPressureSupported = (): boolean => {
  return 'PointerEvent' in window && 'pressure' in new PointerEvent('pointerdown');
};

/**
 * Check if tilt is supported in the current browser
 */
export const isTiltSupported = (): boolean => {
  return 'PointerEvent' in window && 'tiltX' in new PointerEvent('pointerdown');
};

/**
 * Checks if the event is a touch event
 */
export const isTouchEvent = (e: MouseEvent | TouchEvent): e is TouchEvent => {
  return 'touches' in e;
};

/**
 * Checks if the pointer device is likely a stylus/pen
 */
export const isPenPointer = (e: PointerEvent): boolean => {
  return e.pointerType === 'pen';
};

/**
 * Extract pressure from a pointer event with fallback
 */
export const getPointerPressure = (e: PointerEvent): number => {
  // Some devices report pressure as 0.5 even when they don't support pressure
  // So we check if it's exactly 0.5 and return a default value instead
  if (e.pressure === 0.5 && !isPressureSupported()) {
    return 1.0;
  }
  return e.pressure;
};

/**
 * Extract tilt data from a pointer event
 */
export const getPointerTilt = (e: PointerEvent): { tiltX: number; tiltY: number } => {
  if (isTiltSupported() && (e.tiltX !== 0 || e.tiltY !== 0)) {
    return { tiltX: e.tiltX, tiltY: e.tiltY };
  }
  return { tiltX: 0, tiltY: 0 };
};

/**
 * Convert tilt values to angle and altitude values
 */
export const tiltToAngles = (tiltX: number, tiltY: number): { angle: number; altitude: number } => {
  const angle = Math.atan2(tiltY, tiltX) * (180 / Math.PI);
  
  // Normalize the angle to 0-360
  const normalizedAngle = (angle + 360) % 360;
  
  // Calculate altitude (0 = flat, 90 = perpendicular)
  // Max tilt is typically 90 degrees in each direction
  const altitude = 90 - Math.sqrt(tiltX * tiltX + tiltY * tiltY);
  
  return { angle: normalizedAngle, altitude };
};
