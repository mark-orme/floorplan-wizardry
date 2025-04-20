
/**
 * Canvas mocks for testing
 */
import { vi } from 'vitest';

/**
 * Create a mock canvas with common methods
 * @returns Mock canvas object
 */
export const createMockCanvas = () => {
  return {
    add: vi.fn(),
    remove: vi.fn(),
    clear: vi.fn(),
    renderAll: vi.fn(),
    requestRenderAll: vi.fn(),
    setWidth: vi.fn(),
    setHeight: vi.fn(),
    getObjects: vi.fn().mockReturnValue([]),
    getContext: vi.fn(),
    getElement: vi.fn().mockReturnValue(document.createElement('canvas')),
    setBackgroundColor: vi.fn(),
    setZoom: vi.fn(),
    getZoom: vi.fn().mockReturnValue(1),
    on: vi.fn(),
    off: vi.fn(),
    fire: vi.fn(),
    getWidth: vi.fn().mockReturnValue(800),
    getHeight: vi.fn().mockReturnValue(600),
    dispose: vi.fn(),
    isDrawingMode: false,
    freeDrawingBrush: {
      color: '#000',
      width: 1
    },
    viewportTransform: [1, 0, 0, 1, 0, 0],
    selection: true
  };
};

/**
 * Create a mock history reference
 * @returns Mock history reference
 */
export const createMockHistoryRef = () => {
  return { 
    current: {
      undo: vi.fn(),
      redo: vi.fn(),
      canUndo: vi.fn().mockReturnValue(true),
      canRedo: vi.fn().mockReturnValue(true),
      push: vi.fn(),
      clear: vi.fn(),
      past: [],
      future: []
    }
  };
};

/**
 * Create a mock grid layer reference
 * @returns Mock grid layer reference
 */
export const createMockGridLayerRef = () => {
  return { current: [] };
};

/**
 * Setup Fabric mock for test
 */
export const setupFabricMock = () => {
  return {
    canvas: createMockCanvas(),
    historyRef: createMockHistoryRef(),
    gridLayerRef: createMockGridLayerRef()
  };
};

/**
 * Cast a canvas-like object to any canvas type for testing
 * @param canvas Canvas-like object
 * @returns Canvas with any type
 */
export const asTestCanvas = (canvas: any) => canvas as any;
