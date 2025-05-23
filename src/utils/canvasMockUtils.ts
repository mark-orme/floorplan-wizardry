
/**
 * Canvas Mock Utilities
 * Provides utilities for mocking canvas objects in tests
 * @module utils/canvasMockUtils
 */
import { Canvas as FabricCanvas } from 'fabric';
import { vi } from 'vitest';
import { MockCanvas } from './test/createMockCanvas';

/**
 * Create a proper withImplementation mock function
 * @returns Mock function that returns a Promise<void>
 */
function createProperWithImplementationMock() {
  return vi.fn().mockImplementation((callback?: Function): Promise<void> => {
    if (callback && typeof callback === 'function') {
      try {
        const result = callback();
        if (result instanceof Promise) {
          return result.then(() => Promise.resolve());
        }
      } catch (error) {
        console.error('Error in mock withImplementation:', error);
      }
    }
    return Promise.resolve();
  });
}

/**
 * Create a typed mock canvas for testing
 * @returns A mock canvas object with common methods stubbed
 */
export function createTypedMockCanvas(): MockCanvas {
  return {
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
    withImplementation: createProperWithImplementationMock(),
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
    // Additional Canvas properties
    enablePointerEvents: true,
    _willAddMouseDown: false,
    _dropTarget: null,
    _isClick: false,
    _objects: [],
    getHandlers: vi.fn().mockReturnValue([() => {}]),
    triggerEvent: vi.fn()
  } as MockCanvas;
}

/**
 * Create a mock implementation of withImplementation
 * @returns A mock implementation that returns a Promise<void>
 */
export function createWithImplementationMock() {
  return createProperWithImplementationMock();
}

/**
 * Create a mock history ref for drawing history tests
 * @returns A mock history ref object
 */
export function createMockHistoryRef() {
  return {
    current: {
      states: [],
      currentIndex: -1,
      maxStates: 10,
      canUndo: false,
      canRedo: false
    }
  };
}

/**
 * Type-safe assertion function to use in tests
 * @param canvas Any canvas-like object
 * @returns Canvas with added mock methods
 */
export function assertMockCanvas(canvas: Partial<MockCanvas>): MockCanvas {
  // Ensure we have a compatible mock canvas
  const mockCanvas: MockCanvas = canvas as MockCanvas;
  return mockCanvas;
}

/**
 * Create a fixed mock canvas that properly implements all required interfaces
 * Resolves TypeScript compatibility issues between Canvas and MockCanvas
 * @returns A canvas object that's safe to use in tests 
 */
export function createFixedMockCanvas(): MockCanvas {
  const mockCanvas = createTypedMockCanvas();
  return mockCanvas;
}
