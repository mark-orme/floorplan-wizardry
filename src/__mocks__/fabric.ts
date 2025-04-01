
/**
 * Mock for fabric.js
 * For use in testing to avoid instantiating actual canvas
 * @module __mocks__/fabric
 */

// Mock Canvas class
export class Canvas {
  width: number;
  height: number;
  selection: boolean;
  isDrawingMode: boolean;
  defaultCursor: string;
  hoverCursor: string;
  freeDrawingBrush: PencilBrush;
  _objects: any[];
  
  constructor(element: HTMLCanvasElement | string, options?: any) {
    this.width = options?.width || 600;
    this.height = options?.height || 400;
    this.selection = options?.selection ?? true;
    this.isDrawingMode = false;
    this.defaultCursor = 'default';
    this.hoverCursor = 'pointer';
    this._objects = [];
    this.freeDrawingBrush = new PencilBrush(this);
  }
  
  add(...objects: any[]): Canvas {
    this._objects.push(...objects);
    return this;
  }
  
  remove(...objects: any[]): Canvas {
    objects.forEach(obj => {
      const index = this._objects.indexOf(obj);
      if (index !== -1) {
        this._objects.splice(index, 1);
      }
    });
    return this;
  }
  
  contains(object: any): boolean {
    return this._objects.includes(object);
  }
  
  getObjects(): any[] {
    return [...this._objects];
  }
  
  getActiveObjects(): any[] {
    return this._objects.filter(obj => obj.activeOn);
  }
  
  discardActiveObject(): Canvas {
    this._objects.forEach(obj => {
      obj.activeOn = false;
    });
    return this;
  }
  
  getElement(): HTMLCanvasElement {
    return document.createElement('canvas');
  }
  
  getPointer(event: any): { x: number; y: number } {
    // For tests, convert clientX/Y to canvas coordinates
    // or just return mock coordinates
    return { x: event.clientX || 100, y: event.clientY || 100 };
  }
  
  setZoom(zoom: number): Canvas {
    // Mock zoom implementation
    return this;
  }
  
  getZoom(): number {
    return 1;
  }
  
  sendObjectToBack(object: any): Canvas {
    // Mock implementation
    return this;
  }
  
  renderAll(): void {
    // Mock implementation
  }
  
  requestRenderAll(): void {
    // Mock implementation
  }
  
  dispose(): void {
    // Mock implementation
  }
}

// Mock PencilBrush class
export class PencilBrush {
  width: number;
  color: string;
  canvas: Canvas;
  
  constructor(canvas: Canvas) {
    this.width = 1;
    this.color = '#000000';
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
  
  constructor(points: number[], options?: any) {
    this.x1 = points[0] || 0;
    this.y1 = points[1] || 0;
    this.x2 = points[2] || 0;
    this.y2 = points[3] || 0;
    this.stroke = options?.stroke || '#000000';
    this.strokeWidth = options?.strokeWidth || 1;
    this.selectable = options?.selectable ?? true;
    this.evented = options?.evented ?? true;
    this.activeOn = false;
  }
  
  set(options: any): Line {
    // Replace Object.assign with manual property assignment
    if (options) {
      // Manual assignment of properties
      for (const key in options) {
        if (Object.prototype.hasOwnProperty.call(options, key)) {
          (this as any)[key] = options[key];
        }
      }
    }
    return this;
  }
}

// Mock Circle class
export class Circle {
  left: number;
  top: number;
  radius: number;
  fill: string;
  stroke: string;
  strokeWidth: number;
  activeOn: boolean;
  
  constructor(options?: any) {
    this.left = options?.left || 0;
    this.top = options?.top || 0;
    this.radius = options?.radius || 20;
    this.fill = options?.fill || 'transparent';
    this.stroke = options?.stroke || '#000000';
    this.strokeWidth = options?.strokeWidth || 1;
    this.activeOn = false;
  }
  
  set(options: any): Circle {
    // Replace Object.assign with manual property assignment
    if (options) {
      // Manual assignment of properties
      for (const key in options) {
        if (Object.prototype.hasOwnProperty.call(options, key)) {
          (this as any)[key] = options[key];
        }
      }
    }
    return this;
  }
}

// Mock Text class
export class Text {
  text: string;
  left: number;
  top: number;
  fontSize: number;
  fill: string;
  activeOn: boolean;
  
  constructor(text: string, options?: any) {
    this.text = text;
    this.left = options?.left || 0;
    this.top = options?.top || 0;
    this.fontSize = options?.fontSize || 14;
    this.fill = options?.fill || '#000000';
    this.activeOn = false;
  }
  
  set(options: any): Text {
    // Replace Object.assign with manual property assignment
    if (options) {
      // Manual assignment of properties
      for (const key in options) {
        if (Object.prototype.hasOwnProperty.call(options, key)) {
          (this as any)[key] = options[key];
        }
      }
    }
    return this;
  }
}

// Export mock classes
export const Object = {
  prototype: {}
};

// For TypeScript compatibility
export type { Canvas as FabricCanvas };
export type { PencilBrush as FabricPencilBrush };
export type { Line as FabricLine };
export type { Circle as FabricCircle };
export type { Text as FabricText };
