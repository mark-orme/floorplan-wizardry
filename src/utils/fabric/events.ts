
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
