
/**
 * Fix Mock Canvas Utility
 * Provides utilities for fixing canvas mock objects in tests
 * @module utils/test/fixMockCanvas
 */
import { Canvas as FabricCanvas } from 'fabric';
import { vi } from 'vitest';
import { MockCanvas } from './createMockCanvas';

/**
 * Fix canvas mock type compatibility issues
 * @param mockCanvas The canvas mock to fix
 * @returns Type-compatible canvas mock
 */
export function fixMockCanvas(mockCanvas: Partial<MockCanvas>): MockCanvas {
  // Fix withImplementation if it doesn't return a Promise<void>
  if (mockCanvas.withImplementation && typeof mockCanvas.withImplementation !== 'function') {
    mockCanvas.withImplementation = vi.fn().mockImplementation((callback?: Function): Promise<void> => {
      if (callback && typeof callback === 'function') {
        try {
          const result = callback();
          if (result instanceof Promise) {
            return result.then(() => Promise.resolve());
          }
        } catch (error) {
          console.error('Error in withImplementation mock:', error);
        }
      }
      return Promise.resolve();
    });
  }
  
  // Add missing required methods
  if (!mockCanvas.getHandlers) {
    mockCanvas.getHandlers = (eventName: string) => [() => {}];
  }
  
  if (!mockCanvas.triggerEvent) {
    mockCanvas.triggerEvent = (eventName: string, eventData: unknown) => {};
  }
  
  return mockCanvas as MockCanvas;
}

/**
 * Mock canvas creation with fixed typing
 * @returns Type-compatible canvas mock
 */
export function createFixedTypeMockCanvas(): MockCanvas {
  const mockCanvas: Partial<MockCanvas> = {
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
    withImplementation: vi.fn().mockImplementation((callback?: Function): Promise<void> => {
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
    }),
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
    enablePointerEvents: true,
    _willAddMouseDown: false,
    _dropTarget: null,
    _isClick: false,
    _objects: [],
    getHandlers: vi.fn().mockReturnValue([() => {}]),
    triggerEvent: vi.fn()
  };
  
  return fixMockCanvas(mockCanvas);
}
