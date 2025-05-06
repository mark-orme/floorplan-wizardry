
/**
 * Fabric.js mock for testing
 */
import { ExtendedFabricCanvas, ExtendedFabricObject } from '../types/fabric-core';

// Use proper jest function mocks
const mockFn = () => jest.fn();
const mockReturnSelf = () => jest.fn().mockImplementation(function() { return this; });
const mockObjectFactory = () => ({
  set: mockReturnSelf(),
  setCoords: mockReturnSelf(),
  toObject: mockFn(),
  get: mockFn(),
  on: mockReturnSelf(),
  off: mockReturnSelf(),
  addEventListener: mockReturnSelf(),
  removeEventListener: mockReturnSelf(),
  moveTo: mockReturnSelf(),
  dispose: mockFn(),
  remove: mockFn()
});

// Mock Canvas class
class Canvas {
  constructor(element: string | HTMLCanvasElement, options?: any) {
    // Initialize properties with default values
    this.viewportTransform = [1, 0, 0, 1, 0, 0];
    this.absolutePointer = { x: 0, y: 0 };
    this.relativePointer = { x: 0, y: 0 };
    this.upperCanvasEl = document.createElement('canvas') as HTMLCanvasElement;
    this.wrapperEl = document.createElement('div') as HTMLDivElement;
    this.isDrawingMode = false;
    this.selection = true;
    this.freeDrawingBrush = {
      color: '#000000',
      width: 1
    };
    
    // Set up mock methods
    this.add = jest.fn().mockReturnValue(this);
    this.remove = jest.fn().mockReturnValue(this);
    this.clear = jest.fn().mockReturnValue(this);
    this.renderAll = jest.fn().mockReturnValue(this);
    this.requestRenderAll = jest.fn().mockReturnValue(this);
    this.getContext = jest.fn().mockReturnValue({
      canvas: {
        width: options?.width || 600,
        height: options?.height || 400
      }
    });
    this.getObjects = jest.fn().mockReturnValue([]);
    this.getActiveObject = jest.fn().mockReturnValue(null);
    this.discardActiveObject = jest.fn().mockReturnValue(this);
    this.setZoom = jest.fn().mockReturnValue(this);
    this.getZoom = jest.fn().mockReturnValue(1);
    this.forEachObject = jest.fn();
    this.on = jest.fn().mockReturnValue(this);
    this.off = jest.fn().mockReturnValue(this);
    this.dispose = jest.fn();
    this.getPointer = jest.fn().mockReturnValue({ x: 0, y: 0 });
    this.zoomToPoint = jest.fn().mockReturnValue(this);
    this.setWidth = jest.fn().mockReturnValue(this);
    this.setHeight = jest.fn().mockReturnValue(this);
    this.toObject = jest.fn().mockReturnValue({});
    this.toDataURL = jest.fn().mockReturnValue('data:image/png;base64,mock');
  }

  // Properties with default values
  viewportTransform: number[];
  absolutePointer: { x: number; y: number };
  relativePointer: { x: number; y: number };
  upperCanvasEl: HTMLCanvasElement;
  wrapperEl: HTMLDivElement;
  isDrawingMode: boolean;
  selection: boolean;
  freeDrawingBrush: {
    color: string;
    width: number;
  };
  
  // Mock methods
  add: jest.Mock;
  remove: jest.Mock;
  clear: jest.Mock;
  renderAll: jest.Mock;
  requestRenderAll: jest.Mock;
  getContext: jest.Mock;
  getObjects: jest.Mock;
  getActiveObject: jest.Mock;
  discardActiveObject: jest.Mock;
  setZoom: jest.Mock;
  getZoom: jest.Mock;
  forEachObject: jest.Mock;
  on: jest.Mock;
  off: jest.Mock;
  dispose: jest.Mock;
  getPointer: jest.Mock;
  zoomToPoint: jest.Mock;
  setWidth: jest.Mock;
  setHeight: jest.Mock;
  toObject: jest.Mock;
  toDataURL: jest.Mock;
}

// Mock Object class
class FabricObject implements ExtendedFabricObject {
  constructor(options = {}) {
    Object.assign(this, options);
    
    // Set up mock methods
    this.set = jest.fn().mockReturnValue(this);
    this.setCoords = jest.fn().mockReturnValue(this);
    this.toObject = jest.fn().mockReturnValue({});
    this.get = jest.fn();
    this.on = jest.fn().mockReturnValue(this);
    this.off = jest.fn().mockReturnValue(this);
  }

  // Properties with default values
  visible = true;
  selectable = true;
  evented = true;
  
  // Mock methods
  set: jest.Mock;
  setCoords: jest.Mock;
  toObject: jest.Mock;
  get: jest.Mock;
  on: jest.Mock;
  off: jest.Mock;
}

// Mock Line class 
class Line extends FabricObject {
  constructor(points: Array<number>, options = {}) {
    super(options);
    this.points = points;
    this.type = 'line';
    this.x1 = points[0] || 0;
    this.y1 = points[1] || 0;
    this.x2 = points[2] || 0;
    this.y2 = points[3] || 0;
  }
  
  points: Array<number>;
  type: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

// Mock Path class
class Path extends FabricObject {
  constructor(path: string, options = {}) {
    super(options);
    this.path = path;
    this.type = 'path';
  }
  
  path: string;
  type: string;
}

// Mock Group class
class Group extends FabricObject {
  constructor(objects: Array<FabricObject>, options = {}) {
    super(options);
    this.objects = objects;
    this.type = 'group';
  }
  
  objects: Array<FabricObject>;
  type: string;
}

// Mock Text class
class Text extends FabricObject {
  constructor(text: string, options = {}) {
    super(options);
    this.text = text;
    this.type = 'text';
  }
  
  text: string;
  type: string;
}

// Mock Point class
class Point {
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
  
  x: number;
  y: number;
}

// Export all the mocked components
export {
  Canvas,
  FabricObject as Object,
  Line,
  Path,
  Group,
  Text,
  Point
};

// Default export
export default {
  Canvas,
  Object: FabricObject,
  Line,
  Path, 
  Group,
  Text,
  Point
};
