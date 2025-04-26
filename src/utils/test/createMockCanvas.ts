
/**
 * Create a typed mock canvas for tests
 * Provides a properly typed mock canvas object for unit tests
 * @module utils/test/createMockCanvas
 */
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';
import { vi } from 'vitest';

export interface IMockCanvasObject {
  getHandlers: (eventName: string) => Function[];
  triggerEvent: (eventName: string, eventData: any) => void;
  withImplementation: (callback?: Function) => Promise<void>;
}

export type MockCanvas = FabricCanvas & IMockCanvasObject;

/**
 * Creates a fully compatible mock canvas for testing
 * Ensures return types match what is expected by fabric
 * @returns Type-compatible mock canvas
 */
export function createTestMockCanvas(): MockCanvas {
  // Create a mock withImplementation function
  const withImplementation = vi.fn().mockImplementation((callback?: Function): Promise<void> => {
    if (callback && typeof callback === 'function') {
      try {
        const result = callback();
        if (result instanceof Promise) {
          return result.then(() => Promise.resolve());
        }
      } catch (error) {
        console.error('Error in withImplementation mock:', error);
      }
    }
    return Promise.resolve();
  });

  // Create a base canvas mock object
  const mockCanvas = {
    on: vi.fn(),
    off: vi.fn(),
    add: vi.fn(),
    remove: vi.fn(),
    getObjects: vi.fn().mockReturnValue([]),
    renderAll: vi.fn(),
    requestRenderAll: vi.fn(),
    getActiveObjects: vi.fn().mockReturnValue([]),
    discardActiveObject: vi.fn(),
    contains: vi.fn().mockReturnValue(false),
    withImplementation,
    isDrawingMode: false,
    selection: true,
    defaultCursor: 'default',
    hoverCursor: 'move',
    freeDrawingBrush: {
      color: '#000000',
      width: 1
    },
    getPointer: vi.fn().mockReturnValue({ x: 0, y: 0 }),
    getElement: vi.fn().mockReturnValue({}),
    loadFromJSON: vi.fn(),
    toJSON: vi.fn().mockReturnValue({}),
    getWidth: vi.fn().mockReturnValue(800),
    getHeight: vi.fn().mockReturnValue(600),
    setWidth: vi.fn(),
    setHeight: vi.fn(),
    item: vi.fn(),
    setZoom: vi.fn(),
    getZoom: vi.fn().mockReturnValue(1),
    sendObjectToBack: vi.fn(),
    sendToBack: vi.fn(),
    fire: vi.fn(),
    dispose: vi.fn(),
    // Additional Canvas properties for compatibility
    _willAddMouseDown: false,
    _dropTarget: null,
    _isClick: false,
    _objects: [],
    getHandlers: vi.fn().mockReturnValue([() => {}]),
    triggerEvent: vi.fn()
  } as unknown as MockCanvas;

  return mockCanvas;
}

/**
 * Creates a typed mock canvas - alias for createTestMockCanvas to maintain API
 * @returns Type-compatible mock canvas
 */
export function createTypedMockCanvas(): MockCanvas {
  return createTestMockCanvas();
}

/**
 * Create a mock with fixed type issues
 * This is compatible with test expectations
 * @returns Type-compatible mock canvas
 */
export function createFixedMockCanvas(): MockCanvas {
  return createTestMockCanvas();
}
