
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
