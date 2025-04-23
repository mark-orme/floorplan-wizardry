
/**
 * Pointer events utility for canvas input handling
 */

/**
 * Check if pressure sensitivity is supported in the browser
 * @returns True if pressure is supported
 */
export function isPressureSupported(): boolean {
  try {
    // Check if PointerEvent exists
    if (typeof PointerEvent === 'undefined') return false;
    
    return 'pressure' in PointerEvent.prototype;
  } catch (err) {
    console.error('Error checking pressure support:', err);
    return false;
  }
}

/**
 * Check if tilt sensitivity is supported in the browser
 * @returns True if tilt is supported
 */
export function isTiltSupported(): boolean {
  try {
    // Check if PointerEvent exists
    if (typeof PointerEvent === 'undefined') return false;
    
    return 'tiltX' in PointerEvent.prototype && 'tiltY' in PointerEvent.prototype;
  } catch (err) {
    console.error('Error checking tilt support:', err);
    return false;
  }
}

/**
 * Check if the pointer event is from a stylus/pen
 * @param event Pointer event to check
 * @returns True if the event is from a stylus/pen
 */
export function isStylus(event: PointerEvent): boolean {
  return event.pointerType === 'pen';
}

/**
 * Get pressure from pointer event (normalized between 0-1)
 * @param event Pointer event
 * @returns Pressure value between 0-1
 */
export function getPressure(event: PointerEvent): number {
  // Most devices report 0.5 for no pressure, 
  // so we normalize values to get better range
  if (isPressureSupported() && event.pressure !== 0.5) {
    return Math.max(0, Math.min(1, event.pressure));
  }
  
  return 0.5; // Default pressure
}

/**
 * Extract tilt information from pointer event
 * @param event Pointer event
 * @returns Object containing tilt values and calculated angle
 */
export function getTilt(event: PointerEvent): { tiltX: number; tiltY: number; tiltAngle: number } {
  if (isTiltSupported()) {
    const tiltX = event.tiltX || 0;
    const tiltY = event.tiltY || 0;
    const tiltAngle = Math.atan2(tiltY, tiltX) * (180 / Math.PI);
    
    return {
      tiltX,
      tiltY,
      tiltAngle
    };
  }
  
  return {
    tiltX: 0,
    tiltY: 0,
    tiltAngle: 0
  };
}
