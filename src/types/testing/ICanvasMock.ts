
/**
 * Mock Canvas interface for testing
 * @module types/testing/ICanvasMock
 */
import { Canvas as FabricCanvas } from 'fabric';

/**
 * Minimal Canvas mock interface for tests
 * Contains only the methods and properties commonly used in tests
 */
export interface ICanvasMock {
  add: jest.Mock;
  remove: jest.Mock;
  getObjects: jest.Mock;
  renderAll: jest.Mock;
  requestRenderAll: jest.Mock;
  on: jest.Mock;
  off: jest.Mock;
  getActiveObjects?: jest.Mock;
  discardActiveObject: jest.Mock;
  contains?: jest.Mock;
  // Fix for withImplementation type
  withImplementation: jest.Mock<Promise<void>, [callback?: Function]>;
  // Additional properties to match expected Canvas structure
  enablePointerEvents?: boolean;
  _willAddMouseDown?: boolean;
  _dropTarget?: any;
  _isClick?: boolean;
  _objects?: any[];
  getHandlers?: (eventName: string) => Function[];
  triggerEvent?: (eventName: string, eventData: any) => void;
}

/**
 * Creates a minimal mock canvas implementation
 * Useful when you don't need all canvas methods
 */
export function createMinimalCanvasMock(): ICanvasMock {
  console.log('Creating minimal canvas mock with correct withImplementation return type');
  
  return {
    add: jest.fn(),
    remove: jest.fn(),
    getObjects: jest.fn().mockReturnValue([]),
    renderAll: jest.fn(),
    requestRenderAll: jest.fn(),
    on: jest.fn(),
    off: jest.fn(),
    getActiveObjects: jest.fn().mockReturnValue([]),
    discardActiveObject: jest.fn(),
    contains: jest.fn().mockReturnValue(false),
    // Properly implement withImplementation to return Promise<void>
    withImplementation: jest.fn().mockImplementation((callback?: Function): Promise<void> => {
      console.log('ICanvasMock: withImplementation called');
      if (callback && typeof callback === 'function') {
        try {
          const result = callback();
          if (result instanceof Promise) {
            return result.then(() => Promise.resolve());
          }
        } catch (error) {
          console.error('Error in minimal mock withImplementation:', error);
        }
      }
      return Promise.resolve();
    }),
    // Additional Canvas properties
    enablePointerEvents: true,
    _willAddMouseDown: false,
    _dropTarget: null,
    _isClick: false,
    _objects: [],
    getHandlers: (eventName: string) => [() => {}],
    triggerEvent: (eventName: string, eventData: any) => {}
  };
}

/**
 * Convert any canvas-like object to ICanvasMock type
 * Useful when you have an object that's structurally compatible but types don't match
 */
export function asMockCanvas(canvas: any): ICanvasMock & {
  getHandlers: (eventName: string) => Function[];
  triggerEvent: (eventName: string, eventData: any) => void;
} {
  console.log('Converting object to ICanvasMock type');
  return canvas as ICanvasMock & {
    getHandlers: (eventName: string) => Function[];
    triggerEvent: (eventName: string, eventData: any) => void;
  };
}
