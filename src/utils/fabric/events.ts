
/**
 * Fabric.js event handling utilities
 * Provides helper functions for handling pointer events
 * @module fabric/events
 */

/**
 * Type guard to check if event is a touch event
 * @param {MouseEvent | TouchEvent} event - The event to check
 * @returns {boolean} True if event is a touch event
 */
export const isTouchEvent = (event: MouseEvent | TouchEvent): event is TouchEvent => {
  return 'touches' in event;
};

/**
 * Detect if the current platform is iOS
 * @returns {boolean} True if the current platform is iOS
 */
export const isIOSPlatform = (): boolean => {
  return typeof navigator !== 'undefined' && 
        (/iPad|iPhone|iPod/.test(navigator.userAgent) || 
        (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1));
};

/**
 * Safely get client X position from mouse or touch event
 * @param {MouseEvent | TouchEvent} event - The event
 * @param {number} fallback - Fallback value
 * @returns {number} The client X position
 */
export const getClientX = (event: MouseEvent | TouchEvent, fallback: number): number => {
  if (isTouchEvent(event)) {
    return event.touches && event.touches[0] ? event.touches[0].clientX : fallback;
  }
  return (event as MouseEvent).clientX;
};

/**
 * Safely get client Y position from mouse or touch event
 * @param {MouseEvent | TouchEvent} event - The event
 * @param {number} fallback - Fallback value
 * @returns {number} The client Y position
 */
export const getClientY = (event: MouseEvent | TouchEvent, fallback: number): number => {
  if (isTouchEvent(event)) {
    return event.touches && event.touches[0] ? event.touches[0].clientY : fallback;
  }
  return (event as MouseEvent).clientY;
};

/**
 * Safely get touch force (pressure) from touch event
 * @param {TouchEvent} event - The touch event
 * @returns {number | undefined} Touch force or undefined if not available
 */
export const getTouchForce = (event: TouchEvent): number | undefined => {
  if (event.touches && event.touches[0] && 'force' in event.touches[0]) {
    return event.touches[0].force;
  }
  return undefined;
};

/**
 * Apply iOS-specific event fixes to an HTML element
 * @param {HTMLElement} element - The element to apply fixes to
 */
export const applyIOSEventFixes = (element: HTMLElement): void => {
  if (!isIOSPlatform() || !element) return;
  
  // Set touch-action to none to prevent browser gestures
  element.style.touchAction = 'none';
  
  // Add touch-none class for tailwind
  element.classList.add('touch-none');
  
  // Prevent default on all touch events to avoid iOS Safari issues
  const preventDefaultTouchHandler = (e: TouchEvent) => {
    e.preventDefault();
  };
  
  element.addEventListener('touchstart', preventDefaultTouchHandler, { passive: false });
  element.addEventListener('touchmove', preventDefaultTouchHandler, { passive: false });
  element.addEventListener('touchend', preventDefaultTouchHandler, { passive: false });
  
  // Clean up function
  const cleanup = () => {
    element.removeEventListener('touchstart', preventDefaultTouchHandler);
    element.removeEventListener('touchmove', preventDefaultTouchHandler);
    element.removeEventListener('touchend', preventDefaultTouchHandler);
  };
  
  // Store cleanup function for later use
  (element as any)._iosEventCleanup = cleanup;
};

/**
 * Clean up iOS-specific event fixes from an HTML element
 * @param {HTMLElement} element - The element to clean up
 */
export const cleanupIOSEventFixes = (element: HTMLElement): void => {
  if (!element) return;
  
  if ((element as any)._iosEventCleanup && typeof (element as any)._iosEventCleanup === 'function') {
    (element as any)._iosEventCleanup();
    delete (element as any)._iosEventCleanup;
  }
};
