
import { vi } from 'vitest';
import { createWithImplementationMock } from '@/utils/canvasMockUtils';

/**
 * Creates a mock setup for Fabric.js
 * @returns Mocked fabric module
 */
export function setupFabricMock() {
  const MockCanvas = vi.fn().mockImplementation(() => ({
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
    // Standardized implementation that correctly returns Promise<void>
    withImplementation: createWithImplementationMock()
  }));

  return {
    Canvas: MockCanvas,
    Line: vi.fn().mockImplementation(() => ({
      set: vi.fn(),
      setCoords: vi.fn(),
      toObject: vi.fn().mockReturnValue({})
    })),
    Rect: vi.fn().mockImplementation(() => ({
      set: vi.fn(),
      setCoords: vi.fn(),
      toObject: vi.fn().mockReturnValue({})
    })),
    Circle: vi.fn().mockImplementation(() => ({
      set: vi.fn(),
      setCoords: vi.fn(),
      toObject: vi.fn().mockReturnValue({})
    }))
  };
}

// Re-export other functions
export { createMockGridLayerRef } from './canvasMocks/gridLayerRef';
export { createMockHistoryRef } from './canvasMocks/historyRef';
export { createCanvasTestUtils } from './canvasMocks/testUtils';
