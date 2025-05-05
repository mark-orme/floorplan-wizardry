
import { Canvas as FabricCanvas } from 'fabric';

/**
 * Safely add event handler to canvas
 * @param canvas Fabric canvas
 * @param eventName Event name
 * @param handler Event handler
 */
export function addCanvasEventHandler(
  canvas: FabricCanvas,
  eventName: string,
  handler: Function
) {
  if (!canvas) return;
  
  canvas.on(eventName, handler as any);
}

/**
 * Safely remove event handler from canvas
 * @param canvas Fabric canvas
 * @param eventName Event name
 * @param handler Event handler (optional in some versions)
 */
export function removeCanvasEventHandler(
  canvas: FabricCanvas,
  eventName: string,
  handler?: Function
) {
  if (!canvas) return;
  
  if (handler) {
    canvas.off(eventName, handler as any);
  } else {
    // Some versions support removing all handlers for an event
    canvas.off(eventName);
  }
}

/**
 * Add multiple event handlers to canvas
 * @param canvas Fabric canvas
 * @param handlers Event handlers mapping
 */
export function addCanvasEventHandlers(
  canvas: FabricCanvas,
  handlers: Record<string, Function>
) {
  if (!canvas) return;
  
  Object.entries(handlers).forEach(([eventName, handler]) => {
    addCanvasEventHandler(canvas, eventName, handler);
  });
}

/**
 * Remove multiple event handlers from canvas
 * @param canvas Fabric canvas
 * @param handlers Event handlers mapping
 */
export function removeCanvasEventHandlers(
  canvas: FabricCanvas,
  handlers: Record<string, Function>
) {
  if (!canvas) return;
  
  Object.entries(handlers).forEach(([eventName, handler]) => {
    removeCanvasEventHandler(canvas, eventName, handler);
  });
}

/**
 * Handles the different versions of fabric.js event listener removal
 * Some versions expect 1 arg, some expect 2 args, and some can handle both
 * @param canvas The canvas to remove listeners from
 * @param eventName The event name
 * @param handler Optional event handler
 */
export function safeRemoveCanvasEvent(
  canvas: FabricCanvas,
  eventName: string,
  handler?: Function
) {
  if (!canvas) return;
  
  try {
    // Try with both arguments first
    if (handler) {
      canvas.off(eventName, handler as any);
    } else {
      // Some versions just need the event name
      (canvas as any).off(eventName);
    }
  } catch (e) {
    // Fallbacks for different fabric versions
    try {
      // Try with just the event name
      (canvas as any).off(eventName);
    } catch (e2) {
      console.warn(`Could not remove event handler for ${eventName}`, e2);
    }
  }
}
