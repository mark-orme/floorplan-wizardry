
/**
 * Create a typed mock canvas for tests
 * Provides a properly typed mock canvas object for unit tests
 * @module utils/test/createMockCanvas
 */
import { Canvas as FabricCanvas } from 'fabric';
import { asMockCanvas } from '@/types/test/MockTypes';

/**
 * Creates a strongly-typed mock Fabric.js canvas for testing
 * Ensures all required properties and methods are properly mocked
 * 
 * @returns A properly typed mock canvas object
 */
export const createTypedMockCanvas = () => {
  const mockCanvas = {
    on: jest.fn(),
    off: jest.fn(),
    add: jest.fn(),
    remove: jest.fn(),
    getObjects: jest.fn().mockReturnValue([]),
    clear: jest.fn(),
    renderAll: jest.fn(),
    getWidth: jest.fn().mockReturnValue(800),
    getHeight: jest.fn().mockReturnValue(600),
    setWidth: jest.fn(),
    setHeight: jest.fn(),
    getElement: jest.fn(),
    getContext: jest.fn(),
    dispose: jest.fn(),
    requestRenderAll: jest.fn(),
    loadFromJSON: jest.fn((json, callback) => {
      if (callback) callback();
    }),
    toJSON: jest.fn().mockReturnValue({}),
    getCenter: jest.fn().mockReturnValue({ top: 300, left: 400 }),
    setViewportTransform: jest.fn(),
    getActiveObject: jest.fn(),
    sendObjectToBack: jest.fn(),
    bringObjectToFront: jest.fn(),
    discardActiveObject: jest.fn(),
    isDrawingMode: false,
    selection: true,
    defaultCursor: 'default',
    getHandlers: jest.fn((eventName) => [() => {}]),
    triggerEvent: jest.fn((eventName, eventData) => {})
  };
  
  return asMockCanvas(mockCanvas as unknown as FabricCanvas);
};
