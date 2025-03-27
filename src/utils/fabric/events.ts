
/**
 * Event utilities for Fabric.js
 * Provides type guards and event handling helpers
 * @module fabric/events
 */
import { CustomTouchEvent } from "@/types/fabric";

/**
 * Type guard to check if an event is a touch event
 * Used to safely handle both mouse and touch interactions
 * 
 * @param {unknown} event - The event to check
 * @returns {boolean} True if the event is a touch event
 */
export function isTouchEvent(event: unknown): event is TouchEvent {
  return Boolean(
    event && 
    typeof event === 'object' && 
    'touches' in event && 
    'changedTouches' in event
  );
}

/**
 * Type guard to check if an event is a mouse event
 * 
 * @param {unknown} event - The event to check
 * @returns {boolean} True if the event is a mouse event
 */
export function isMouseEvent(event: unknown): event is MouseEvent {
  return Boolean(
    event && 
    typeof event === 'object' && 
    'clientX' in event &&
    'clientY' in event &&
    !('touches' in event)
  );
}

/**
 * Type guard to check if an event is a keyboard event
 * 
 * @param {unknown} event - The event to check
 * @returns {boolean} True if the event is a keyboard event
 */
export function isKeyboardEvent(event: unknown): event is KeyboardEvent {
  return Boolean(
    event && 
    typeof event === 'object' && 
    'key' in event && 
    'code' in event
  );
}

/**
 * Extract client coordinates from either mouse or touch event
 * Provides consistent coordinate extraction regardless of event type
 * 
 * @param {MouseEvent | TouchEvent} event - Mouse or touch event
 * @returns {{clientX: number, clientY: number} | null} Coordinates or null if invalid
 */
export function extractClientCoordinates(event: MouseEvent | TouchEvent): {clientX: number, clientY: number} | null {
  if (isTouchEvent(event) && event.touches && event.touches.length > 0) {
    return {
      clientX: event.touches[0].clientX,
      clientY: event.touches[0].clientY
    };
  } else if (isMouseEvent(event)) {
    return {
      clientX: event.clientX,
      clientY: event.clientY
    };
  }
  return null;
}

/**
 * Safely get touch count from event
 * Returns 0 if not a touch event or no touches
 * 
 * @param {Event} event - The event to check
 * @returns {number} Number of active touches
 */
export function getTouchCount(event: Event): number {
  if (isTouchEvent(event)) {
    return event.touches.length;
  }
  return 0;
}

/**
 * Detect if the current platform is iOS
 * Used to apply specific fixes for iOS devices
 * Safely handles server-side rendering by checking for navigator
 * 
 * @returns {boolean} True if running on iOS platform
 */
export function isIOSPlatform(): boolean {
  // Check if we're in a browser environment
  if (typeof navigator === 'undefined') {
    return false;
  }
  
  const userAgent = navigator.userAgent || '';
  return /iPad|iPhone|iPod/.test(userAgent) && 
         !(window as any).MSStream; // Exclude IE11
}

/**
 * Apply iOS-specific event fixes to a canvas element
 * iOS has various quirks with touch events that need special handling
 * 
 * @param {HTMLCanvasElement | null} canvasElement - The canvas element to apply fixes to
 */
export function applyIOSEventFixes(canvasElement: HTMLCanvasElement | null): void {
  // Check if canvasElement exists and if we're on iOS
  if (!canvasElement || !isIOSPlatform()) return;
  
  // Prevent scrolling when interacting with canvas on iOS
  canvasElement.style.touchAction = 'none';
  
  // iOS-specific event handler to prevent default behaviors
  const preventIOSBehaviors = (e: TouchEvent) => {
    if (e.touches.length <= 1) {
      e.preventDefault(); // Prevent scrolling for single-touch interactions
    }
  };
  
  // Add passive: false to ensure preventDefault works
  canvasElement.addEventListener('touchstart', preventIOSBehaviors, { passive: false });
  canvasElement.addEventListener('touchmove', preventIOSBehaviors, { passive: false });
  
  // Add specific handler for Apple Pencil if detected
  const handleTouchForce = (e: TouchEvent) => {
    // Check if this touch has force data (Apple Pencil)
    if (e.touches[0] && 'force' in e.touches[0]) {
      e.preventDefault();
      // Prevent any default behavior for stylus/pencil
    }
  };
  
  canvasElement.addEventListener('touchmove', handleTouchForce, { passive: false });
  
  console.log('iOS event fixes applied to canvas');
}
