
/**
 * Pointer events utility
 * Handles different pointer types including stylus, touch, and mouse
 */

/**
 * Check if a pointer event is from a stylus
 * @param event The pointer event
 * @returns Whether the event is from a stylus
 */
export function isStylus(event: any): boolean {
  if (!event || !event.e) return false;
  
  // Use pointerType on PointerEvent if available
  if (event.e.pointerType) {
    return event.e.pointerType === 'pen';
  }
  
  // Legacy browsers: check for presence of a pressure value
  if ('pressure' in event.e) {
    return event.e.pressure > 0 && event.e.pressure < 1;
  }
  
  // Try to get from Touch API
  if (event.e.touches && event.e.touches[0]) {
    const touch = event.e.touches[0];
    return 'touchType' in touch && touch.touchType === 'stylus';
  }
  
  return false;
}

/**
 * Check if pressure input is supported
 */
export function isPressureSupported(): boolean {
  if (typeof window === 'undefined') return false;
  
  // Check if Pointer Events are supported
  if ('PointerEvent' in window) {
    return true; // PointerEvent API has pressure
  }
  
  // Check for Touch API with force support
  if ('ontouchstart' in window) {
    try {
      // Try to get the first touch point and check for force property
      const touchPoints = (window as any).navigator?.maxTouchPoints || 0;
      return touchPoints > 0;
    } catch (e) {
      return false;
    }
  }
  
  return false;
}

/**
 * Check if tilt input is supported
 */
export function isTiltSupported(): boolean {
  if (typeof window === 'undefined') return false;
  
  // Currently, only Pointer Events API supports tilt
  if ('PointerEvent' in window) {
    return true;
  }
  
  return false;
}

/**
 * Get pressure value from a pointer event
 * @param event The pointer event
 * @returns The pressure value (0-1)
 */
export function getPressure(event: any): number {
  if (!event || !event.e) return 0;
  
  // Direct pressure property
  if ('pressure' in event.e) {
    return event.e.pressure;
  }
  
  // Try to get from Touch API
  if (event.e.touches && event.e.touches[0]) {
    const touch = event.e.touches[0];
    return 'force' in touch ? touch.force : 0;
  }
  
  // Default value
  return 0;
}

/**
 * Get a standardized pointer position
 * @param event Original event (mouse, touch, pointer)
 * @param canvas Optional canvas element for coordinate conversion
 * @returns Standardized position
 */
export function getPointerPosition(event: any, canvas?: HTMLCanvasElement): { x: number, y: number } {
  // Default position
  let x = 0, y = 0;
  
  if (!event) return { x, y };
  
  try {
    // Handle fabric.js event wrapper
    if (event.pointer) {
      return { x: event.pointer.x, y: event.pointer.y };
    }
    
    // Handle fabric.js absolute pointer
    if (event.absolutePointer) {
      return { x: event.absolutePointer.x, y: event.absolutePointer.y };
    }
    
    // Extract from event object
    const e = event.e || event;
    
    // Mouse events
    if ('clientX' in e && 'clientY' in e) {
      x = e.clientX;
      y = e.clientY;
    }
    // Touch events
    else if (e.touches && e.touches[0]) {
      x = e.touches[0].clientX;
      y = e.touches[0].clientY;
    }
    // Pointer events
    else if ('pointerId' in e && 'clientX' in e) {
      x = e.clientX;
      y = e.clientY;
    }
    
    // Adjust for canvas offset if provided
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      x -= rect.left;
      y -= rect.top;
    }
  } catch (err) {
    console.error('Error getting pointer position:', err);
  }
  
  return { x, y };
}
