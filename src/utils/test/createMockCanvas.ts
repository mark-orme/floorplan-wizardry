
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
    on: vi.fn(),
    off: vi.fn(),
    add: vi.fn(),
    remove: vi.fn(),
    getObjects: vi.fn().mockReturnValue([]),
    clear: vi.fn(),
    renderAll: vi.fn(),
    getWidth: vi.fn().mockReturnValue(800),
    getHeight: vi.fn().mockReturnValue(600),
    setWidth: vi.fn(),
    setHeight: vi.fn(),
    getElement: vi.fn(),
    getContext: vi.fn(),
    dispose: vi.fn(),
    requestRenderAll: vi.fn(),
    loadFromJSON: vi.fn((json, callback) => {
      if (callback) callback();
    }),
    toJSON: vi.fn().mockReturnValue({}),
    getCenter: vi.fn().mockReturnValue({ top: 300, left: 400 }),
    setViewportTransform: vi.fn(),
    getActiveObject: vi.fn(),
    sendObjectToBack: vi.fn(),
    bringObjectToFront: vi.fn(),
    discardActiveObject: vi.fn(),
    isDrawingMode: false,
    selection: true,
    defaultCursor: 'default',
    getHandlers: vi.fn((eventName) => [() => {}]),
    triggerEvent: vi.fn((eventName, eventData) => {}),
    // Add missing withImplementation to ensure it returns Promise<void>
    withImplementation: vi.fn().mockImplementation(() => Promise.resolve())
  };
  
  return asMockCanvas(mockCanvas as unknown as FabricCanvas);
};
