
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';
import { ICanvasEngine } from '@/interfaces/canvas-engine/ICanvasEngine';
import { Point, DrawOptions, CanvasObject, StrokeStyle } from '@/types/canvas';

export class FabricCanvasEngine implements ICanvasEngine {
  private canvas: FabricCanvas;
  private history: { past: any[], future: any[] } = { past: [], future: [] };
  private strokeStyle: StrokeStyle = { color: '#000000', width: 2, opacity: 1 };

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = new FabricCanvas(canvas, {
      selection: true,
      preserveObjectStacking: true
    });
    this.setupEventListeners();
  }

  // Helper method to get the canvas instance (needed by other components)
  getCanvas(): FabricCanvas {
    return this.canvas;
  }

  // Core drawing operations
  drawLine(points: Point[], options: DrawOptions): void {
    const line = new fabric.Line([
      points[0].x, points[0].y, 
      points[1].x, points[1].y
    ], {
      stroke: options.color || this.strokeStyle.color,
      strokeWidth: options.width || this.strokeStyle.width,
      opacity: options.opacity || this.strokeStyle.opacity,
      selectable: true,
      evented: true
    });
    
    this.canvas.add(line);
    this.canvas.renderAll();
    this.saveState();
  }

  drawShape(points: Point[], options: DrawOptions): void {
    const polygon = new fabric.Polygon(points.map(p => ({ x: p.x, y: p.y })), {
      fill: 'transparent',
      stroke: options.color || this.strokeStyle.color,
      strokeWidth: options.width || this.strokeStyle.width,
      opacity: options.opacity || this.strokeStyle.opacity,
      selectable: true,
      evented: true
    });
    
    this.canvas.add(polygon);
    this.canvas.renderAll();
    this.saveState();
  }

  // Canvas state management
  clear(): void {
    this.canvas.clear();
    this.saveState();
  }

  undo(): void {
    if (this.history.past.length === 0) return;
    
    const currentState = this.canvas.toJSON();
    this.history.future.push(currentState);
    
    const prevState = this.history.past.pop();
    this.canvas.loadFromJSON(prevState, () => {
      this.canvas.renderAll();
    });
  }

  redo(): void {
    if (this.history.future.length === 0) return;
    
    const currentState = this.canvas.toJSON();
    this.history.past.push(currentState);
    
    const nextState = this.history.future.pop();
    this.canvas.loadFromJSON(nextState, () => {
      this.canvas.renderAll();
    });
  }

  // Object manipulation
  addObject(object: CanvasObject): void {
    // Implementation depends on object type
    console.log('Adding object:', object.type);
    this.saveState();
  }

  removeObject(object: CanvasObject): void {
    const canvasObject = this.canvas.getObjects().find(obj => {
      return (obj as any).id === object.id;
    });
    
    if (canvasObject) {
      this.canvas.remove(canvasObject);
      this.canvas.renderAll();
      this.saveState();
    }
  }

  updateObject(object: CanvasObject): void {
    const canvasObject = this.canvas.getObjects().find(obj => {
      return (obj as any).id === object.id;
    });
    
    if (canvasObject) {
      // Update object properties
      Object.assign(canvasObject, object.options);
      this.canvas.renderAll();
      this.saveState();
    }
  }

  // Canvas state
  getObjects(): CanvasObject[] {
    return this.canvas.getObjects().map(obj => {
      return {
        id: (obj as any).id || '',
        type: obj.type || '',
        properties: obj.toObject()
      };
    });
  }

  getCanvasState(): any {
    return this.canvas.toJSON();
  }

  setCanvasState(state: any): void {
    this.canvas.loadFromJSON(state, () => {
      this.canvas.renderAll();
    });
  }

  // Style management
  setStrokeStyle(style: StrokeStyle): void {
    this.strokeStyle = { ...this.strokeStyle, ...style };
    
    if (this.canvas.isDrawingMode && this.canvas.freeDrawingBrush) {
      this.canvas.freeDrawingBrush.color = style.color;
      this.canvas.freeDrawingBrush.width = style.width;
      // Not all brush types support opacity
      if ('opacity' in this.canvas.freeDrawingBrush) {
        (this.canvas.freeDrawingBrush as any).opacity = style.opacity;
      }
    }
  }

  // Zoom and pan
  setZoom(level: number): void {
    this.canvas.setZoom(level);
    this.canvas.renderAll();
  }

  setPan(x: number, y: number): void {
    this.canvas.relativePan({ x, y } as fabric.Point);
    this.canvas.renderAll();
  }

  // Event handlers
  on(event: string, callback: Function): void {
    this.canvas.on(event, callback as any);
  }

  off(event: string, callback: Function): void {
    this.canvas.off(event, callback as any);
  }

  // Cleanup
  dispose(): void {
    this.canvas.dispose();
  }

  // Private methods
  private setupEventListeners(): void {
    this.canvas.on('object:modified', () => this.saveState());
    this.canvas.on('object:added', () => this.saveState());
    this.canvas.on('object:removed', () => this.saveState());
  }

  private saveState(): void {
    const jsonData = this.canvas.toJSON();
    this.history.past.push(jsonData);
    this.history.future = [];
    
    // Limit history size
    if (this.history.past.length > 30) {
      this.history.past.shift();
    }
  }
}
