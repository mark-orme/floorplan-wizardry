
/**
 * Utilities for handling pointer events in canvas
 */

/**
 * Checks if pressure sensitivity is supported
 * @returns boolean indicating if pressure sensitivity is supported
 */
export function isPressureSupported(): boolean {
  // PointerEvent exists in window and has pressure property
  return (
    typeof window !== 'undefined' &&
    'PointerEvent' in window &&
    'pressure' in PointerEvent.prototype
  );
}

/**
 * Checks if tilt sensitivity is supported
 * @returns boolean indicating if tilt sensitivity is supported
 */
export function isTiltSupported(): boolean {
  // PointerEvent exists in window and has tiltX/tiltY properties
  return (
    typeof window !== 'undefined' &&
    'PointerEvent' in window &&
    'tiltX' in PointerEvent.prototype &&
    'tiltY' in PointerEvent.prototype
  );
}

/**
 * Checks if a pointer event has pressure data
 * @param event The pointer event to check
 * @returns boolean indicating if event has pressure data
 */
export function hasPressureData(event: PointerEvent): boolean {
  return (
    typeof event.pressure === 'number' &&
    event.pressure > 0 &&
    event.pressure <= 1
  );
}

/**
 * Gets normalized pressure from pointer event
 * @param event The pointer event
 * @returns normalized pressure (0.5 if not available)
 */
export function getNormalizedPressure(event: PointerEvent): number {
  if (hasPressureData(event)) {
    // Normalize to range between 0.1 and 1
    return Math.max(0.1, event.pressure);
  }
  
  // Default pressure if not available
  return 0.5;
}
