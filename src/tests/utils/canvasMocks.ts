
/**
 * Mocks for canvas testing
 * @module canvasMocks
 */
import { vi } from 'vitest';
import { Canvas, BaseBrush, Object as FabricObject } from 'fabric';

/**
 * Type for mock event callbacks
 */
type EventCallback = (event: any) => void;

/**
 * Sets up a mock for the fabric Canvas
 * @returns {Object} Mocked fabric namespace
 */
export const setupFabricMock = () => {
  return {
    Canvas: vi.fn().mockImplementation(() => {
      const mockCanvas = {
        on: vi.fn((_eventName: string, _handler: EventCallback) => mockCanvas),
        off: vi.fn((_eventName: string, _handler?: EventCallback) => mockCanvas),
        add: vi.fn(),
        remove: vi.fn(),
        contains: vi.fn().mockReturnValue(true),
        getObjects: vi.fn().mockReturnValue([]),
        setZoom: vi.fn(),
        getZoom: vi.fn().mockReturnValue(1),
        sendToBack: vi.fn(),
        bringToFront: vi.fn(),
        sendObjectToBack: vi.fn(),
        bringObjectToFront: vi.fn(),
        renderAll: vi.fn(),
        requestRenderAll: vi.fn(),
        dispose: vi.fn(),
        clear: vi.fn(),
        setWidth: vi.fn(),
        setHeight: vi.fn(),
        setDimensions: vi.fn(),
        isDrawingMode: false,
        selection: true,
        freeDrawingBrush: {
          color: "#000000",
          width: 2
        },
        width: 1000,
        height: 800
      };
      return mockCanvas;
    }),
    Point: vi.fn(),
    Object: {},
    Line: vi.fn(),
    PencilBrush: vi.fn().mockImplementation(() => {
      return {
        color: "#000000",
        width: 2,
        decimate: 2,
        _saveAndTransform: vi.fn(),
        _setShadow: vi.fn(),
        _resetShadow: vi.fn(),
        _isOutSideCanvas: vi.fn()
      };
    }),
    BaseBrush: vi.fn(),
    IEvent: vi.fn(),
    util: {
      object: {
        extend: vi.fn()
      }
    }
  };
};

/**
 * Creates a mock grid layer reference
 * @returns {Object} A mock grid layer reference
 */
export const createMockGridLayerRef = () => {
  return {
    current: [
      { id: 'grid1', type: 'line', objectType: 'grid', toObject: () => ({ id: 'grid1', objectType: 'grid' }) },
      { id: 'grid2', type: 'line', objectType: 'grid', toObject: () => ({ id: 'grid2', objectType: 'grid' }) },
    ]
  };
};

/**
 * Creates a mock history reference
 * @param {any[][]} past - Past state array
 * @param {any[][]} future - Future state array
 * @returns {Object} A mock history reference
 */
export const createMockHistoryRef = (past: any[][] = [], future: any[][] = []) => {
  return {
    current: {
      past: [...past],
      future: [...future]
    }
  };
};

/**
 * Creates a mock object with specified properties
 * @param {Object} properties - Properties to include in the mock object
 * @returns {Object} A mock Fabric object
 */
export const createMockObject = (properties: Record<string, any> = {}) => {
  return {
    type: 'object',
    visible: true,
    set: vi.fn().mockImplementation(function(this: any, key: string | Record<string, any>, value?: any) {
      if (typeof key === 'object') {
        Object.assign(this, key);
      } else if (typeof key === 'string' && value !== undefined) {
        this[key] = value;
      }
      return this;
    }),
    toObject: vi.fn().mockReturnValue({}),
    ...properties
  };
};

/**
 * Creates a mock polyline object
 * @param {Array} points - Array of points for the polyline
 * @param {Object} properties - Additional properties for the polyline
 * @returns {Object} A mock polyline object
 */
export const createMockPolyline = (points: Array<{x: number, y: number}> = [], properties: Record<string, any> = {}) => {
  return createMockObject({
    type: 'polyline',
    points,
    ...properties
  });
};
