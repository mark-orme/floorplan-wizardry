
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
  
  // CRITICAL FIX: Ensure withImplementation returns Promise<void>
  withImplementation(callback?: Function): Promise<void> {
    console.log('MockCanvas: Using withImplementation mock');
    
    // Invoke the callback if provided 
    if (callback && typeof callback === 'function') {
      try {
        const result = callback();
        
        // If callback returns a promise, chain it
        if (result instanceof Promise) {
          return result.then(() => Promise.resolve());
        }
      } catch (error) {
        console.error('Error in withImplementation mock:', error);
      }
    }
    
    // Always return a Promise<void>
    return Promise.resolve();
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

// Export mock classes
export const Object = {
  prototype: {}
};

// For TypeScript compatibility
export type { Canvas as FabricCanvas };
export type { PencilBrush as FabricPencilBrush };
export type { Line as FabricLine };
