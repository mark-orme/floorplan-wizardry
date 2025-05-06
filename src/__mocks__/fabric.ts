
import { vi } from 'vitest';

// Mock implementation of fabric.js for testing
const createMockCanvas = () => {
  return {
    add: vi.fn(),
    remove: vi.fn(),
    getObjects: vi.fn().mockReturnValue([]),
    renderAll: vi.fn(),
    requestRenderAll: vi.fn(),
    getActiveObjects: vi.fn().mockReturnValue([]),
    discardActiveObject: vi.fn(),
    contains: vi.fn().mockReturnValue(false),
    on: vi.fn(),
    off: vi.fn(),
    fire: vi.fn(),
    getContext: vi.fn().mockReturnValue({
      canvas: { width: 800, height: 600 }
    }),
    toJSON: vi.fn().mockReturnValue({}),
    clear: vi.fn(),
    getWidth: vi.fn().mockReturnValue(800),
    getHeight: vi.fn().mockReturnValue(600),
    getPointer: vi.fn().mockReturnValue({ x: 0, y: 0 }),
    setWidth: vi.fn(),
    setHeight: vi.fn(),
    setZoom: vi.fn(),
    getZoom: vi.fn().mockReturnValue(1),
    viewportTransform: [1, 0, 0, 1, 0, 0],
    absolutePointer: { x: 0, y: 0 },
    relativePointer: { x: 0, y: 0 },
    upperCanvasEl: document.createElement('canvas'),
    wrapperEl: document.createElement('div'),
    isDrawingMode: false,
    selection: true,
    freeDrawingBrush: {
      color: '#000000',
      width: 2
    },
    withImplementation: vi.fn().mockImplementation((callback) => {
      if (callback) callback();
      return Promise.resolve();
    }),
    zoomToPoint: vi.fn(),
    forEachObject: vi.fn((callback) => {
      if (callback) callback({ selectable: true });
    }),
    dispose: vi.fn()
  };
};

// Mock fabric Object class
class FabricObject {
  static type = 'object';
  
  constructor(options = {}) {
    Object.assign(this, {
      id: `mock-object-${Date.now()}`,
      type: 'object',
      visible: true,
      selectable: true,
      evented: true,
      left: 0,
      top: 0,
      width: 100,
      height: 100,
      ...options,
      set: vi.fn().mockImplementation(function(options) {
        if (typeof options === 'object') {
          Object.assign(this, options);
        } else if (arguments.length === 2) {
          this[arguments[0]] = arguments[1];
        }
        return this;
      }),
      setCoords: vi.fn().mockImplementation(function() {
        return this;
      })
    });
  }
}

// Mock specific fabric objects
class Line extends FabricObject {
  static type = 'line';
  
  constructor(points = [0, 0, 100, 100], options = {}) {
    super({
      type: 'line',
      x1: points[0],
      y1: points[1],
      x2: points[2],
      y2: points[3],
      ...options
    });
  }
}

class Path extends FabricObject {
  static type = 'path';
  
  constructor(path = '', options = {}) {
    super({
      type: 'path',
      path,
      ...options
    });
  }
}

class Text extends FabricObject {
  static type = 'text';
  
  constructor(text = '', options = {}) {
    super({
      type: 'text',
      text,
      ...options
    });
  }
}

class Circle extends FabricObject {
  static type = 'circle';
  
  constructor(options = {}) {
    super({
      type: 'circle',
      radius: 50,
      ...options
    });
  }
}

class Rect extends FabricObject {
  static type = 'rect';
  
  constructor(options = {}) {
    super({
      type: 'rect',
      ...options
    });
  }
}

class Group extends FabricObject {
  static type = 'group';
  
  constructor(objects = [], options = {}) {
    super({
      type: 'group',
      objects,
      ...options
    });
    this.getObjects = vi.fn().mockReturnValue(objects);
    this.forEachObject = vi.fn((callback) => {
      objects.forEach((obj) => callback(obj));
    });
  }
}

// Helper Point class for fabric
class Point {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }
}

// Mock Canvas class
class Canvas {
  constructor(element, options = {}) {
    const mockCanvas = createMockCanvas();
    return Object.assign(this, mockCanvas, options);
  }
  
  static fabric = {
    Canvas
  };
}

// Create and export the fabric namespace
const fabric = {
  Canvas,
  Object: FabricObject,
  Line,
  Path,
  Text,
  Circle,
  Rect,
  Group,
  Point
};

export default fabric;
export { Canvas, FabricObject as Object, Line, Path, Text, Circle, Rect, Group, Point };
