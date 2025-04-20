
/**
 * Canvas Mock Utilities
 * Provides mock implementations for Canvas methods
 * @module utils/canvasMockUtils
 */
import { vi } from 'vitest';

/**
 * Creates a proper withImplementation mock that returns Promise<void>
 * This ensures compatibility with the Canvas.withImplementation method
 * 
 * @returns Mock function for withImplementation
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
 * Create mock grid objects for testing
 * 
 * @param count Number of grid objects to create
 * @returns Array of mock grid objects
 */
export function createMockGridObjects(count = 10) {
  const gridObjects = [];
  
  for (let i = 0; i < count; i++) {
    gridObjects.push({
      id: `grid-${i}`,
      type: i % 2 === 0 ? 'line' : 'text',
      set: vi.fn(),
      setCoords: vi.fn(),
      visible: true
    });
  }
  
  return gridObjects;
}

/**
 * Create mock canvas for tests that returns Promise<void> from withImplementation
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
    withImplementation: createWithImplementationMock(),
    enablePointerEvents: true,
    getHandlers: vi.fn((eventName) => [() => {}]),
    triggerEvent: vi.fn((eventName, eventData) => {})
  };
}
