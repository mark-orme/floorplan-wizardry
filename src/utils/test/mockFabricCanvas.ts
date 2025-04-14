import { FabricEventNames } from '@/types/fabric-events';

// Export mockFabricCanvas implementation
export const createMockFabricCanvas = () => {
  // Mock implementation
};

/**
 * Create a mock Fabric object for testing
 * @param type Fabric object type
 * @param options Fabric object options
 * @returns Mocked Fabric object
 */
export const createMockObject = (type: string, options: any = {}) => {
  const mockObject: any = {
    type: type,
    set: vi.fn().mockReturnThis(),
    get: vi.fn((prop: string) => options[prop]),
    toObject: vi.fn().mockReturnValue({ type, ...options }),
    on: vi.fn().mockReturnThis(),
    off: vi.fn().mockReturnThis(),
    remove: vi.fn(),
    intersectsWithRect: vi.fn().mockReturnValue(false),
    ...options
  };
  
  return mockObject;
};

/**
 * Setup Fabric mock
 */
export const setupFabricMock = () => {
  const mockCanvas = {
    on: vi.fn().mockReturnThis(),
    off: vi.fn().mockReturnThis(),
    add: vi.fn().mockReturnThis(),
    remove: vi.fn().mockReturnThis(),
    clear: vi.fn().mockReturnThis(),
    getObjects: vi.fn().mockReturnValue([]),
    setActiveObject: vi.fn(),
    discardActiveObject: vi.fn(),
    renderAll: vi.fn().mockReturnThis(),
    requestRenderAll: vi.fn().mockReturnThis(),
    toDataURL: vi.fn().mockReturnValue('mockedImageData'),
    loadFromJSON: vi.fn().mockImplementation((json, callback) => {
      callback();
    }),
    toJSON: vi.fn().mockReturnValue({ objects: [] }),
    getWidth: vi.fn().mockReturnValue(800),
    getHeight: vi.fn().mockReturnValue(600),
    getZoom: vi.fn().mockReturnValue(1),
    setZoom: vi.fn().mockReturnThis(),
    viewportTransform: [1, 0, 0, 1, 0, 0],
    absolutePointer: vi.fn().mockReturnValue({ x: 0, y: 0 }),
    relativePointer: vi.fn().mockReturnValue({ x: 0, y: 0 }),
    containsPoint: vi.fn().mockReturnValue(false),
    sendToBack: vi.fn().mockReturnThis(),
    bringToFront: vi.fn().mockReturnThis(),
    isDrawingMode: false,
    selection: true,
    defaultCursor: 'arrow',
    hoverCursor: 'hand',
    upperCanvasEl: {
      focus: vi.fn()
    },
    lowerCanvasEl: {
      getContext: vi.fn().mockReturnValue({
        drawImage: vi.fn()
      })
    },
    fire: vi.fn(),
    getActiveObjects: vi.fn().mockReturnValue([]),
    getActiveObject: vi.fn().mockReturnValue(null),
    removeAll: vi.fn(),
    contains: vi.fn().mockReturnValue(false)
  };
  
  const mockObject = {
    set: vi.fn().mockReturnThis(),
    get: vi.fn(),
    toObject: vi.fn().mockReturnValue({}),
    on: vi.fn().mockReturnThis(),
    off: vi.fn().mockReturnThis(),
    remove: vi.fn(),
    intersectsWithRect: vi.fn().mockReturnValue(false)
  };
  
  const mockLine = {
    ...mockObject,
    type: 'line',
    set: vi.fn().mockReturnThis(),
    get: vi.fn(),
    toObject: vi.fn().mockReturnValue({}),
    on: vi.fn().mockReturnThis(),
    off: vi.fn().mockReturnThis(),
    remove: vi.fn(),
    intersectsWithRect: vi.fn().mockReturnValue(false)
  };
  
  return {
    Canvas: vi.fn().mockImplementation(() => mockCanvas),
    StaticCanvas: vi.fn().mockImplementation(() => mockCanvas),
    Object: vi.fn().mockImplementation(() => mockObject),
    Line: vi.fn().mockImplementation(() => mockLine),
    PencilBrush: vi.fn().mockImplementation(() => ({
      color: '#000000',
      width: 1,
      initialize: vi.fn(),
      onMouseDown: vi.fn(),
      onMouseMove: vi.fn(),
      onMouseUp: vi.fn(),
      createPath: vi.fn().mockReturnValue({}),
      _render: vi.fn()
    })),
    Image: {
      fromURL: vi.fn().mockImplementation((url, callback) => {
        const mockImage = {
          set: vi.fn().mockReturnThis(),
          scaleToWidth: vi.fn().mockReturnThis(),
          scaleToHeight: vi.fn().mockReturnThis()
        };
        callback(mockImage);
      })
    },
    util: {
      loadImage: vi.fn().mockImplementation((url, callback) => {
        callback();
      })
    },
    Textbox: vi.fn().mockImplementation(() => ({
      set: vi.fn().mockReturnThis(),
      on: vi.fn().mockReturnThis(),
      off: vi.fn().mockReturnThis(),
      remove: vi.fn(),
      intersectsWithRect: vi.fn().mockReturnValue(false)
    })),
    Polygon: vi.fn().mockImplementation(() => ({
      set: vi.fn().mockReturnThis(),
      on: vi.fn().mockReturnThis(),
      off: vi.fn().mockReturnThis(),
      remove: vi.fn(),
      intersectsWithRect: vi.fn().mockReturnValue(false)
    })),
    Path: vi.fn().mockImplementation(() => ({
      set: vi.fn().mockReturnThis(),
      on: vi.fn().mockReturnThis(),
      off: vi.fn().mockReturnThis(),
      remove: vi.fn(),
      intersectsWithRect: vi.fn().mockReturnValue(false)
    })),
    Rect: vi.fn().mockImplementation(() => ({
      set: vi.fn().mockReturnThis(),
      on: vi.fn().mockReturnThis(),
      off: vi.fn().mockReturnThis(),
      remove: vi.fn(),
      intersectsWithRect: vi.fn().mockReturnValue(false)
    })),
    Circle: vi.fn().mockImplementation(() => ({
      set: vi.fn().mockReturnThis(),
      on: vi.fn().mockReturnThis(),
      off: vi.fn().mockReturnThis(),
      remove: vi.fn(),
      intersectsWithRect: vi.fn().mockReturnValue(false)
    })),
    Point: vi.fn().mockImplementation((x, y) => ({
      x: x,
      y: y
    })),
    Intersection: {
      intersectLineRectangle: vi.fn().mockReturnValue([])
    },
    Evented: vi.fn().mockImplementation(() => ({
      on: vi.fn().mockReturnThis(),
      off: vi.fn().mockReturnThis(),
      fire: vi.fn()
    })),
    version: '5.0.0'
  };
};
