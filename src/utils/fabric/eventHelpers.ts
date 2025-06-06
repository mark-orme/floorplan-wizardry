
/**
 * Helper functions for Fabric.js events
 * @module utils/fabric/eventHelpers
 */
import { TEvent, TPointerEvent } from 'fabric';
import { Point } from '@/types/core/Point';

/**
 * Extract coordinates from a Fabric.js pointer event safely
 * Works with both mouse and touch events
 * 
 * @param {TEvent<TPointerEvent> | null} e - The Fabric event
 * @returns {Point} The extracted coordinates
 */
export function getPointerCoordinates(e: TEvent<TPointerEvent> | null): Point {
  if (!e || !e.e) {
    return { x: 0, y: 0 };
  }
  
  // Extract from original event as fallback
  const nativeEvent = e.e;
  if ('clientX' in nativeEvent && 'clientY' in nativeEvent) {
    // Mouse event
    return {
      x: nativeEvent.clientX,
      y: nativeEvent.clientY
    };
  } else if ('touches' in nativeEvent && nativeEvent.touches.length > 0) {
    // Touch event
    return {
      x: nativeEvent.touches[0].clientX,
      y: nativeEvent.touches[0].clientY
    };
  }
  
  // Last resort fallback
  return { x: 0, y: 0 };
}

/**
 * Type guard to check if event has proper coordinates
 * 
 * @param {TEvent<TPointerEvent> | null} e - The event to check
 * @returns {boolean} Whether the event has coordinates
 */
export function hasValidCoordinates(e: TEvent<TPointerEvent> | null): boolean {
  if (!e || !e.e) return false;
  
  return (
    ('clientX' in e.e) ||
    ('touches' in e.e && e.e.touches.length > 0)
  );
}
