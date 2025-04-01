
/**
 * Canvas testing utilities
 */
import { vi } from 'vitest';

/**
 * Create a mock canvas for testing
 */
export const createMockCanvas = () => {
  return {
    width: 800,
    height: 600,
    add: vi.fn(),
    remove: vi.fn(),
    getObjects: vi.fn().mockReturnValue([]),
    renderAll: vi.fn(),
    requestRenderAll: vi.fn(),
    getWidth: vi.fn().mockReturnValue(800),
    getHeight: vi.fn().mockReturnValue(600),
    getActiveObjects: vi.fn().mockReturnValue([]),
    discardActiveObject: vi.fn(),
    getActiveObject: vi.fn(),
    setActiveObject: vi.fn(),
    getZoom: vi.fn().mockReturnValue(1),
    setZoom: vi.fn(),
    sendObjectToBack: vi.fn(),
    on: vi.fn(),
    off: vi.fn(),
    contains: vi.fn().mockReturnValue(false),
    selection: true,
    freeDrawingBrush: {
      color: '#000000',
      width: 2
    },
    // Add required type compatibility props
    enablePointerEvents: true,
    _willAddMouseDown: false,
    _dropTarget: null,
    _isClick: false
  } as any;
};
