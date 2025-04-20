
/**
 * Canvas mock utilities
 * Provides typed mock objects for testing canvas components
 * @module utils/canvasMockUtils
 */
import { vi } from 'vitest';
import type { Canvas as FabricCanvas } from 'fabric';

/**
 * Interface for typed canvas mock
 */
export interface TypedCanvasMock {
  add: jest.Mock | ViJestMock;
  remove: jest.Mock | ViJestMock;
  renderAll: jest.Mock | ViJestMock;
  isDrawingMode: boolean;
  freeDrawingBrush: {
    color: string;
    width: number;
  };
  getObjects: jest.Mock | ViJestMock;
  clear: jest.Mock | ViJestMock;
  setWidth: jest.Mock | ViJestMock;
  setHeight: jest.Mock | ViJestMock;
  setZoom: jest.Mock | ViJestMock;
  getZoom: jest.Mock | ViJestMock;
  viewportTransform: number[];
  selection: boolean;
  on: jest.Mock | ViJestMock;
  off: jest.Mock | ViJestMock;
  toJSON: jest.Mock | ViJestMock;
  loadFromJSON: jest.Mock | ViJestMock;
  requestRenderAll: jest.Mock | ViJestMock;
  getHandlers?: (eventName: string) => Function[];
  triggerEvent?: (eventName: string, eventData: any) => void;
  withImplementation?: jest.Mock | ViJestMock;
  [key: string]: any;
}

type ViJestMock = ReturnType<typeof vi.fn>;

/**
 * Create a typed mock canvas for testing
 * @returns A canvas mock with all required methods
 */
export const createTypedMockCanvas = (): TypedCanvasMock => {
  const eventHandlers: Record<string, Function[]> = {};
  
  const mockCanvas = {
    add: vi.fn(),
    remove: vi.fn(),
    renderAll: vi.fn(),
    isDrawingMode: false,
    freeDrawingBrush: {
      color: '#000000',
      width: 2
    },
    getObjects: vi.fn().mockReturnValue([]),
    clear: vi.fn(),
    setWidth: vi.fn(),
    setHeight: vi.fn(),
    setZoom: vi.fn(),
    getZoom: vi.fn().mockReturnValue(1),
    viewportTransform: [1, 0, 0, 1, 0, 0],
    selection: true,
    on: vi.fn().mockImplementation((eventName: string, handler: Function) => {
      if (!eventHandlers[eventName]) {
        eventHandlers[eventName] = [];
      }
      eventHandlers[eventName].push(handler);
      return mockCanvas;
    }),
    off: vi.fn(),
    toJSON: vi.fn().mockReturnValue({}),
    loadFromJSON: vi.fn().mockImplementation((json, callback) => {
      if (callback) callback();
      return mockCanvas;
    }),
    requestRenderAll: vi.fn(),
    // Helper methods for tests
    getHandlers: (eventName: string) => eventHandlers[eventName] || [],
    triggerEvent: (eventName: string, eventData: any) => {
      if (eventHandlers[eventName]) {
        eventHandlers[eventName].forEach(handler => handler(eventData));
      }
    },
    withImplementation: vi.fn().mockImplementation((callback?: Function): Promise<void> => {
      if (callback && typeof callback === 'function') {
        try {
          const result = callback();
          if (result instanceof Promise) {
            return result.then(() => Promise.resolve());
          }
        } catch (error) {
          console.error('Error in mock withImplementation:', error);
        }
      }
      return Promise.resolve();
    })
  };
  
  return mockCanvas;
};

/**
 * Create a mock with withImplementation method
 * @returns A canvas mock with withImplementation method
 */
export const createWithImplementationMock = (): TypedCanvasMock => {
  const canvas = createTypedMockCanvas();
  
  // Add a strongly typed withImplementation method
  canvas.withImplementation = vi.fn().mockImplementation((callback?: Function): Promise<void> => {
    if (callback && typeof callback === 'function') {
      try {
        const result = callback();
        if (result instanceof Promise) {
          return result.then(() => Promise.resolve());
        }
      } catch (error) {
        console.error('Error in mock withImplementation:', error);
      }
    }
    return Promise.resolve();
  });
  
  return canvas;
};

/**
 * Assert that a value is a mock canvas
 * @param value The value to check
 * @returns The value as a mock canvas, casting only if it matches the interface
 */
export const asMockCanvas = (value: any): FabricCanvas => {
  // This function only performs a type assertion, not actual runtime validation
  // In real code, you would add validation here
  return value as unknown as FabricCanvas;
};
