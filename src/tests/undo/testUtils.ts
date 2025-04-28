
import { vi } from 'vitest';

/**
 * Creates a mock canvas reference for testing
 */
export function createCanvasRef() {
  return {
    current: {
      add: vi.fn(),
      remove: vi.fn(),
      clear: vi.fn(),
      renderAll: vi.fn(),
      loadFromJSON: vi.fn(),
      getObjects: vi.fn().mockReturnValue([]),
      toJSON: vi.fn().mockReturnValue({})
    }
  };
}

/**
 * Creates a mock history object for testing
 */
export function createMockHistory() {
  return {
    past: [],
    present: null,
    future: []
  };
}
