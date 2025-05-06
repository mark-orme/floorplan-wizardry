
/**
 * Mock for fabric.js
 * SAFE FOR ES5-ONLY ENVIRONMENT
 */

// Define basic interfaces for the mock
interface CanvasOptions {
  width?: number;
  height?: number;
  selection?: boolean;
}

interface BrushOptions {
  width?: number;
  color?: string;
}

interface LineOptions {
  stroke?: string;
  strokeWidth?: number;
  selectable?: boolean;
  evented?: boolean;
}

// Mock Canvas class
export class Canvas {
  width: number;
  height: number;
  selection: boolean;
  isDrawingMode: boolean;
  defaultCursor: string;
  hoverCursor: string;
  freeDrawingBrush: PencilBrush;
  _objects: Array<any>;

  constructor(element: string | HTMLElement, options?: CanvasOptions) {
    this.width = options && options.width || 600;
    this.height = options && options.height || 400;
    this.selection = options && typeof options.selection !== "undefined" ? options.selection : true;
    this.isDrawingMode = false;
    this.defaultCursor = "default";
    this.hoverCursor = "pointer";
    this._objects = [];
    this.freeDrawingBrush = new PencilBrush(this);
  }

  add(): Canvas {
    for (var i = 0; i < arguments.length; i++) {
      this._objects.push(arguments[i]);
    }
    return this;
  }

  remove(): Canvas {
    for (var i = 0; i < arguments.length; i++) {
      var obj = arguments[i];
      var index = this._objects.indexOf(obj);
      if (index !== -1) {
        this._objects.splice(index, 1);
      }
    }
    return this;
  }

  contains(object: any): boolean {
    // Use regular for loop for compatibility; avoid .includes
    for (var i = 0; i < this._objects.length; i++) {
      if (this._objects[i] === object) return true;
    }
    return false;
  }

  getObjects(): Array<any> {
    // shallow copy using a loop (no .slice or .from)
    var copy = [];
    for (var i = 0; i < this._objects.length; i++) {
      copy.push(this._objects[i]);
    }
    return copy;
  }

  getActiveObjects(): Array<any> {
    var active = [];
    for (var i = 0; i < this._objects.length; i++) {
      if (this._objects[i].activeOn) active.push(this._objects[i]);
    }
    return active;
  }

  discardActiveObject(): Canvas {
    for (var i = 0; i < this._objects.length; i++) {
      this._objects[i].activeOn = false;
    }
    return this;
  }

  getElement(): Record<string, any> {
    // cannot use document.createElement here, but pretend API is available
    return {};
  }

  getPointer(event?: MouseEvent | TouchEvent): { x: number, y: number } {
    // Return mock coordinates
    return { x: (event && 'clientX' in event && event.clientX) || 100, y: (event && 'clientY' in event && event.clientY) || 100 };
  }

  setZoom(): Canvas { return this; }
  getZoom(): number { return 1; }
  sendObjectToBack(object: any): Canvas { return this; }
  renderAll(): void {}
  requestRenderAll(): void {}
  dispose(): void {}

  // Removed all Promise usage
  withImplementation(callback?: Function): void {
    // Just directly call the callback, no async/Promise support
    if (callback && typeof callback === "function") {
      callback();
    }
  }
}

// Mock PencilBrush class
export class PencilBrush {
  width: number;
  color: string;
  canvas: Canvas;

  constructor(canvas: Canvas) {
    this.width = 1;
    this.color = "#000000";
    this.canvas = canvas;
  }
}

// Mock Line class
export class Line {
  x1: number; 
  y1: number; 
  x2: number; 
  y2: number;
  stroke: string; 
  strokeWidth: number; 
  selectable: boolean; 
  evented: boolean; 
  activeOn: boolean;

  constructor(points: number[], options?: LineOptions) {
    this.x1 = points[0] || 0;
    this.y1 = points[1] || 0;
    this.x2 = points[2] || 0;
    this.y2 = points[3] || 0;
    this.stroke = (options && options.stroke) || "#000000";
    this.strokeWidth = (options && options.strokeWidth) || 1;
    this.selectable = (options && typeof options.selectable !== "undefined") ? options.selectable : true;
    this.evented = (options && typeof options.evented !== "undefined") ? options.evented : true;
    this.activeOn = false;
  }

  set(options: Record<string, any>): Line {
    if (options) {
      for (var key in options) {
        if (Object.prototype.hasOwnProperty.call(options, key)) {
          this[key as keyof this] = options[key];
        }
      }
    }
    return this;
  }
}

export const Object = { prototype: {} };
