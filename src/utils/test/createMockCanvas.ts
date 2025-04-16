
/**
 * Factory for creating consistent mock canvas objects for testing
 * @module utils/test/createMockCanvas
 */
import { Canvas, Object as FabricObject } from 'fabric';
import { vi } from 'vitest';
import { IMockCanvas } from '@/types/test/MockTypes.d';
import { asMockCanvas } from '@/types/test/MockTypes';
import { FabricEventNames } from '@/types/fabric-events';

/**
 * Create a typed mock canvas with complete event handling for testing
 * @returns A typed mock canvas ready for testing
 */
export function createTypedMockCanvas(): Canvas {
  const eventHandlers: Record<string, Function[]> = {};
  
  const mockCanvas = {
    // Basic canvas methods
    on: vi.fn((eventName: string, handler: Function) => {
      if (!eventHandlers[eventName]) {
        eventHandlers[eventName] = [];
      }
      eventHandlers[eventName].push(handler);
      return mockCanvas;
    }),
    
    off: vi.fn((eventName: string, handler?: Function) => {
      if (handler && eventHandlers[eventName]) {
        const index = eventHandlers[eventName].indexOf(handler);
        if (index !== -1) {
          eventHandlers[eventName].splice(index, 1);
        }
      } else if (eventHandlers[eventName]) {
        delete eventHandlers[eventName];
      }
      return mockCanvas;
    }),
    
    add: vi.fn(),
    remove: vi.fn(),
    requestRenderAll: vi.fn(),
    discardActiveObject: vi.fn(),
    getPointer: vi.fn().mockReturnValue({ x: 100, y: 100 }),
    getObjects: vi.fn().mockReturnValue([]),
    contains: vi.fn().mockReturnValue(true),
    isDrawingMode: false,
    selection: true,
    defaultCursor: 'default',
    hoverCursor: 'default',
    width: 800,
    height: 600,
    
    // Additional properties for Fabric.js v6 compatibility
    enablePointerEvents: true,
    _willAddMouseDown: false,
    _dropTarget: null,
    _isClick: false,
    _objects: [],
    _activeObject: null,
    _groupSelector: null,
    viewportTransform: [1, 0, 0, 1, 0, 0],
    isDragging: false,
    
    // Required canvas methods
    fire: vi.fn(),
    calcOffset: vi.fn(),
    findTarget: vi.fn(),
    getSelectionContext: vi.fn(),
    getSelectionElement: vi.fn(),
    getActiveObject: vi.fn().mockReturnValue(null),
    setActiveObject: vi.fn(),
    _setupCurrentTransform: vi.fn(),
    _renderOverlay: vi.fn(),
    _restoreObjectsState: vi.fn(),
    _setStageDimension: vi.fn(),
    
    // Testing helper methods
    triggerEvent: (eventName: string, eventData: any) => {
      if (eventHandlers[eventName]) {
        eventHandlers[eventName].forEach(handler => handler(eventData));
      }
    },
    
    getHandlers: (eventName: string) => eventHandlers[eventName] || []
  } as IMockCanvas;
  
  return asMockCanvas(mockCanvas);
}

/**
 * Create a typed mock object for testing
 * @param type The object type (e.g., 'line', 'rect')
 * @param props Additional properties for the mock object
 * @returns A typed mock Fabric object
 */
export function createTypedMockObject(type: string, props: Record<string, any> = {}): FabricObject {
  const mockObject = {
    type,
    set: vi.fn().mockReturnSelf(),
    setCoords: vi.fn(),
    get: vi.fn((prop) => props[prop] || null),
    visible: true,
    evented: true,
    selectable: true,
    ...props
  };
  
  return asMockObject(mockObject);
}
