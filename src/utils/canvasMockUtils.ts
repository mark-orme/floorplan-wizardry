
/**
 * Canvas Mock Utilities
 * Provides utilities for mocking canvas objects in tests
 * @module utils/canvasMockUtils
 */
import { Canvas as FabricCanvas } from 'fabric';
import { ICanvasMock } from '@/types/testing/ICanvasMock';

/**
 * Create a typed mock canvas for testing
 * @returns A mock canvas object with common methods stubbed
 */
export function createTypedMockCanvas(): ICanvasMock {
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
    // Properly implement withImplementation to return Promise<void>
    withImplementation: vi.fn().mockImplementation((callback?: Function): Promise<void> => {
      console.log('ICanvasMock: withImplementation called');
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
    }),
    // Additional Canvas properties
    enablePointerEvents: true,
    _willAddMouseDown: false,
    _dropTarget: null,
    _isClick: false,
    _objects: [],
    getHandlers: (eventName: string) => [() => {}],
    triggerEvent: (eventName: string, eventData: any) => {}
  };
}

/**
 * Create a mock implementation of withImplementation
 * @returns A mock implementation that returns a Promise<void>
 */
export function createWithImplementationMock() {
  return vi.fn().mockImplementation((callback?: Function): Promise<void> => {
    if (callback && typeof callback === 'function') {
      try {
        const result = callback();
        if (result instanceof Promise) {
          return result.then(() => Promise.resolve());
        }
      } catch (error) {
        console.error('Error in withImplementation mock:', error);
      }
    }
    return Promise.resolve();
  });
}

/**
 * Create a mock history ref for drawing history tests
 * @returns A mock history ref object
 */
export function createMockHistoryRef() {
  return {
    current: {
      states: [],
      currentIndex: -1,
      maxStates: 10,
      canUndo: false,
      canRedo: false
    }
  };
}

/**
 * Type-safe assertion function to use in tests
 * @param canvas Any canvas-like object
 * @returns Canvas with added mock methods
 */
export function assertMockCanvas(canvas: any): FabricCanvas & {
  getHandlers: (eventName: string) => Function[];
  triggerEvent: (eventName: string, eventData: any) => void;
} {
  // Use type assertion to ensure mock canvas compatibility with Fabric.Canvas
  return canvas as unknown as FabricCanvas & {
    getHandlers: (eventName: string) => Function[];
    triggerEvent: (eventName: string, eventData: any) => void;
  };
}
