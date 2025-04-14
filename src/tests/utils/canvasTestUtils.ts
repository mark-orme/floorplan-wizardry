
import { vi } from 'vitest';
import { Canvas as FabricCanvas } from 'fabric';

/**
 * Create a mockable canvas for testing
 * @returns A mock Canvas instance
 */
export function createMockCanvas() {
  return {
    add: vi.fn(),
    remove: vi.fn(),
    getObjects: vi.fn().mockReturnValue([]),
    renderAll: vi.fn(),
    requestRenderAll: vi.fn(),
    on: vi.fn(),
    off: vi.fn(),
    getActiveObjects: vi.fn().mockReturnValue([]),
    discardActiveObject: vi.fn(),
    contains: vi.fn().mockReturnValue(false),
    getPointer: vi.fn().mockReturnValue({ x: 100, y: 100 }),
    setViewportTransform: vi.fn(),
    zoomToPoint: vi.fn(),
    setZoom: vi.fn(),
    getZoom: vi.fn().mockReturnValue(1),
    isDrawingMode: false,
    selection: true,
    getWidth: vi.fn().mockReturnValue(800),
    getHeight: vi.fn().mockReturnValue(600),
    freeDrawingBrush: {
      color: '#000000',
      width: 2
    }
  } as unknown as FabricCanvas;
}

/**
 * Create a mock pointer event for testing canvas interactions
 * @param type Event type
 * @param x X coordinate
 * @param y Y coordinate
 * @param options Additional options
 * @returns Mock pointer event
 */
export function createMockPointerEvent(
  type: string, 
  x: number, 
  y: number, 
  options: Partial<PointerEvent> = {}
) {
  return {
    type,
    clientX: x,
    clientY: y,
    preventDefault: vi.fn(),
    stopPropagation: vi.fn(),
    ...options
  } as unknown as PointerEvent;
}

/**
 * Simulate canvas event dispatch
 * @param canvas The mock canvas
 * @param eventName The event name to trigger
 * @param eventData The event data
 */
export function triggerCanvasEvent(
  canvas: FabricCanvas,
  eventName: string,
  eventData: any
) {
  // Get handler from on method calls
  const onCalls = (canvas.on as any).mock.calls;
  
  // Find the handler for this event
  const handlerCall = onCalls.find((call: any[]) => call[0] === eventName);
  
  if (handlerCall && typeof handlerCall[1] === 'function') {
    // Call the handler with the event data
    handlerCall[1](eventData);
  }
}
