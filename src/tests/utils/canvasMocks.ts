
/**
 * Canvas mocks for testing
 * Provides mock canvas objects for test use
 * @module tests/utils/canvasMocks
 */
import { createTypedMockCanvas, createWithImplementationMock } from '@/utils/canvasMockUtils';
import { vi } from 'vitest';

/**
 * Create a mock canvas for testing
 * @returns Mock canvas object
 */
export const createMockCanvas = () => {
  return createTypedMockCanvas();
};

/**
 * Create a mock canvas with withImplementation method for testing
 * @returns Mock canvas object with withImplementation
 */
export const createMockCanvasWithImplementation = () => {
  return createWithImplementationMock();
};

/**
 * Create a mock canvas event for testing
 * @param x X coordinate
 * @param y Y coordinate
 * @returns Mock event object
 */
export const createMockCanvasEvent = (x = 0, y = 0) => {
  return {
    e: {
      clientX: x,
      clientY: y,
      preventDefault: vi.fn(),
      stopPropagation: vi.fn()
    },
    pointer: { x, y },
    target: null,
    button: 1
  };
};

/**
 * Create a mock canvas pointer event for testing
 * @param x X coordinate
 * @param y Y coordinate
 * @returns Mock pointer event
 */
export const createMockPointerEvent = (x = 0, y = 0) => {
  return {
    clientX: x,
    clientY: y,
    preventDefault: vi.fn(),
    stopPropagation: vi.fn(),
    type: 'pointerdown',
    pointerType: 'mouse',
    pressure: 1.0
  };
};
