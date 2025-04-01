
/**
 * Canvas testing utilities
 * Provides functions for creating mock canvas objects and test helpers
 */
import { Canvas, Object as FabricObject } from 'fabric';
import { vi } from 'vitest';

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
 * Create a mock fabric canvas for testing
 * @returns Mock canvas object
 */
export const createMockCanvas = () => {
  return {
    add: vi.fn(),
    remove: vi.fn(),
    getObjects: vi.fn().mockReturnValue([]),
    renderAll: vi.fn(),
    requestRenderAll: vi.fn(),
    setActiveObject: vi.fn(),
    discardActiveObject: vi.fn(),
    getActiveObject: vi.fn(),
    getActiveObjects: vi.fn().mockReturnValue([]),
    on: vi.fn(),
    off: vi.fn(),
    fire: vi.fn(),
    setViewportTransform: vi.fn(),
    setZoom: vi.fn(),
    getZoom: vi.fn().mockReturnValue(1),
    zoomToPoint: vi.fn(),
    setWidth: vi.fn(),
    setHeight: vi.fn(),
    getWidth: vi.fn().mockReturnValue(800),
    getHeight: vi.fn().mockReturnValue(600),
    dispose: vi.fn(),
    getPointer: vi.fn().mockReturnValue({ x: 100, y: 100 }),
    contains: vi.fn().mockReturnValue(false),
    toDataURL: vi.fn().mockReturnValue('data:image/png;base64,mockdata'),
    isDrawingMode: false,
    width: 800,
    height: 600,
    selection: true
  };
};

/**
 * Create a mock canvas object for testing
 * @param type Object type
 * @param props Additional properties
 * @returns Mock fabric object
 */
export const createMockObject = (type: string, props: Partial<MockCanvasObject> = {}): MockCanvasObject => {
  return {
    type,
    id: `mock-${type}-${Math.random().toString(36).substr(2, 9)}`,
    selectable: true,
    evented: true,
    visible: true,
    ...props
  };
};

/**
 * Create a mock event object for testing
 * @param type Event type
 * @param data Event data
 * @returns Mock event object
 */
export const createMockEvent = (type: string, data: any = {}) => {
  return {
    type,
    target: null,
    ...data
  };
};
