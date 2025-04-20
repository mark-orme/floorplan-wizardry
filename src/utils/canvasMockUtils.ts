
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
  return vi.fn().mockImplementation((callback?: Function) => {
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
    // This is the key fix - ensure withImplementation returns Promise<void>
    withImplementation: createWithImplementationMock()
  };
};
