
import { vi } from 'vitest';
import { Canvas as FabricCanvas } from 'fabric';

/**
 * Creates a standardized mock implementation for Canvas.withImplementation
 * that always returns Promise<void> to satisfy TypeScript
 */
export const createWithImplementationMock = () => {
  return vi.fn().mockImplementation((callback?: Function) => {
    // Ensure we always return Promise<void> regardless of what callback does
    if (callback && typeof callback === 'function') {
      try {
        const result = callback();
        // If callback returns a promise, chain it but always return Promise<void>
        if (result instanceof Promise) {
          return result.then(() => Promise.resolve());
        }
      } catch (error) {
        console.error('Error in withImplementation mock:', error);
      }
    }
    // Always resolve with void
    return Promise.resolve();
  });
};

/**
 * Creates a consistent mock Canvas implementation
 * that can be used across test files to avoid type inconsistencies
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
    withImplementation: createWithImplementationMock()
  };
};
