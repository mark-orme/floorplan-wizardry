
// This file is a mock implementation of fabric.js for testing purposes
import { vi } from 'vitest';

// Create mock functions instead of using jest.fn()
const mockFn = vi.fn;

// Define the Fabric mock object with proper type safety
const fabric = {
  Canvas: class {
    constructor() {
      this.add = mockFn();
      this.remove = mockFn();
      this.clear = mockFn();
      this.renderAll = mockFn();
      this.toDataURL = mockFn();
      this.on = mockFn();
      this.off = mockFn();
      this.getObjects = mockFn().mockReturnValue([]);
      this.toJSON = mockFn().mockReturnValue({});
      this.loadFromJSON = mockFn();
      this.requestRenderAll = mockFn();
      this.dispose = mockFn();
      this.setActiveObject = mockFn();
      this.getActiveObject = mockFn();
      this.discardActiveObject = mockFn();
      this.viewportTransform = [1, 0, 0, 1, 0, 0];
      this.getZoom = mockFn().mockReturnValue(1);
      this.setZoom = mockFn();
      this.absolutePointer = { x: 0, y: 0 };
      this.relativePointer = { x: 0, y: 0 };
      this.upperCanvasEl = { style: {} };
      this.wrapperEl = { classList: { add: mockFn(), remove: mockFn() } };
      this.isDrawingMode = false;
      this.selection = true;
      this.freeDrawingBrush = {
        color: '#000000',
        width: 1
      };
    }
    add() { }
    remove() { }
    clear() { }
    renderAll() { }
    toDataURL() { }
    on() { }
    off() { }
    getObjects() { return []; }
    toJSON() { return {}; }
    loadFromJSON() { }
    requestRenderAll() { }
    dispose() { }
    setActiveObject() { }
    getActiveObject() { }
    discardActiveObject() { }
    getZoom() { return 1; }
    setZoom() { }
  },
  Object: class {
    constructor() {
      this.set = mockFn();
      this.get = mockFn();
      this.toObject = mockFn();
      this.setCoords = mockFn();
      this.on = mockFn();
      this.off = mockFn();
    }
    set() { }
    get() { }
    toObject() { }
    setCoords() { }
    on() { }
    off() { }
  },
  Rect: class {
    constructor() {
      this.set = mockFn();
      this.get = mockFn();
      this.toObject = mockFn();
    }
    set() { }
    get() { }
    toObject() { }
  },
  Circle: class {
    constructor() {
      this.set = mockFn();
      this.get = mockFn();
      this.toObject = mockFn();
    }
    set() { }
    get() { }
    toObject() { }
  },
  Line: class {
    constructor() {
      this.set = mockFn();
      this.get = mockFn();
      this.toObject = mockFn();
      this.setCoords = mockFn();
    }
    set() { }
    get() { }
    toObject() { }
    setCoords() { }
  },
  Textbox: class {
    constructor() {
      this.set = mockFn();
      this.get = mockFn();
      this.toObject = mockFn();
    }
    set() { }
    get() { }
    toObject() { }
  },
  Path: class {
    constructor() {
      this.set = mockFn();
      this.get = mockFn();
      this.toObject = mockFn();
    }
    set() { }
    get() { }
    toObject() { }
  },
  Group: class {
    constructor() {
      this.add = mockFn();
      this.remove = mockFn();
      this.clear = mockFn();
      this.renderAll = mockFn();
      this.toDataURL = mockFn();
      this.on = mockFn();
      this.off = mockFn();
      this.getObjects = mockFn().mockReturnValue([]);
      this.toJSON = mockFn().mockReturnValue({});
      this.loadFromJSON = mockFn();
      this.requestRenderAll = mockFn();
      this.dispose = mockFn();
      this.setActiveObject = mockFn();
      this.getActiveObject = mockFn();
      this.discardActiveObject = mockFn();
    }
    add() { }
    remove() { }
    clear() { }
    renderAll() { }
    toDataURL() { }
    on() { }
    off() { }
    getObjects() { return []; }
    toJSON() { return {}; }
    loadFromJSON() { }
    requestRenderAll() { }
    dispose() { }
    setActiveObject() { }
    getActiveObject() { }
    discardActiveObject() { }
  },
  util: {
    degreesToRadians: () => { }
  },
  Point: class {
    x: number;
    y: number;
    constructor(x: number, y: number) {
      this.x = x;
      this.y = y;
    }
  },
  Intersection: {
    intersectLineLine: () => {
      return { status: 'Intersection' };
    },
    intersectPathPath: () => {
      return { status: 'Intersection' };
    }
  },
  version: '6.0.0'
};

export default fabric;
