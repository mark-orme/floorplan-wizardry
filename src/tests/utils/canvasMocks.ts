
/**
 * Canvas mocks for testing
 * Provides mock implementations of Fabric.js objects and methods
 * @module canvasMocks
 */
import { vi } from 'vitest';
import type { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';

// Type for event callbacks in the mocked canvas
type EventCallback = (e: any) => void;

// Type for recording event handlers
interface EventHandlers {
  [eventName: string]: EventCallback[];
}

/**
 * Create a mock Fabric.js canvas for testing
 * @returns {object} Mock canvas object with test methods
 */
export const createMockCanvas = (): {
  canvas: Partial<FabricCanvas>;
  eventHandlers: EventHandlers;
  triggerEvent: (eventName: string, eventData: any) => void;
} => {
  // Record registered event handlers
  const eventHandlers: EventHandlers = {};
  
  // Create a basic mock of canvas methods
  const canvas: Partial<FabricCanvas> = {
    add: vi.fn(),
    remove: vi.fn(),
    clear: vi.fn(),
    getObjects: vi.fn().mockReturnValue([]),
    setActiveObject: vi.fn(),
    getActiveObject: vi.fn(),
    renderAll: vi.fn(),
    requestRenderAll: vi.fn(),
    getElement: vi.fn().mockReturnValue(document.createElement('canvas')),
    setZoom: vi.fn(),
    getZoom: vi.fn().mockReturnValue(1),
    zoomToPoint: vi.fn(),
    dispose: vi.fn(),
    setWidth: vi.fn(),
    setHeight: vi.fn(),
    
    // Event handling mocks
    on: vi.fn((eventName: string, handler: EventCallback) => {
      if (!eventHandlers[eventName]) {
        eventHandlers[eventName] = [];
      }
      eventHandlers[eventName].push(handler);
      return canvas; // For chaining
    }),
    
    off: vi.fn((eventName: string, handler?: EventCallback) => {
      if (eventName && handler && eventHandlers[eventName]) {
        const index = eventHandlers[eventName].indexOf(handler);
        if (index >= 0) {
          eventHandlers[eventName].splice(index, 1);
        }
      } else if (eventName && !handler) {
        // Remove all handlers for this event
        delete eventHandlers[eventName];
      }
      return canvas; // For chaining
    }),
    
    fire: vi.fn((eventName: string, eventData: any = {}) => {
      if (eventHandlers[eventName]) {
        eventHandlers[eventName].forEach(handler => handler(eventData));
      }
      return canvas; // For chaining
    })
  };
  
  // Drawing-related properties
  Object.defineProperties(canvas, {
    isDrawingMode: {
      get: vi.fn().mockReturnValue(false),
      set: vi.fn()
    },
    selection: {
      get: vi.fn().mockReturnValue(true),
      set: vi.fn()
    },
    width: {
      get: vi.fn().mockReturnValue(800),
      set: vi.fn()
    },
    height: {
      get: vi.fn().mockReturnValue(600),
      set: vi.fn()
    },
    freeDrawingBrush: {
      value: {
        width: 2,
        color: '#000000',
        decimate: 2
      },
      writable: true
    }
  });
  
  // Helper function to trigger events for testing
  const triggerEvent = (eventName: string, eventData: any) => {
    if (eventHandlers[eventName]) {
      eventHandlers[eventName].forEach(handler => handler(eventData));
    }
  };
  
  return {
    canvas,
    eventHandlers,
    triggerEvent
  };
};

/**
 * Create a mock Fabric.js object for testing
 * @param {string} type - Object type (e.g., 'line', 'path')
 * @param {object} props - Object properties
 * @returns {object} Mock Fabric.js object
 */
export const createMockFabricObject = (
  type: string,
  props: Record<string, any> = {}
): Partial<FabricObject> => {
  const properties: Record<string, any> = {
    type,
    selectable: true,
    evented: true,
    ...props
  };
  
  // Create a mock object with get/set methods
  return {
    get: vi.fn((prop: string) => properties[prop]),
    set: vi.fn((propOrObject: string | Record<string, any>, value?: any) => {
      if (typeof propOrObject === 'string') {
        properties[propOrObject] = value;
      } else {
        Object.assign(properties, propOrObject);
      }
    }),
    toObject: vi.fn(() => ({ ...properties })),
    ...properties
  };
};

/**
 * Create a mock browser pointer event for testing
 * @param {string} type - Event type (e.g., 'mousedown', 'touchstart')
 * @param {object} options - Event options
 * @returns {object} Mock pointer event
 */
export const createMockPointerEvent = (
  type: string, 
  options: Record<string, any> = {}
): any => {
  const isTouch = type.startsWith('touch');
  
  if (isTouch) {
    // Create mock touch event
    return {
      type,
      touches: [
        { 
          clientX: options.clientX || 100, 
          clientY: options.clientY || 100,
          force: options.force || 0
        }
      ],
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
      ...options
    };
  } else {
    // Create mock mouse event
    return {
      type,
      clientX: options.clientX || 100,
      clientY: options.clientY || 100,
      button: options.button || 0, // 0 = left button
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
      ...options
    };
  }
};
