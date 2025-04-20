
/**
 * Utility functions for testing with Fabric.js
 * Provides properly typed mocks and helper functions
 */
import { vi } from 'vitest';
import { Canvas, Object as FabricObject, Line, Point } from 'fabric';

/**
 * Create a mock Canvas instance
 * @returns A mocked Fabric Canvas with type-safe methods
 */
export const createMockCanvas = (): Canvas => {
  const eventHandlers = new Map<string, Array<Function>>();
  
  const canvas = {
    add: vi.fn(),
    remove: vi.fn(),
    contains: vi.fn().mockReturnValue(true),
    getObjects: vi.fn().mockReturnValue([]),
    setActiveObject: vi.fn(),
    getActiveObject: vi.fn(),
    renderAll: vi.fn(),
    requestRenderAll: vi.fn(),
    getZoom: vi.fn().mockReturnValue(1),
    setZoom: vi.fn(),
    on: vi.fn((eventName: string, handler: Function) => {
      if (!eventHandlers.has(eventName)) {
        eventHandlers.set(eventName, []);
      }
      eventHandlers.get(eventName)!.push(handler);
      return canvas;
    }),
    off: vi.fn((eventName: string, handler?: Function) => {
      if (eventHandlers.has(eventName)) {
        if (handler) {
          const handlers = eventHandlers.get(eventName)!;
          const index = handlers.indexOf(handler);
          if (index !== -1) {
            handlers.splice(index, 1);
          }
        } else {
          eventHandlers.delete(eventName);
        }
      }
      return canvas;
    }),
    fire: vi.fn((eventName: string, options?: any) => {
      if (eventHandlers.has(eventName)) {
        eventHandlers.get(eventName)!.forEach(handler => handler(options));
      }
      return canvas;
    }),
    getWidth: vi.fn().mockReturnValue(800),
    getHeight: vi.fn().mockReturnValue(600),
    dispose: vi.fn(),
    clear: vi.fn(),
    isDrawingMode: false,
    freeDrawingBrush: {
      color: '#000000',
      width: 2
    },
    // Fix: Correctly typed withImplementation that returns Promise<void>
    withImplementation: vi.fn().mockImplementation(() => Promise.resolve())
  } as unknown as Canvas;
  
  return canvas;
};
