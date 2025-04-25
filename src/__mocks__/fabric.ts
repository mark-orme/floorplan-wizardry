
/**
 * Mock for fabric.js
 * SAFE FOR ES5-ONLY ENVIRONMENT
 */

// Mock Canvas class
export class Canvas {
  width;
  height;
  selection;
  isDrawingMode;
  defaultCursor;
  hoverCursor;
  freeDrawingBrush;
  _objects;

  constructor(element, options) {
    this.width = options && options.width || 600;
    this.height = options && options.height || 400;
    this.selection = options && typeof options.selection !== "undefined" ? options.selection : true;
    this.isDrawingMode = false;
    this.defaultCursor = "default";
    this.hoverCursor = "pointer";
    this._objects = [];
    this.freeDrawingBrush = new PencilBrush(this);
  }

  add() {
    for (var i = 0; i < arguments.length; i++) {
      this._objects.push(arguments[i]);
    }
    return this;
  }

  remove() {
    for (var i = 0; i < arguments.length; i++) {
      var obj = arguments[i];
      var index = this._objects.indexOf(obj);
      if (index !== -1) {
        this._objects.splice(index, 1);
      }
    }
    return this;
  }

  contains(object) {
    // Use regular for loop for compatibility; avoid .includes
    for (var i = 0; i < this._objects.length; i++) {
      if (this._objects[i] === object) return true;
    }
    return false;
  }

  getObjects() {
    // shallow copy using a loop (no .slice or .from)
    var copy = [];
    for (var i = 0; i < this._objects.length; i++) {
      copy.push(this._objects[i]);
    }
    return copy;
  }

  getActiveObjects() {
    var active = [];
    for (var i = 0; i < this._objects.length; i++) {
      if (this._objects[i].activeOn) active.push(this._objects[i]);
    }
    return active;
  }

  discardActiveObject() {
    for (var i = 0; i < this._objects.length; i++) {
      this._objects[i].activeOn = false;
    }
    return this;
  }

  getElement() {
    // cannot use document.createElement here, but pretend API is available
    return {};
  }

  getPointer(event) {
    // Return mock coordinates
    return { x: (event && event.clientX) || 100, y: (event && event.clientY) || 100 };
  }

  setZoom() { return this; }
  getZoom() { return 1; }
  sendObjectToBack(object) { return this; }
  renderAll() {}
  requestRenderAll() {}
  dispose() {}

  // Removed all Promise usage
  withImplementation(callback) {
    // Just directly call the callback, no async/Promise support
    if (callback && typeof callback === "function") {
      callback();
    }
  }
}

// Mock PencilBrush class
export class PencilBrush {
  width;
  color;
  canvas;

  constructor(canvas) {
    this.width = 1;
    this.color = "#000000";
    this.canvas = canvas;
  }
}

// Mock Line class
export class Line {
  x1; y1; x2; y2;
  stroke; strokeWidth; selectable; evented; activeOn;

  constructor(points, options) {
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

  set(options) {
    if (options) {
      for (var key in options) {
        if (Object.prototype.hasOwnProperty.call(options, key)) {
          this[key] = options[key];
        }
      }
    }
    return this;
  }
}

export const Object = { prototype: {} };

