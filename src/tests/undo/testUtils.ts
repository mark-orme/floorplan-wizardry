
import { vi } from 'vitest';
import { Canvas as FabricCanvas } from 'fabric';

/**
 * Create a mock canvas reference for testing
 * @returns A mock canvas ref that can be used in tests
 */
export function createCanvasRef() {
  return {
    current: {
      getObjects: vi.fn().mockReturnValue([]),
      clear: vi.fn(),
      add: vi.fn(),
      renderAll: vi.fn(),
      discardActiveObject: vi.fn(),
      remove: vi.fn()
    }
  };
}

/**
 * Create a mock history reference for testing
 * @returns A mock history ref with past and future arrays
 */
export function createHistoryRef() {
  return {
    current: {
      past: [],
      future: []
    }
  };
}

/**
 * Create a mock object
 * @param id Object identifier
 * @returns A mock object with common properties
 */
export function createMockObject(id: string) {
  return {
    id,
    type: 'mock',
    toObject: () => ({ id, type: 'mock' })
  };
}
