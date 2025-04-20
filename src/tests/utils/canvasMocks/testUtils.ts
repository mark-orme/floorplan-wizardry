
import { vi } from 'vitest';

/**
 * Creates canvas testing utilities for unit tests
 * @returns Canvas test utilities
 */
export function createCanvasTestUtils() {
  return {
    triggerCanvasEvent: vi.fn()
  };
}
