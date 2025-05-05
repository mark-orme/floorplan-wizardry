
import { Canvas, Object as FabricObject } from 'fabric';

/**
 * Safely add an event handler to a canvas
 * @param canvas The canvas to add the event handler to
 * @param eventName The name of the event
 * @param handler The event handler function
 */
export function addCanvasEvent(
  canvas: Canvas | null, 
  eventName: string, 
  handler: Function
): void {
  if (!canvas) return;
  
  try {
    canvas.on(eventName, handler as any);
  } catch (error) {
    console.error(`Error adding event handler for ${eventName}:`, error);
  }
}

/**
 * Safely remove an event handler from a canvas
 * @param canvas The canvas to remove the event handler from
 * @param eventName The name of the event
 * @param handler The event handler function (optional)
 */
export function removeCanvasEvent(
  canvas: Canvas | null, 
  eventName: string, 
  handler?: Function
): void {
  if (!canvas) return;
  
  try {
    if (handler) {
      canvas.off(eventName, handler as any);
    } else {
      // Some fabric versions need just the event name to remove all handlers
      canvas.off(eventName);
    }
  } catch (error) {
    console.error(`Error removing event handler for ${eventName}:`, error);
  }
}

/**
 * Safely add an object event handler
 * @param object The fabric object to add the event handler to
 * @param eventName The name of the event
 * @param handler The event handler function
 */
export function addObjectEvent(
  object: FabricObject | null,
  eventName: string,
  handler: Function
): void {
  if (!object) return;
  
  try {
    object.on(eventName, handler as any);
  } catch (error) {
    console.error(`Error adding object event handler for ${eventName}:`, error);
  }
}

/**
 * Safely remove an object event handler
 * @param object The fabric object to remove the event handler from
 * @param eventName The name of the event
 * @param handler The event handler function (optional)
 */
export function removeObjectEvent(
  object: FabricObject | null,
  eventName: string,
  handler?: Function
): void {
  if (!object) return;
  
  try {
    if (handler) {
      object.off(eventName, handler as any);
    } else {
      // Some fabric versions need just the event name to remove all handlers
      object.off(eventName);
    }
  } catch (error) {
    console.error(`Error removing object event handler for ${eventName}:`, error);
  }
}

/**
 * Get pointer coordinates from a fabric mouse event
 * @param event The fabric mouse event
 * @returns The pointer coordinates
 */
export function getPointerFromEvent(event: any): { x: number, y: number } | null {
  if (!event) return null;
  
  try {
    if (event.pointer) {
      return event.pointer;
    } else if (event.absolutePointer) {
      return event.absolutePointer;
    } else if (event.e && 'clientX' in event.e && 'clientY' in event.e) {
      return { x: event.e.clientX, y: event.e.clientY };
    }
    return null;
  } catch (error) {
    console.error('Error getting pointer from event:', error);
    return null;
  }
}

/**
 * Check if a fabric canvas is valid and active
 * @param canvas The canvas to check
 * @returns Whether the canvas is valid
 */
export function isValidCanvas(canvas: any): boolean {
  return (
    canvas && 
    typeof canvas === 'object' && 
    typeof canvas.on === 'function' &&
    typeof canvas.off === 'function' && 
    typeof canvas.add === 'function'
  );
}
