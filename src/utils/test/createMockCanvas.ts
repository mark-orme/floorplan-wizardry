
/**
 * Create a typed mock canvas for tests
 * Provides a properly typed mock canvas object for unit tests
 * @module utils/test/createMockCanvas
 */
import { Canvas as FabricCanvas } from 'fabric';
import { vi } from 'vitest';

/**
 * Creates a fully compatible mock canvas for testing
 * Ensures return types match what is expected by fabric
 * @returns Type-compatible mock canvas
 */
export function createTestMockCanvas() {
  // Create a mock withImplementation function
  const withImplementation = vi.fn().mockImplementation((callback?: Function): Promise<void> => {
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

  // Create a base canvas mock object
  const mockCanvas = {
    on: vi.fn(),
    off: vi.fn(),
    add: vi.fn(),
    remove: vi.fn(),
    getObjects: vi.fn().mockReturnValue([]),
    renderAll: vi.fn(),
    requestRenderAll: vi.fn(),
    getActiveObjects: vi.fn().mockReturnValue([]),
    discardActiveObject: vi.fn(),
    contains: vi.fn().mockReturnValue(false),
    withImplementation,
    // Additional Canvas properties for compatibility
    enablePointerEvents: true,
    _willAddMouseDown: false,
    _dropTarget: null,
    _isClick: false,
    _objects: [],
    getHandlers: vi.fn().mockReturnValue([() => {}]),
    triggerEvent: vi.fn()
  };

  // Type assertion to allow using in tests
  return mockCanvas as unknown as FabricCanvas & {
    getHandlers: (eventName: string) => Function[];
    triggerEvent: (eventName: string, eventData: any) => void;
    withImplementation: (callback?: Function) => Promise<void>;
  };
}

/**
 * Create a mock with fixed type issues
 * This is compatible with test expectations
 * @returns Type-compatible mock canvas
 */
export function createFixedMockCanvas() {
  return createTestMockCanvas();
}
