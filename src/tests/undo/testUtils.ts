
import { vi } from 'vitest';
import { Canvas } from 'fabric';

/**
 * Create a mock fabric canvas for testing
 */
export function createMockCanvas() {
  return {
    add: vi.fn(),
    remove: vi.fn(),
    clear: vi.fn(),
    getObjects: vi.fn().mockReturnValue([]),
    renderAll: vi.fn(),
    requestRenderAll: vi.fn(),
    on: vi.fn(),
    off: vi.fn(),
    discardActiveObject: vi.fn(),
    // For test compatibility
    getActiveObjects: vi.fn().mockReturnValue([]),
    withImplementation: vi.fn().mockImplementation(() => Promise.resolve()),
  } as unknown as Canvas;
}

/**
 * Create mock canvas reference
 */
export function createCanvasRef() {
  return {
    current: createMockCanvas()
  };
}

/**
 * Create mock grid layer reference
 */
export function createGridLayerRef() {
  return {
    current: []
  };
}
