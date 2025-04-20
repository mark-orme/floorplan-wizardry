
/**
 * Canvas mock utilities for testing
 * @module utils/canvasMockUtils
 */
import { vi } from 'vitest';

/**
 * Create a typed mock canvas for testing
 * @returns Mock canvas object
 */
export const createTypedMockCanvas = () => {
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
 * Create a mock canvas with 'withImplementation' method
 * @returns Mock canvas with withImplementation
 */
export const createWithImplementationMock = () => {
  const mock = createTypedMockCanvas();
  
  return {
    ...mock,
    withImplementation: vi.fn().mockImplementation((callback) => {
      callback(mock);
      return Promise.resolve(mock);
    })
  };
};

/**
 * Setup a Fabric mock for use in testing
 * @returns Mock fabric object
 */
export const setupFabricMock = () => {
  return {
    Canvas: vi.fn().mockImplementation(() => createTypedMockCanvas()),
    IText: vi.fn().mockImplementation(() => ({})),
    Line: vi.fn().mockImplementation(() => ({})),
    Object: vi.fn().mockImplementation(() => ({})),
    Point: vi.fn().mockImplementation((x, y) => ({ x, y }))
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
 * Create a mock fabric canvas reference
 * @returns Mock fabric canvas reference
 */
export const createMockFabricCanvasRef = () => {
  return { current: createTypedMockCanvas() };
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
      clear: vi.fn()
    }
  };
};

/**
 * Create a typed mock object for Fabric.js
 * @returns Mock object
 */
export const createMockFabricObject = () => {
  return {
    set: vi.fn(),
    setCoords: vi.fn(),
    get: vi.fn(),
    on: vi.fn(),
    off: vi.fn(),
    remove: vi.fn()
  };
};

/**
 * Cast a canvas-like object to a proper Canvas type
 * This is safe for tests, but should not be used in production code
 * @param canvas Canvas-like object
 * @returns Canvas type
 */
export const castAsCanvas = (canvas: any) => {
  return canvas as any;
};
