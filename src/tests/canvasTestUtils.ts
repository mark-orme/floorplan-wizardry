
/**
 * Canvas test utilities
 * Provides helper functions for testing canvas components
 */

import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';

/**
 * Create a test fabric canvas instance for testing
 */
export const createTestFabricCanvas = () => {
  // Create a mock canvas with common methods
  const mockCanvas = {
    add: jest.fn(),
    remove: jest.fn(),
    renderAll: jest.fn(),
    requestRenderAll: jest.fn(),
    getObjects: jest.fn().mockReturnValue([]),
    clear: jest.fn(),
    on: jest.fn(),
    off: jest.fn(),
    setWidth: jest.fn(),
    setHeight: jest.fn(),
    getWidth: jest.fn().mockReturnValue(800),
    getHeight: jest.fn().mockReturnValue(600),
    getElement: jest.fn().mockReturnValue(document.createElement('canvas')),
    dispose: jest.fn(),
    setBackgroundColor: jest.fn(),
    isDrawingMode: false,
    selection: true,
    defaultCursor: 'default',
    hoverCursor: 'move',
    freeDrawingBrush: {
      width: 1,
      color: '#000000'
    },
    setZoom: jest.fn(),
    getZoom: jest.fn().mockReturnValue(1),
    absolutePan: jest.fn(),
    viewportTransform: [1, 0, 0, 1, 0, 0],
    calcOffset: jest.fn(),
    calcViewportBoundaries: jest.fn().mockReturnValue({
      tl: { x: 0, y: 0 },
      br: { x: 800, y: 600 }
    }),
    getCenter: jest.fn().mockReturnValue({ left: 400, top: 300 }),
    setViewportTransform: jest.fn(),
    zoomToPoint: jest.fn(),
    getActiveObject: jest.fn(),
    getActiveObjects: jest.fn().mockReturnValue([]),
    discardActiveObject: jest.fn(),
    sendObjectToBack: jest.fn(),
    sendObjectBackwards: jest.fn(),
    bringObjectForward: jest.fn(),
    bringObjectToFront: jest.fn(),
    contains: jest.fn().mockReturnValue(true),
    getPointer: jest.fn().mockReturnValue({ x: 0, y: 0 })
  };

  return mockCanvas as unknown as FabricCanvas;
};

/**
 * Create a mock fabric object for testing
 */
export const createMockFabricObject = (options = {}) => {
  return {
    type: 'object',
    visible: true,
    selectable: true,
    evented: true,
    set: jest.fn(),
    get: jest.fn(),
    setCoords: jest.fn(),
    toObject: jest.fn(),
    ...options
  } as unknown as FabricObject;
};

/**
 * Create a mock canvas event for testing
 */
export const createMockCanvasEvent = (options = {}) => {
  return {
    e: {
      preventDefault: jest.fn(),
      stopPropagation: jest.fn(),
      clientX: 100,
      clientY: 100
    },
    pointer: { x: 100, y: 100 },
    target: null,
    ...options
  };
};
