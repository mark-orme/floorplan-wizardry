
import { vi } from 'vitest';

/**
 * Create a mock canvas for testing
 * @returns Mock canvas object
 */
export const createMockCanvas = () => {
  return {
    add: vi.fn(),
    remove: vi.fn(),
    getObjects: vi.fn().mockReturnValue([]),
    renderAll: vi.fn(),
    requestRenderAll: vi.fn(),
    clear: vi.fn(),
    contains: vi.fn().mockReturnValue(false),
    sendToBack: vi.fn(),
    sendObjectToBack: vi.fn(),
    getZoom: vi.fn().mockReturnValue(1),
    setZoom: vi.fn(),
    fire: vi.fn(),
    on: vi.fn(),
    off: vi.fn(),
    dispose: vi.fn(),
    getActiveObject: vi.fn(),
    getActiveObjects: vi.fn().mockReturnValue([]),
    discardActiveObject: vi.fn(),
    getPointer: vi.fn().mockReturnValue({ x: 0, y: 0 }),
    forEachObject: vi.fn((callback) => {
      callback({ selectable: true });
    }),
    isDrawingMode: false,
    selection: true
  };
};

/**
 * Create a mock fabric object for testing
 * @param type Object type
 * @param props Additional properties
 * @returns Mock fabric object
 */
export const createMockObject = (type: string, props: Record<string, any> = {}) => {
  return {
    type,
    selectable: true,
    evented: true,
    set: vi.fn(),
    setCoords: vi.fn(),
    ...props
  };
};

/**
 * MockCanvas type for testing
 */
export interface MockCanvas {
  on: ReturnType<typeof vi.fn>;
  off: ReturnType<typeof vi.fn>;
  add: ReturnType<typeof vi.fn>;
  remove: ReturnType<typeof vi.fn>;
  getObjects: ReturnType<typeof vi.fn>;
  dispose: ReturnType<typeof vi.fn>;
  renderAll: ReturnType<typeof vi.fn>;
  requestRenderAll: ReturnType<typeof vi.fn>;
  getPointer: ReturnType<typeof vi.fn>;
  isDrawingMode: boolean;
  selection: boolean;
}

/**
 * Return the mock canvas with proper typing
 */
export { createMockCanvas as MockCanvas };

/**
 * Helper function to create a mock withImplementation function
 */
export const createWithImplementationMock = () => {
  return vi.fn().mockImplementation((callback?: Function) => {
    if (callback) callback();
    return Promise.resolve();
  });
};

/**
 * Helper to convert Jest mock functions to Vitest mock functions
 * This helps with migrating tests
 */
export const jestToVitest = {
  fn: vi.fn,
  mock: vi.mock,
  spyOn: vi.spyOn,
  mockImplementation: vi.fn().mockImplementation,
  runAllTimers: () => vi.runAllTimers(),
  mocked: vi.mocked
};
