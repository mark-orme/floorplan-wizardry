
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
