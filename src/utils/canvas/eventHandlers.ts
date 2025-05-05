
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
