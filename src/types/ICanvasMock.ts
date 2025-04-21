
import { Canvas as FabricCanvas } from 'fabric';
import { vi, type Mock } from 'vitest';

/**
 * Minimal Canvas mock interface for tests
 * Contains only the methods and properties commonly used in tests
 */
export interface ICanvasMock {
  add: Mock;
  remove: Mock;
  getObjects: Mock;
  renderAll: Mock;
  requestRenderAll: Mock;
  on: Mock;
  off: Mock;
  getActiveObjects?: Mock;
  discardActiveObject: Mock;
  contains?: Mock;
  // Fix for withImplementation type - use a simple Mock with no type params
  withImplementation: Mock;
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
    // Properly implement withImplementation to return Promise<void>
    withImplementation: vi.fn().mockImplementation((): Promise<void> => {
      console.log('ICanvasMock: withImplementation called');
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
export function asMockCanvas(canvas: any): FabricCanvas & {
  getHandlers: (eventName: string) => Function[];
  triggerEvent: (eventName: string, eventData: any) => void;
  withImplementation: () => Promise<void>;
} {
  console.log('Converting object to Canvas type with enhanced methods');
  return canvas as unknown as FabricCanvas & {
    getHandlers: (eventName: string) => Function[];
    triggerEvent: (eventName: string, eventData: any) => void;
    withImplementation: () => Promise<void>;
  };
}
