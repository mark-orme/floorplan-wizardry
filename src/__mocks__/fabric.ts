
/** @ts-nocheck */
// This file is a mock implementation of fabric.js for testing purposes
// TypeScript checking is disabled to avoid adding type annotations to test code

const fabric = {
  Canvas: class {
    constructor() {
      this.add = jest.fn();
      this.remove = jest.fn();
      this.clear = jest.fn();
      this.renderAll = jest.fn();
      this.toDataURL = jest.fn();
      this.on = jest.fn();
      this.off = jest.fn();
      this.getObjects = jest.fn().mockReturnValue([]);
      this.toJSON = jest.fn().mockReturnValue({});
      this.loadFromJSON = jest.fn();
      this.requestRenderAll = jest.fn();
      this.dispose = jest.fn();
      this.setActiveObject = jest.fn();
      this.getActiveObject = jest.fn();
      this.discardActiveObject = jest.fn();
      this.viewportTransform = [1, 0, 0, 1, 0, 0];
      this.getZoom = jest.fn().mockReturnValue(1);
      this.setZoom = jest.fn();
      this.absolutePointer = { x: 0, y: 0 };
      this.relativePointer = { x: 0, y: 0 };
      this.upperCanvasEl = { style: {} };
      this.wrapperEl = { classList: { add: jest.fn(), remove: jest.fn() } };
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
      this.set = jest.fn();
      this.get = jest.fn();
      this.toObject = jest.fn();
      this.setCoords = jest.fn();
      this.on = jest.fn();
      this.off = jest.fn();
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
      this.set = jest.fn();
      this.get = jest.fn();
      this.toObject = jest.fn();
    }
    set() { }
    get() { }
    toObject() { }
  },
  Circle: class {
    constructor() {
      this.set = jest.fn();
      this.get = jest.fn();
      this.toObject = jest.fn();
    }
    set() { }
    get() { }
    toObject() { }
  },
  Line: class {
    constructor() {
      this.set = jest.fn();
      this.get = jest.fn();
      this.toObject = jest.fn();
      this.setCoords = jest.fn();
    }
    set() { }
    get() { }
    toObject() { }
    setCoords() { }
  },
  Textbox: class {
    constructor() {
      this.set = jest.fn();
      this.get = jest.fn();
      this.toObject = jest.fn();
    }
    set() { }
    get() { }
    toObject() { }
  },
  Path: class {
    constructor() {
      this.set = jest.fn();
      this.get = jest.fn();
      this.toObject = jest.fn();
    }
    set() { }
    get() { }
    toObject() { }
  },
  Group: class {
    constructor() {
      this.add = jest.fn();
      this.remove = jest.fn();
      this.clear = jest.fn();
      this.renderAll = jest.fn();
      this.toDataURL = jest.fn();
      this.on = jest.fn();
      this.off = jest.fn();
      this.getObjects = jest.fn().mockReturnValue([]);
      this.toJSON = jest.fn().mockReturnValue({});
      this.loadFromJSON = jest.fn();
      this.requestRenderAll = jest.fn();
      this.dispose = jest.fn();
      this.setActiveObject = jest.fn();
      this.getActiveObject = jest.fn();
      this.discardActiveObject = jest.fn();
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
    constructor(x, y) {
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
