
/**
 * Canvas mock utilities
 * Provides consistent mocks for Canvas objects in tests
 */
import { vi } from 'vitest';
import { Canvas as FabricCanvas } from 'fabric';

/**
 * Creates a standardized mock implementation for Canvas.withImplementation
 * that always returns Promise<void> to satisfy TypeScript
 */
export const createWithImplementationMock = () => {
  // This must return a function that returns a Promise<void>
  return vi.fn().mockImplementation((callback?: Function): Promise<void> => {
    console.log('MockCanvas: Using withImplementation mock');
    
    // Invoke the callback if provided 
    if (callback && typeof callback === 'function') {
      try {
        const result = callback();
        
        // If callback returns a promise, chain it
        if (result instanceof Promise) {
          return result.then(() => Promise.resolve());
        }
      } catch (error) {
        console.error('Error in withImplementation mock:', error);
      }
    }
    
    // Always return a Promise<void>
    return Promise.resolve();
  });
};

/**
 * Creates a consistent mock Canvas implementation
 * that can be used across test files
 */
export const createMockCanvas = (): Partial<FabricCanvas> => {
  console.log('Creating mock canvas with standardized implementation');
  
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
    // Properly implemented withImplementation that returns Promise<void>
    withImplementation: createWithImplementationMock()
  };
};

/**
 * Creates a properly typed canvas mock with all required Canvas features
 * and strict return type consistency
 */
export const createTypedMockCanvas = () => {
  console.log('Creating fully typed mock canvas');
  
  const withImplementationMock = createWithImplementationMock();
  
  const mockCanvas = {
    add: vi.fn().mockReturnThis(),
    remove: vi.fn().mockReturnThis(),
    getObjects: vi.fn().mockReturnValue([]),
    renderAll: vi.fn(),
    requestRenderAll: vi.fn(),
    on: vi.fn().mockReturnThis(),
    off: vi.fn().mockReturnThis(),
    getActiveObject: vi.fn().mockReturnValue(null),
    getActiveObjects: vi.fn().mockReturnValue([]),
    discardActiveObject: vi.fn().mockReturnThis(),
    contains: vi.fn().mockReturnValue(false),
    setBackgroundColor: vi.fn().mockReturnThis(),
    setWidth: vi.fn().mockReturnThis(),
    setHeight: vi.fn().mockReturnThis(),
    getWidth: vi.fn().mockReturnValue(800),
    getHeight: vi.fn().mockReturnValue(600),
    setZoom: vi.fn().mockReturnThis(),
    getZoom: vi.fn().mockReturnValue(1),
    viewportTransform: [1, 0, 0, 1, 0, 0],
    clearContext: vi.fn(),
    clear: vi.fn(),
    dispose: vi.fn(),
    getCenter: vi.fn().mockReturnValue({ left: 400, top: 300 }),
    getContext: vi.fn().mockReturnValue({}),
    getElement: vi.fn().mockReturnValue(document.createElement('canvas')),
    getPointer: vi.fn().mockReturnValue({ x: 0, y: 0 }),
    withImplementation: withImplementationMock
  };
  
  return mockCanvas;
};
