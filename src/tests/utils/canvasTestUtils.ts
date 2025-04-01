
import { vi } from 'vitest';
import { Canvas, Object as FabricObject } from 'fabric';
import { FabricCanvas } from '@/types/fabric';

/**
 * Type for mock canvas objects
 */
export interface MockCanvasObject {
  type: string;
  id?: string;
  objectType?: string;
  [key: string]: any;
}

/**
 * Creates a properly typed mock Canvas object for tests
 */
export const createMockCanvas = (): FabricCanvas => {
  return {
    width: 800,
    height: 600,
    add: vi.fn(),
    remove: vi.fn(),
    getObjects: vi.fn().mockReturnValue([]),
    renderAll: vi.fn(),
    requestRenderAll: vi.fn(),
    contains: vi.fn().mockReturnValue(false),
    sendToBack: vi.fn(),
    on: vi.fn().mockReturnValue(() => {}),
    off: vi.fn(),
    dispose: vi.fn(),
    getActiveObjects: vi.fn().mockReturnValue([]),
    discardActiveObject: vi.fn(),
    sendObjectToBack: vi.fn(),
    bringObjectToFront: vi.fn(),
    isDrawingMode: false,
    freeDrawingBrush: {
      color: '#000000',
      width: 1
    },
    getPointer: vi.fn().mockReturnValue({ x: 0, y: 0 }),
    getZoom: vi.fn().mockReturnValue(1),
    setZoom: vi.fn(),
    setViewportTransform: vi.fn(),
    viewportTransform: [1, 0, 0, 1, 0, 0],
    setDimensions: vi.fn(),
    moveTo: vi.fn(),
    clone: vi.fn()
  } as unknown as FabricCanvas;
};

/**
 * Creates a mock object for the canvas
 * @param type Object type ('line', 'rect', etc.)
 * @param props Additional properties
 */
export const createMockObject = (type: string, props: MockCanvasObject = {}): FabricObject => {
  return {
    type,
    ...props,
    set: vi.fn(),
    setCoords: vi.fn(),
    toObject: vi.fn().mockReturnValue({}),
    getBoundingRect: vi.fn().mockReturnValue({ left: 0, top: 0, width: 100, height: 100 })
  } as unknown as FabricObject;
};

/**
 * Creates a mock canvas event object
 * @param target Target object
 * @param pointer Pointer coordinates
 */
export const createMockEvent = (target?: any, pointer = { x: 100, y: 100 }) => {
  return {
    target,
    pointer,
    e: {
      stopPropagation: vi.fn(),
      preventDefault: vi.fn()
    }
  };
};
