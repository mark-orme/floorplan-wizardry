import { vi } from 'vitest';
import { Canvas, Object as FabricObject } from 'fabric';
import { FixMe } from '@/types/typesMap';

/**
 * Creates a fully typed mock canvas for tests
 * This addresses the issues with test files expecting certain Canvas properties
 * @returns A mock canvas instance with all required properties
 */
export function createCompleteMockCanvas(): Canvas {
  const eventHandlers: Record<string, Function[]> = {};
  
  const canvas = {
    // Basic Canvas methods
    add: vi.fn(),
    remove: vi.fn(),
    renderAll: vi.fn(),
    requestRenderAll: vi.fn(),
    clear: vi.fn(),
    dispose: vi.fn(),
    
    // Element properties
    wrapperEl: document.createElement('div'),
    lowerCanvasEl: document.createElement('canvas'),
    upperCanvasEl: document.createElement('canvas'),
    
    // Object management
    getObjects: vi.fn().mockReturnValue([]),
    item: vi.fn(),
    forEachObject: vi.fn().mockImplementation((callback) => {
      if (typeof callback === 'function') {
        callback({ selectable: true });
      }
    }),
    
    // Dimensions
    getWidth: vi.fn().mockReturnValue(800),
    getHeight: vi.fn().mockReturnValue(600),
    setWidth: vi.fn(),
    setHeight: vi.fn(),
    setDimensions: vi.fn(),
    
    // Events
    on: vi.fn((eventName, handler) => {
      if (!eventHandlers[eventName]) {
        eventHandlers[eventName] = [];
      }
      eventHandlers[eventName].push(handler);
      return canvas;
    }),
    off: vi.fn((eventName, handler) => {
      if (eventHandlers[eventName]) {
        if (handler) {
          const index = eventHandlers[eventName].indexOf(handler);
          if (index !== -1) {
            eventHandlers[eventName].splice(index, 1);
          }
        } else {
          delete eventHandlers[eventName];
        }
      }
      return canvas;
    }),
    fire: vi.fn((eventName, options = {}) => {
      if (eventHandlers[eventName]) {
        eventHandlers[eventName].forEach(handler => handler(options));
      }
      return canvas;
    }),
    
    // Selection
    getActiveObject: vi.fn(),
    getActiveObjects: vi.fn().mockReturnValue([]),
    discardActiveObject: vi.fn(),
    setActiveObject: vi.fn(),
    
    // View
    getPointer: vi.fn().mockReturnValue({ x: 0, y: 0 }),
    viewportTransform: [1, 0, 0, 1, 0, 0],
    setViewportTransform: vi.fn(),
    zoomToPoint: vi.fn(),
    setZoom: vi.fn(),
    getZoom: vi.fn().mockReturnValue(1),
    
    // State
    isDrawingMode: false,
    selection: true,
    defaultCursor: 'default',
    hoverCursor: 'move',
    freeDrawingBrush: {
      color: '#000000',
      width: 1
    },
    backgroundColor: '#ffffff',
    
    // JSON
    loadFromJSON: vi.fn(),
    toJSON: vi.fn().mockReturnValue({}),
    toObject: vi.fn().mockReturnValue({}),
    
    // Other
    sendToBack: vi.fn(),
    bringToFront: vi.fn(),
    contains: vi.fn().mockReturnValue(false),
    
    // Advanced mock methods for testing
    getHandlers: (eventName: string) => eventHandlers[eventName] || [],
    triggerEvent: (eventName: string, data: any) => {
      if (eventHandlers[eventName]) {
        eventHandlers[eventName].forEach(handler => handler(data));
      }
    },
    
    // Fabric v6 compatibility method mock
    withImplementation: vi.fn().mockImplementation((callback?: Function) => {
      if (callback && typeof callback === 'function') {
        try {
          callback();
        } catch (e) {
          console.error('Error in withImplementation mock:', e);
        }
      }
      return Promise.resolve();
    })
  } as unknown as Canvas;
  
  return canvas;
}

/**
 * Create a ref for a mock canvas
 */
export function createMockCanvasRef() {
  return {
    current: createCompleteMockCanvas()
  };
}

/**
 * Helper to create a fabric object mock
 */
export function createMockFabricObject(type = 'object'): FabricObject {
  return {
    type,
    visible: true,
    selectable: true,
    evented: true,
    set: vi.fn().mockReturnThis(),
    setCoords: vi.fn().mockReturnThis(),
    get: vi.fn((prop) => {
      if (prop === 'type') return type;
      if (prop === 'left') return 0;
      if (prop === 'top') return 0;
      return undefined;
    }),
    toObject: vi.fn().mockReturnValue({}),
  } as unknown as FabricObject;
}

export type MockCanvas = ReturnType<typeof createCompleteMockCanvas>;
