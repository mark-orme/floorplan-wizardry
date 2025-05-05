
/**
 * Canvas Events Utility
 * Safe event handling for Fabric.js canvas
 */
import { Canvas } from 'fabric';

type EventHandler = (...args: any[]) => void;

/**
 * Safely add an event handler to a canvas
 * @param canvas The canvas to add the handler to
 * @param eventName The event name to listen for
 * @param handler The event handler function
 */
export function addCanvasEvent(canvas: Canvas | null, eventName: string, handler: EventHandler): void {
  if (!canvas) return;
  
  try {
    canvas.on(eventName, handler as any);
  } catch (error) {
    console.error(`Error adding ${eventName} event to canvas:`, error);
  }
}

/**
 * Safely remove an event handler from a canvas
 * @param canvas The canvas to remove the handler from
 * @param eventName The event name to remove
 * @param handler The specific handler to remove (optional)
 */
export function removeCanvasEvent(canvas: Canvas | null, eventName: string, handler?: EventHandler): void {
  if (!canvas) return;
  
  try {
    if (handler) {
      // Remove specific handler
      canvas.off(eventName, handler as any);
    } else {
      // Remove all handlers for this event
      // This uses type assertion because some Fabric.js versions have different signatures
      (canvas as any).off(eventName);
    }
  } catch (error) {
    console.error(`Error removing ${eventName} event from canvas:`, error);
    
    // Try alternative method as fallback
    try {
      if (typeof (canvas as any).__eventListeners !== 'undefined') {
        (canvas as any).__eventListeners[eventName] = [];
      }
    } catch (fallbackError) {
      console.error(`Fallback error for ${eventName}:`, fallbackError);
    }
  }
}

/**
 * Add multiple event handlers to a canvas
 * @param canvas The canvas to add handlers to
 * @param handlers Object mapping event names to handlers
 */
export function addCanvasEvents(
  canvas: Canvas | null, 
  handlers: Record<string, EventHandler>
): void {
  if (!canvas) return;
  
  Object.entries(handlers).forEach(([eventName, handler]) => {
    addCanvasEvent(canvas, eventName, handler);
  });
}

/**
 * Remove multiple event handlers from a canvas
 * @param canvas The canvas to remove handlers from
 * @param handlers Object mapping event names to handlers
 */
export function removeCanvasEvents(
  canvas: Canvas | null, 
  handlers: Record<string, EventHandler | undefined>
): void {
  if (!canvas) return;
  
  Object.entries(handlers).forEach(([eventName, handler]) => {
    removeCanvasEvent(canvas, eventName, handler);
  });
}

/**
 * Remove all event handlers for specified events
 * @param canvas The canvas to clean up
 * @param eventNames Array of event names to remove all handlers for
 */
export function removeAllCanvasEvents(
  canvas: Canvas | null, 
  eventNames: string[]
): void {
  if (!canvas) return;
  
  eventNames.forEach(eventName => {
    removeCanvasEvent(canvas, eventName);
  });
}

/**
 * Create a one-time event handler
 * @param canvas The canvas to add the handler to
 * @param eventName The event name to listen for
 * @param handler The event handler function
 */
export function onceCanvasEvent(
  canvas: Canvas | null, 
  eventName: string, 
  handler: EventHandler
): void {
  if (!canvas) return;
  
  const onceHandler = ((...args: any[]) => {
    // Remove itself after execution
    removeCanvasEvent(canvas, eventName, onceHandler);
    // Call the original handler
    handler(...args);
  }) as EventHandler;
  
  addCanvasEvent(canvas, eventName, onceHandler);
}
