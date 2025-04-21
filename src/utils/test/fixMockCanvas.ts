
/**
 * Fix Mock Canvas Utility
 * Provides utilities for fixing canvas mock objects in tests
 * @module utils/test/fixMockCanvas
 */
import { Canvas as FabricCanvas } from 'fabric';
import { vi } from 'vitest';

/**
 * Fix canvas mock type compatibility issues
 * @param mockCanvas The canvas mock to fix
 * @returns Type-compatible canvas mock
 */
export function fixMockCanvas(mockCanvas: any): FabricCanvas & {
  getHandlers: (eventName: string) => Function[];
  triggerEvent: (eventName: string, eventData: any) => void;
  withImplementation: (callback?: Function) => Promise<void>;
} {
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
  
  // Add any missing required methods
  if (!mockCanvas.getHandlers) {
    mockCanvas.getHandlers = (eventName: string) => [() => {}];
  }
  
  if (!mockCanvas.triggerEvent) {
    mockCanvas.triggerEvent = (eventName: string, eventData: any) => {};
  }
  
  return mockCanvas as unknown as FabricCanvas & {
    getHandlers: (eventName: string) => Function[];
    triggerEvent: (eventName: string, eventData: any) => void;
    withImplementation: (callback?: Function) => Promise<void>;
  };
}

/**
 * Mock canvas creation with fixed typing
 * @returns Type-compatible canvas mock
 */
export function createFixedTypeMockCanvas() {
  const mockCanvas = {
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
    enablePointerEvents: true,
    _willAddMouseDown: false,
    _dropTarget: null,
    _isClick: false,
    _objects: [],
    getHandlers: (eventName: string) => [() => {}],
    triggerEvent: (eventName: string, eventData: any) => {}
  };
  
  return fixMockCanvas(mockCanvas);
}
