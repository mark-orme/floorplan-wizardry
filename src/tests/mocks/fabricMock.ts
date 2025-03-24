
/**
 * Mock implementation of Fabric.js for testing
 * Simulates essential canvas behaviors without the DOM dependency
 */

export class FabricCanvasMock {
  width: number;
  height: number;
  backgroundColor: string;
  objects: any[] = [];
  freeDrawingBrush: any;
  isDrawingMode: boolean = false;
  events: Record<string, Function[]> = {};

  constructor(element: any, options: any = {}) {
    this.width = options.width || 800;
    this.height = options.height || 600;
    this.backgroundColor = options.backgroundColor || '#ffffff';
    this.freeDrawingBrush = {
      color: '#000000',
      width: 2,
    };
  }

  add(obj: any) {
    this.objects.push(obj);
    return this;
  }

  remove(obj: any) {
    this.objects = this.objects.filter(o => o !== obj);
    return this;
  }

  clear() {
    this.objects = [];
    return this;
  }

  renderAll() {
    // Mock implementation
    return this;
  }

  requestRenderAll() {
    // Mock implementation
    return this;
  }

  getObjects() {
    return [...this.objects];
  }

  getActiveObject() {
    return this.objects.find(obj => obj.active === true) || null;
  }

  setActiveObject(obj: any) {
    this.objects.forEach(o => { o.active = false; });
    if (obj) obj.active = true;
    return this;
  }

  discardActiveObject() {
    this.objects.forEach(o => { o.active = false; });
    return this;
  }

  getPointer(event: any) {
    // Mock implementation returning a fixed point
    return { x: 100, y: 100 };
  }

  on(eventName: string, handler: Function) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(handler);
    return this;
  }

  off(eventName: string, handler?: Function) {
    if (!this.events[eventName]) return this;
    
    if (handler) {
      this.events[eventName] = this.events[eventName].filter(h => h !== handler);
    } else {
      delete this.events[eventName];
    }
    return this;
  }

  fire(eventName: string, options: any = {}) {
    if (!this.events[eventName]) return this;
    
    this.events[eventName].forEach(handler => {
      handler(options);
    });
    return this;
  }

  setViewportTransform(transform: number[]) {
    // Mock implementation
    return this;
  }

  setZoom(value: number) {
    // Mock implementation
    return this;
  }

  dispose() {
    this.objects = [];
    this.events = {};
  }

  calcViewportBoundaries() {
    // Mock implementation
    return {
      tl: { x: 0, y: 0 },
      br: { x: this.width, y: this.height },
      tr: { x: this.width, y: 0 },
      bl: { x: 0, y: this.height }
    };
  }

  toJSON() {
    return {
      objects: this.objects,
      background: this.backgroundColor
    };
  }

  loadFromJSON(json: any, callback?: Function) {
    if (typeof json === 'string') {
      try {
        json = JSON.parse(json);
      } catch (e) {
        console.error('Error parsing JSON', e);
        return this;
      }
    }
    
    this.objects = json.objects || [];
    this.backgroundColor = json.background || '#ffffff';
    
    if (callback) callback();
    return this;
  }

  sendObjectToBack(obj: any) {
    // Mock implementation
    return this;
  }

  bringObjectToFront(obj: any) {
    // Mock implementation
    return this;
  }
}

export class PolylineMock {
  points: any[];
  fill: string;
  stroke: string;
  strokeWidth: number;
  type: string = 'polyline';

  constructor(points: any[], options: any = {}) {
    this.points = points;
    this.fill = options.fill || 'transparent';
    this.stroke = options.stroke || '#000000';
    this.strokeWidth = options.strokeWidth || 2;
  }
}

export class PathMock {
  path: any[];
  fill: string;
  stroke: string;
  strokeWidth: number;
  type: string = 'path';

  constructor(path: any[], options: any = {}) {
    this.path = path;
    this.fill = options.fill || 'transparent';
    this.stroke = options.stroke || '#000000';
    this.strokeWidth = options.strokeWidth || 2;
  }
}

// Mock the fabric library
export const fabricMock = {
  Canvas: FabricCanvasMock,
  Polyline: PolylineMock,
  Path: PathMock
};
