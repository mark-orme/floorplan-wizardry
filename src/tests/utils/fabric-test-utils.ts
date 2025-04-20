
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
    add: vi.fn<any[], Canvas>(),
    remove: vi.fn<[FabricObject], Canvas>(),
    contains: vi.fn<[FabricObject], boolean>().mockReturnValue(true),
    getObjects: vi.fn<[], FabricObject[]>().mockReturnValue([]),
    setActiveObject: vi.fn<[FabricObject], Canvas>(),
    getActiveObject: vi.fn<[], FabricObject | null>(),
    renderAll: vi.fn<[], void>(),
    requestRenderAll: vi.fn<[], void>(),
    getZoom: vi.fn<[], number>().mockReturnValue(1),
    setZoom: vi.fn<[number], void>(),
    on: vi.fn<[string, Function], Canvas>((eventName: string, handler: Function) => {
      if (!eventHandlers.has(eventName)) {
        eventHandlers.set(eventName, []);
      }
      eventHandlers.get(eventName)!.push(handler);
      return canvas;
    }),
    off: vi.fn<[string, Function?], Canvas>((eventName: string, handler?: Function) => {
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
    fire: vi.fn<[string, any?], Canvas>((eventName: string, options?: any) => {
      if (eventHandlers.has(eventName)) {
        eventHandlers.get(eventName)!.forEach(handler => handler(options));
      }
      return canvas;
    }),
    getWidth: vi.fn<[], number>().mockReturnValue(800),
    getHeight: vi.fn<[], number>().mockReturnValue(600),
    dispose: vi.fn<[], void>(),
    clear: vi.fn<[], void>(),
    isDrawingMode: false,
    freeDrawingBrush: {
      color: '#000000',
      width: 2
    },
    withImplementation: vi.fn<[Function], Promise<void>>().mockImplementation(() => Promise.resolve())
  } as unknown as Canvas;
  
  return canvas;
};
