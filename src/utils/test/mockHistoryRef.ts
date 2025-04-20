
/**
 * Mock history reference for testing
 * @module utils/test/mockHistoryRef
 */
import { vi } from 'vitest';

/**
 * Create a mock history reference for testing
 * @returns Mock history reference object
 */
export const createMockHistoryRef = () => {
  return {
    current: {
      undo: vi.fn(),
      redo: vi.fn(),
      canUndo: vi.fn().mockReturnValue(true),
      canRedo: vi.fn().mockReturnValue(true),
      push: vi.fn(),
      clear: vi.fn()
    }
  };
};

/**
 * Create a mock grid layer reference for testing
 * @returns Mock grid layer reference object
 */
export const createMockGridLayerRef = () => {
  return { current: [] };
};
