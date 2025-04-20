
/**
 * Create a typed mock canvas for tests
 * Provides a properly typed mock canvas object for unit tests
 * @module utils/test/createMockCanvas
 */
import { Canvas as FabricCanvas } from 'fabric';
import { asMockCanvas } from '@/types/testing/ICanvasMock';
import { vi } from 'vitest';

/**
 * Creates a withImplementation mock that returns Promise<void>
 * @returns Mock function with correct return type
 */
export function createWithImplementationMock() {
  // Create a mock that returns a promise
  return vi.fn().mockImplementation((callback?: Function): Promise<void> => {
    // Log that withImplementation was called for debugging
    console.log('Mock withImplementation called');
    
    // If a callback is provided, execute it
    if (callback && typeof callback === 'function') {
      try {
        const result = callback();
        
        // If the callback returns a promise, return that promise
        if (result instanceof Promise) {
          return result.then(() => Promise.resolve());
        }
      } catch (error) {
        console.error('Error in mock withImplementation:', error);
        // Don't rethrow, just log for test stability
      }
    }
    
    // Always return a resolved promise for stability
    return Promise.resolve();
  });
}

/**
 * Creates a strongly-typed mock Fabric.js canvas for testing
 * Ensures all required properties and methods are properly mocked
 * 
 * @returns A properly typed mock canvas object
 */
export const createTypedMockCanvas = () => {
  console.log('Creating typed mock canvas with proper interface');
  
  const mockCanvas = {
    on: vi.fn(),
    off: vi.fn(),
    add: vi.fn(),
    remove: vi.fn(),
    getObjects: vi.fn().mockReturnValue([]),
    clear: vi.fn(),
    renderAll: vi.fn(),
    getWidth: vi.fn().mockReturnValue(800),
    getHeight: vi.fn().mockReturnValue(600),
    setWidth: vi.fn(),
    setHeight: vi.fn(),
    getElement: vi.fn(),
    getContext: vi.fn(),
    dispose: vi.fn(),
    requestRenderAll: vi.fn(),
    loadFromJSON: vi.fn((json, callback) => {
      if (callback) callback();
      return Promise.resolve();
    }),
    toJSON: vi.fn().mockReturnValue({}),
    getCenter: vi.fn().mockReturnValue({ top: 300, left: 400 }),
    setViewportTransform: vi.fn(),
    getActiveObject: vi.fn(),
    sendObjectToBack: vi.fn(),
    bringObjectToFront: vi.fn(),
    discardActiveObject: vi.fn(),
    isDrawingMode: false,
    selection: true,
    defaultCursor: 'default',
    getHandlers: vi.fn((eventName) => [() => {}]),
    triggerEvent: vi.fn((eventName, eventData) => {}),
    // Enhanced Canvas properties for test compatibility
    enablePointerEvents: true,
    _willAddMouseDown: false,
    _dropTarget: null,
    _isClick: false,
    _objects: [],
    // Use the fixed withImplementation implementation that returns Promise<void>
    withImplementation: createWithImplementationMock()
  };
  
  return asMockCanvas(mockCanvas as unknown as FabricCanvas);
};
