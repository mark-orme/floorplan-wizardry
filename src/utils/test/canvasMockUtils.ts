
import { vi } from 'vitest';
import type { Canvas as FabricCanvas } from 'fabric';

/**
 * Create a comprehensive mock canvas for testing
 */
export function createMockCanvas() {
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
    sendToBack: vi.fn(),
    getPointer: vi.fn().mockReturnValue({ x: 100, y: 100 }),
    setViewportTransform: vi.fn(),
    zoomToPoint: vi.fn(),
    setZoom: vi.fn(),
    getZoom: vi.fn().mockReturnValue(1),
    isDrawingMode: false,
    selection: true,
    getWidth: vi.fn().mockReturnValue(800),
    getHeight: vi.fn().mockReturnValue(600),
    setWidth: vi.fn(),
    setHeight: vi.fn(),
    getElement: vi.fn().mockReturnValue(document.createElement('canvas')),
    setBackgroundColor: vi.fn(),
    dispose: vi.fn(),
    fire: vi.fn(),
    freeDrawingBrush: {
      color: '#000000',
      width: 2
    },
    viewportTransform: [1, 0, 0, 1, 0, 0],
    wrapperEl: document.createElement('div'),
    forEachObject: vi.fn((callback) => callback({
      selectable: true,
      evented: true
    })),
    // Add withImplementation for canvas.withImplementation calls
    withImplementation: vi.fn().mockImplementation((callback?: Function) => {
      if (callback) callback();
      return Promise.resolve();
    })
  } as unknown as FabricCanvas;
}

/**
 * Create a mock canvas reference
 */
export function createMockCanvasRef() {
  return {
    current: createMockCanvas()
  };
}

/**
 * Create a mock fabric object
 */
export function createMockFabricObject(type = 'object', props = {}) {
  return {
    type,
    selectable: true,
    evented: true,
    visible: true,
    set: vi.fn(),
    setCoords: vi.fn(),
    ...props
  };
}

/**
 * Helper for creating a withImplementation mock that properly returns Promise<void>
 */
export function createWithImplementationMock() {
  return vi.fn().mockImplementation((callback?: Function) => {
    if (callback) {
      try {
        callback();
      } catch (e) {
        console.error(e);
      }
    }
    return Promise.resolve();
  });
}
