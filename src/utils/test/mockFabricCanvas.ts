
/**
 * Mock Fabric Canvas utilities for testing
 * @module utils/test/mockFabricCanvas
 */
import { Canvas, Object as FabricObject } from 'fabric';
import { vi } from 'vitest';
import { FabricEventTypes } from '@/types/fabric-events';

/**
 * Create a mock Fabric canvas for testing
 * @returns Mocked Fabric canvas instance
 */
export const createMockCanvas = (): Canvas => {
  // Using string type for event names to avoid the type errors
  const eventHandlers = new Map<string, Array<Function>>();
  
  return {
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
      return this;
    }),
    off: vi.fn((eventName: string, handler: Function) => {
      if (eventHandlers.has(eventName)) {
        const handlers = eventHandlers.get(eventName)!;
        const index = handlers.indexOf(handler);
        if (index !== -1) {
          handlers.splice(index, 1);
        }
      }
      return this;
    }),
    fire: vi.fn(),
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
    // Store eventHandlers in a way that's accessible for testing
    __eventHandlers: eventHandlers
  } as unknown as Canvas;
};

/**
 * Create a mock Fabric object for testing
 * @param type - Object type
 * @param props - Object properties
 * @returns Mocked Fabric object
 */
export const createMockObject = (type: string, props: Record<string, any> = {}): FabricObject => {
  return {
    type,
    set: vi.fn(),
    setCoords: vi.fn(),
    get: vi.fn((prop) => props[prop]),
    ...props
  } as unknown as FabricObject;
};

/**
 * Mock for canvas reference in React components
 * @returns React ref with mock canvas
 */
export const createMockCanvasRef = () => ({
  current: createMockCanvas()
});

/**
 * Mock for grid layer reference in React components
 * @returns React ref with mock grid objects
 */
export const createMockGridLayerRef = () => ({
  current: []
});

/**
 * Create a mock history reference for testing undo/redo
 * @returns React ref with mock history state
 */
export const createMockHistoryRef = () => ({
  current: {
    past: [],
    future: []
  }
});

/**
 * Extract an event handler from a mock Fabric canvas
 * @param canvas - The mock canvas
 * @param eventName - The event name to extract handler for
 * @returns The handler function if found
 */
export const extractFabricEventHandler = (
  canvas: Canvas, 
  eventName: string
): Function | undefined => {
  // Type assertion to access the mocked event handlers
  const mockCanvas = canvas as unknown as { 
    __eventHandlers?: Map<string, Function[]>;
  };
  
  // First try to get from the __eventHandlers map (if using that pattern)
  if (mockCanvas.__eventHandlers) {
    return mockCanvas.__eventHandlers.get(eventName)?.[0];
  }
  
  return undefined;
};

