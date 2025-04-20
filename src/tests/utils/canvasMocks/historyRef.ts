
import { vi } from 'vitest';

/**
 * Creates a mock history reference object for testing
 * @returns Mock history reference
 */
export function createMockHistoryRef() {
  return {
    current: {
      undo: vi.fn(),
      redo: vi.fn(),
      canUndo: vi.fn().mockReturnValue(true),
      canRedo: vi.fn().mockReturnValue(false),
      pushState: vi.fn(),
      clearHistory: vi.fn()
    }
  };
}
