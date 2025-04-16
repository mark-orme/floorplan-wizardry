
/**
 * Defines the possible input methods for drawing tools
 * Used for optimizing interactions based on input device
 */
export enum InputMethod {
  MOUSE = 'mouse',
  TOUCH = 'touch',
  PENCIL = 'pencil', // Apple Pencil
  STYLUS = 'stylus',  // Generic stylus
}

/**
 * Helper function to determine if an input method is a stylus
 */
export function isStylusInput(method: InputMethod): boolean {
  return method === InputMethod.PENCIL || method === InputMethod.STYLUS;
}

/**
 * Helper function to determine if a pointer event is from a stylus
 */
export function detectStylusFromEvent(e: PointerEvent | TouchEvent): boolean {
  // Check pointer type for pointer events
  if ('pointerType' in e) {
    return e.pointerType === 'pen';
  }
  
  // For touch events, try to detect stylus based on touch properties
  if ('touches' in e && e.touches.length > 0) {
    const touch = e.touches[0] as any;
    
    // Force data is typically available for Apple Pencil
    if (typeof touch.force !== 'undefined' && touch.force > 0) {
      return true;
    }
    
    // Some browsers provide touchType property
    if (touch.touchType && touch.touchType === 'stylus') {
      return true;
    }
    
    // Check for small radius (stylus has smaller contact area than finger)
    if (touch.radiusX && touch.radiusY && 
        touch.radiusX < 10 && touch.radiusY < 10) {
      return true;
    }
  }
  
  return false;
}
