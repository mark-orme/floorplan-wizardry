
/**
 * Utility functions for handling pointer and pressure events
 */

/**
 * Check if pressure sensitivity is supported
 * @returns boolean indicating support
 */
export function isPressureSupported(): boolean {
  if (typeof window === 'undefined') return false;
  
  return 'PointerEvent' in window && 
    typeof (new PointerEvent('pointerdown')).pressure === 'number';
}

/**
 * Check if tilt sensitivity is supported
 * @returns boolean indicating support
 */
export function isTiltSupported(): boolean {
  if (typeof window === 'undefined') return false;
  
  return 'PointerEvent' in window && 
    typeof (new PointerEvent('pointerdown')).tiltX === 'number' &&
    typeof (new PointerEvent('pointerdown')).tiltY === 'number';
}

/**
 * Get pressure from pointer event with fallback
 * @param event Pointer event
 * @returns number between 0 and 1 indicating pressure
 */
export function getPressure(event: PointerEvent): number {
  if (event.pressure && event.pressure !== 0) {
    return event.pressure;
  }
  
  // Default pressure for mouse is 0.5, for touch is either 1.0 or what the device reports
  return event.pointerType === 'mouse' ? 0.5 : 1.0;
}

/**
 * Get tilt from pointer event
 * @param event Pointer event
 * @returns object with tiltX and tiltY values
 */
export function getTilt(event: PointerEvent): { tiltX: number, tiltY: number } {
  return {
    tiltX: event.tiltX || 0,
    tiltY: event.tiltY || 0
  };
}
