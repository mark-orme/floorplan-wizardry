
/**
 * Enhanced pointer events for canvas interaction
 * @module utils/canvas/pointerEvents
 */

/**
 * Provide haptic feedback using the vibration API
 * @param duration - Vibration duration in milliseconds
 */
export const vibrateFeedback = (duration: number = 20) => {
  if (navigator.vibrate) {
    navigator.vibrate(duration);
  }
};

/**
 * Detects if pressure is supported
 * @returns boolean
 */
export const isPressureSupported = (): boolean => {
  return window.PointerEvent ? 'pressure' in new PointerEvent('pointerdown') : false;
};

/**
 * Detects if tilt is supported
 * @returns boolean
 */
export const isTiltSupported = (): boolean => {
  if (!window.PointerEvent) return false;
  return 'tiltX' in new PointerEvent('pointerdown') && 
         'tiltY' in new PointerEvent('pointerdown');
};

/**
 * Calculates brush size based on pressure
 * @param baseBrushSize - Base brush size
 * @param pressure - Pressure value (0-1)
 * @param maxMultiplier - Maximum multiplier for brush size
 * @returns calculated brush size
 */
export const calculateBrushSize = (
  baseBrushSize: number, 
  pressure: number, 
  maxMultiplier: number = 3
): number => {
  // Ensure pressure is within valid range
  const clampedPressure = Math.max(0.1, Math.min(1, pressure));
  
  // Calculate dynamic size with exponential curve for better control
  return baseBrushSize * (1 + (clampedPressure * clampedPressure * (maxMultiplier - 1)));
};

/**
 * Creates a brush angle based on tilt values
 * @param tiltX - X tilt value
 * @param tiltY - Y tilt value
 * @returns Angle in degrees
 */
export const calculateTiltAngle = (tiltX: number, tiltY: number): number => {
  return Math.atan2(tiltY, tiltX) * (180 / Math.PI);
};
