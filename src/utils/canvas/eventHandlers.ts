
/**
 * Canvas Event Handlers
 * Provides utilities for safely adding and removing event handlers from canvas objects
 */
import { Canvas } from 'fabric';

/**
 * Safely add an event handler to a canvas
 * @param canvas The canvas to add the handler to
 * @param eventName The name of the event
 * @param handler The event handler function
 */
export function addCanvasEvent(canvas: Canvas | null, eventName: string, handler: Function) {
  if (!canvas) return;
  
  canvas.on(eventName, handler as any);
}

/**
 * Safely remove an event handler from a canvas
 * This handles different versions of fabric.js which might have different signatures
 * 
 * @param canvas The canvas to remove the handler from
 * @param eventName The name of the event
 * @param handler The event handler function (optional in some fabric versions)
 */
export function removeCanvasEvent(canvas: Canvas | null, eventName: string, handler?: Function) {
  if (!canvas) return;
  
  try {
    // If the handler is provided, try to remove it specifically
    if (handler) {
      canvas.off(eventName, handler as any);
    } else {
      // Some fabric versions allow removing all handlers for an event
      // Using 'any' to bypass type checking since this is version-dependent
      (canvas as any).off(eventName);
    }
  } catch (error) {
    console.error(`Error removing event handler for ${eventName}:`, error);
    
    // Fallback to try different method signatures
    try {
      // Try forcing a handler-less removal
      (canvas as any).off(eventName);
    } catch (fallbackError) {
      console.error(`Fallback error removing handler for ${eventName}:`, fallbackError);
    }
  }
}

/**
 * Create a dummy handler for canvas events
 * This is useful when you need to provide a handler but don't need it to do anything
 */
export function createEmptyHandler() {
  return () => {};
}

/**
 * Version-safe addEventListener for canvas elements
 */
export function addDomCanvasEvent(
  canvasElement: HTMLCanvasElement | null,
  eventName: string,
  handler: EventListener,
  options?: boolean | AddEventListenerOptions
) {
  if (!canvasElement) return;
  
  canvasElement.addEventListener(eventName, handler, options);
}

/**
 * Version-safe removeEventListener for canvas elements
 */
export function removeDomCanvasEvent(
  canvasElement: HTMLCanvasElement | null,
  eventName: string,
  handler: EventListener,
  options?: boolean | EventListenerOptions
) {
  if (!canvasElement) return;
  
  canvasElement.removeEventListener(eventName, handler, options);
}
