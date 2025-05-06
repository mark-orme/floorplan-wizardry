
import { Canvas, Object as FabricObject } from 'fabric';

/**
 * Safe canvas event handler type
 */
type CanvasEventHandler = (e: any) => void;

/**
 * Add event handlers to a canvas safely
 * @param canvas The canvas to add handlers to
 * @param handlers Map of event names to handlers
 * @returns Function to remove all added handlers
 */
export function addCanvasEventHandlers(
  canvas: Canvas | null,
  handlers: Record<string, CanvasEventHandler>
): () => void {
  if (!canvas) return () => {};

  // Add all handlers
  for (const [event, handler] of Object.entries(handlers)) {
    canvas.on(event, handler);
  }
  
  // Return a cleanup function
  return () => {
    if (canvas) {
      for (const [event, handler] of Object.entries(handlers)) {
        safeRemoveEvent(canvas, event, handler);
      }
    }
  };
}

/**
 * Remove an event handler safely
 * This handles different versions of fabric.js which might have different signatures
 */
export function safeRemoveEvent(
  canvas: Canvas,
  eventName: string,
  handler?: Function
): void {
  try {
    if (handler) {
      canvas.off(eventName, handler as any);
    } else {
      // Some fabric versions allow removing all handlers for an event
      // Using 'any' to bypass type checking since this is version-dependent
      canvas.off(eventName);
    }
  } catch (error) {
    console.error(`Error removing event handler for ${eventName}:`, error);
    
    // Fallback to try different method signatures
    try {
      // Try forcing a handler-less removal
      (canvas as any).off(eventName);
    } catch (fallbackError) {
      // Last resort: do nothing, just log the error
      console.warn(`Could not remove event handler for ${eventName}`);
    }
  }
}

/**
 * Add one-time event handlers to a canvas
 * This automatically removes the handlers after they're triggered once
 * 
 * @param canvas The canvas to add handlers to
 * @param handlers Map of event names to handlers
 * @returns Function to remove all added handlers
 */
export function addOneTimeCanvasEventHandlers(
  canvas: Canvas | null,
  handlers: Record<string, CanvasEventHandler>
): () => void {
  if (!canvas) return () => {};
  
  // Track which handlers have been added
  const addedHandlers: Record<string, CanvasEventHandler> = {};
  
  // Create wrapped handlers that remove themselves after execution
  for (const [event, originalHandler] of Object.entries(handlers)) {
    const wrappedHandler = (e: any) => {
      // Execute original handler
      originalHandler(e);
      
      // Remove this handler
      if (canvas) {
        try {
          canvas.off(event, wrappedHandler as any);
        } catch (error) {
          console.error(`Error removing one-time event handler for ${event}:`, error);
        }
      }
    };
    
    // Add the wrapped handler
    canvas.on(event, wrappedHandler as any);
    addedHandlers[event] = wrappedHandler;
  }
  
  // Return cleanup function
  return () => {
    if (canvas) {
      for (const [event, handler] of Object.entries(addedHandlers)) {
        safeRemoveEvent(canvas, event, handler);
      }
    }
  };
}
