
/**
 * Utility functions for testing with Fabric.js
 * Provides properly typed mocks and helper functions
 */
import { vi } from 'vitest';
import { Canvas, Object as FabricObject, Line, Point } from 'fabric';
import { FabricEventNames } from '@/types/fabric-events';

/**
 * Create a mock Canvas instance
 * @returns A mocked Fabric Canvas with type-safe methods
 */
export const createMockCanvas = (): Canvas => {
  const eventHandlers = new Map<string, Array<Function>>();
  
  const canvas = {
    add: vi.fn(),
    remove: vi.fn(),
    contains: vi.fn().mockReturnValue(true),
    getObjects: vi.fn().mockReturnValue([]),
    setActiveObject: vi.fn(),
    getActiveObject: vi.fn(),
    renderAll: vi.fn(),
    requestRenderAll: vi.fn(),
    getZoom: vi.fn().mockReturnValue(1),
    setZoom: vi.fn(),
    on: vi.fn((eventName: string, handler: Function) => {
      if (!eventHandlers.has(eventName)) {
        eventHandlers.set(eventName, []);
      }
      eventHandlers.get(eventName)!.push(handler);
      return canvas;
    }),
    off: vi.fn((eventName: string, handler?: Function) => {
      if (eventHandlers.has(eventName)) {
        if (handler) {
          const handlers = eventHandlers.get(eventName)!;
          const index = handlers.indexOf(handler);
          if (index !== -1) {
            handlers.splice(index, 1);
          }
        } else {
          eventHandlers.delete(eventName);
        }
      }
      return canvas;
    }),
    fire: vi.fn((eventName: string, options?: any) => {
      if (eventHandlers.has(eventName)) {
        eventHandlers.get(eventName)!.forEach(handler => handler(options));
      }
      return canvas;
    }),
    getWidth: vi.fn().mockReturnValue(800),
    getHeight: vi.fn().mockReturnValue(600),
    dispose: vi.fn(),
    clear: vi.fn(),
    isDrawingMode: false,
    freeDrawingBrush: {
      color: '#000000',
      width: 1
    },
    viewportTransform: [1, 0, 0, 1, 0, 0],
    setViewportTransform: vi.fn(),
    width: 800,
    height: 600,
    _objects: [],
    discardActiveObject: vi.fn(),
    getPointer: vi.fn().mockReturnValue({ x: 100, y: 100 }),
    selection: true,
    defaultCursor: 'default',
    hoverCursor: 'default',
    // Store eventHandlers for testing
    __eventHandlers: eventHandlers
  } as unknown as Canvas;
  
  return canvas;
};

/**
 * Create a mock Fabric object
 * @param type Object type identifier
 * @param props Additional properties
 * @returns A mocked Fabric object
 */
export const createMockObject = (type: string, props: Record<string, any> = {}): FabricObject => {
  return {
    type,
    set: vi.fn(),
    setCoords: vi.fn(),
    get: vi.fn((prop) => props[prop]),
    toObject: vi.fn(() => ({ type, ...props })),
    ...props
  } as unknown as FabricObject;
};

/**
 * Create a mock Line object
 * @param points Line coordinates [x1, y1, x2, y2]
 * @param props Additional properties
 * @returns A mocked Fabric Line
 */
export const createMockLine = (points: number[] = [0, 0, 100, 100], props: Record<string, any> = {}): Line => {
  return {
    type: 'line',
    x1: points[0],
    y1: points[1],
    x2: points[2],
    y2: points[3],
    set: vi.fn(),
    setCoords: vi.fn(),
    get: vi.fn((prop) => {
      if (prop === 'x1') return points[0];
      if (prop === 'y1') return points[1];
      if (prop === 'x2') return points[2];
      if (prop === 'y2') return points[3];
      return props[prop];
    }),
    toObject: vi.fn(() => ({ type: 'line', x1: points[0], y1: points[1], x2: points[2], y2: points[3], ...props })),
    ...props
  } as unknown as Line;
};

/**
 * Create a mock Point object
 * @param x X coordinate
 * @param y Y coordinate
 * @returns A mocked Fabric Point
 */
export const createMockPoint = (x: number, y: number): Point => {
  return {
    x,
    y,
    add: vi.fn((point: Point) => createMockPoint(x + point.x, y + point.y)),
    subtract: vi.fn((point: Point) => createMockPoint(x - point.x, y - point.y)),
    multiply: vi.fn((scalar: number) => createMockPoint(x * scalar, y * scalar)),
    divide: vi.fn((scalar: number) => createMockPoint(x / scalar, y / scalar)),
    eq: vi.fn((point: Point) => x === point.x && y === point.y),
    lt: vi.fn((point: Point) => x < point.x && y < point.y),
    gt: vi.fn((point: Point) => x > point.x && y > point.y),
    distanceFrom: vi.fn((point: Point) => Math.sqrt(Math.pow(x - point.x, 2) + Math.pow(y - point.y, 2))),
    midPointFrom: vi.fn((point: Point) => createMockPoint((x + point.x) / 2, (y + point.y) / 2))
  } as unknown as Point;
};

/**
 * Create mock mouse event for testing
 * @param x The x coordinate
 * @param y The y coordinate
 * @returns A mock event object
 */
export const createMockMouseEvent = (x: number, y: number) => {
  return {
    e: {
      clientX: x,
      clientY: y,
      preventDefault: vi.fn(),
      stopPropagation: vi.fn()
    },
    pointer: { x, y },
    target: null
  };
};

/**
 * Create a mock fabric event handler
 * @param eventName The name of the event
 * @returns A mock handler function
 */
export const createMockFabricEventHandler = (eventName: keyof typeof FabricEventNames) => {
  return vi.fn((e: any) => {
    console.log(`Mock handler for ${eventName} called with:`, e);
    return { handled: true, eventName };
  });
};
