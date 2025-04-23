
/**
 * Utility functions for detecting and handling pointer events
 */

/**
 * Check if pressure sensitivity is supported
 * @returns {boolean} True if pressure sensitivity is supported
 */
export function isPressureSupported(): boolean {
  // Check for pointer events and pressure property
  if (window.PointerEvent && 'pressure' in new PointerEvent('pointerdown')) {
    return true;
  }
  
  // Check for Safari/WebKit implementation
  if ((window as any).Touch && 'force' in new Touch({ 
    identifier: 1, 
    target: document.body 
  })) {
    return true;
  }
  
  return false;
}

/**
 * Check if tilt sensitivity is supported
 * @returns {boolean} True if tilt sensitivity is supported
 */
export function isTiltSupported(): boolean {
  // Check for pointer events with tiltX and tiltY properties
  if (window.PointerEvent) {
    const testEvent = new PointerEvent('pointerdown');
    return 'tiltX' in testEvent && 'tiltY' in testEvent;
  }
  
  return false;
}

/**
 * Get normalized pressure from a pointer event
 * @param {PointerEvent} event - The pointer event
 * @returns {number} Normalized pressure value between 0 and 1
 */
export function getNormalizedPressure(event: PointerEvent): number {
  // Get pressure (returns 0.5 for non-pressure inputs like mouse)
  const pressure = event.pressure || 0;
  
  // Normalize based on device
  if (event.pointerType === 'pen' || event.pointerType === 'touch') {
    // For most pens and touch, 0 is no pressure, 1 is max
    return pressure;
  } else {
    // For mouse, either 0 (not pressed) or a default value when pressed
    return pressure > 0 ? 0.5 : 0;
  }
}

/**
 * Get tilt information from a pointer event
 * @param {PointerEvent} event - The pointer event
 * @returns {[number, number]} Array containing [tiltX, tiltY] in degrees
 */
export function getTilt(event: PointerEvent): [number, number] {
  return [event.tiltX || 0, event.tiltY || 0];
}

/**
 * Detect what input method is being used
 * @param {PointerEvent} event - The pointer event
 * @returns {string} Input method type
 */
export function detectInputMethod(event: PointerEvent): string {
  if (event.pointerType === 'pen') {
    return 'stylus';
  } else if (event.pointerType === 'touch') {
    return 'touch';
  } else if (event.pointerType === 'mouse') {
    return 'mouse';
  }
  
  return 'unknown';
}

/**
 * Check if event is from Apple Pencil
 * @param {PointerEvent} event - The pointer event
 * @returns {boolean} True if the event is likely from an Apple Pencil
 */
export function isApplePencil(event: PointerEvent): boolean {
  // Apple Pencil is a stylus with high precision
  return event.pointerType === 'pen' && 
         event.isPrimary && 
         (event as any).pointerType !== 'mouse' && 
         typeof event.tiltX === 'number' && 
         typeof event.tiltY === 'number';
}
