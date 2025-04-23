
/**
 * Utility functions for handling pointer events with pressure and tilt detection
 */

/**
 * Check if pressure input is supported
 * @returns {boolean} Whether pressure input is supported
 */
export const isPressureSupported = (): boolean => {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') return false;
  
  // Check if pointer events are supported
  if (!('PointerEvent' in window)) return false;
  
  // Use a sample event to check if pressure is supported
  try {
    // Create a dummy pointer event to check properties
    const event = new PointerEvent('pointerdown');
    
    // Return whether pressure is available (not undefined)
    return typeof event.pressure !== 'undefined';
  } catch (error) {
    console.error('Error checking pressure support:', error);
    return false;
  }
};

/**
 * Check if tilt input is supported
 * @returns {boolean} Whether tilt input is supported
 */
export const isTiltSupported = (): boolean => {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') return false;
  
  // Check if pointer events are supported
  if (!('PointerEvent' in window)) return false;
  
  // Use a sample event to check if tilt is supported
  try {
    // Create a dummy pointer event to check properties
    const event = new PointerEvent('pointerdown');
    
    // Return whether tiltX and tiltY are available (not undefined)
    return typeof event.tiltX !== 'undefined' && typeof event.tiltY !== 'undefined';
  } catch (error) {
    console.error('Error checking tilt support:', error);
    return false;
  }
};

/**
 * Get pointer input capabilities
 * @returns {Object} Object containing support status for various input methods
 */
export const getPointerCapabilities = () => {
  return {
    pressure: isPressureSupported(),
    tilt: isTiltSupported(),
    pointerEvents: typeof window !== 'undefined' && 'PointerEvent' in window
  };
};

/**
 * Extract pointer data from an event
 * @param {PointerEvent} event - The pointer event
 * @returns {Object} Extracted pointer data
 */
export const extractPointerData = (event: PointerEvent) => {
  return {
    x: event.clientX,
    y: event.clientY,
    pressure: event.pressure || 0.5,
    tiltX: event.tiltX || 0,
    tiltY: event.tiltY || 0,
    pointerType: event.pointerType,
    isPrimary: event.isPrimary,
    timestamp: event.timeStamp
  };
};
