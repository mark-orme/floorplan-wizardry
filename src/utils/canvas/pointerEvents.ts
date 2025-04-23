
/**
 * Utilities to handle advanced pointer events
 */

/**
 * Check if the browser supports pressure sensitivity
 * @returns Boolean indicating support status
 */
export function isPressureSupported(): boolean {
  if (typeof window === 'undefined') return false;

  // Check if PointerEvent exists and has pressure property
  if (window.PointerEvent && 'pressure' in new PointerEvent('pointerdown')) {
    return true;
  }

  return false;
}

/**
 * Check if the browser supports tilt detection (commonly for styluses)
 * @returns Boolean indicating support status
 */
export function isTiltSupported(): boolean {
  if (typeof window === 'undefined') return false;

  // Check if PointerEvent exists and has tiltX/tiltY properties
  if (window.PointerEvent && 
     'tiltX' in new PointerEvent('pointerdown') &&
     'tiltY' in new PointerEvent('pointerdown')) {
    return true;
  }

  return false;
}

/**
 * Get current pointer capabilities
 * @returns Object describing current pointer capabilities
 */
export function getPointerCapabilities(): {
  pressure: boolean;
  tilt: boolean;
  coalesced: boolean;
  predicted: boolean;
} {
  return {
    pressure: isPressureSupported(),
    tilt: isTiltSupported(),
    coalesced: 'getCoalescedEvents' in PointerEvent.prototype,
    predicted: 'getPredictedEvents' in PointerEvent.prototype
  };
}
