
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';
import { ICanvasEngine } from '@/interfaces/canvas-engine/ICanvasEngine';
import { Point, DrawOptions, CanvasObject, StrokeStyle } from '@/types/canvas';

export class FabricCanvasEngine implements ICanvasEngine {
  private _canvas: FabricCanvas;
  
  constructor(canvasElement: HTMLCanvasElement) {
    this._canvas = new FabricCanvas(canvasElement, {
      width: 800,
      height: 600,
      backgroundColor: '#ffffff',
      renderOnAddRemove: false
    });
  }
  
  // Getter for canvas to allow access but maintain encapsulation
  getCanvas(): FabricCanvas {
    return this._canvas;
  }
  
  drawLine(points: Point[], options: DrawOptions): void {
    // Implementation using Fabric.js
  }
  
  drawShape(points: Point[], options: DrawOptions): void {
    // Implementation using Fabric.js
  }
  
  clear(): void {
    this._canvas.clear();
    this._canvas.backgroundColor = '#ffffff';
    this._canvas.renderAll();
  }
  
  undo(): void {
    // Implementation using Fabric.js history
  }
  
  redo(): void {
    // Implementation using Fabric.js history
  }
  
  addObject(object: CanvasObject): void {
    // Convert to FabricObject before adding
    const fabricObject = object as unknown as FabricObject;
    this._canvas.add(fabricObject);
    this._canvas.renderAll();
  }
  
  removeObject(object: CanvasObject): void {
    const fabricObject = object as unknown as FabricObject;
    this._canvas.remove(fabricObject);
    this._canvas.renderAll();
  }
  
  updateObject(object: CanvasObject): void {
    this._canvas.renderAll();
  }
  
  getObjects(): CanvasObject[] {
    // Convert fabric objects to our CanvasObject type
    const objects = this._canvas.getObjects();
    return objects.map(obj => {
      return {
        id: (obj as any).id || `obj-${Date.now()}`,
        type: (obj as any).type || 'unknown',
        properties: {}
      };
    });
  }
  
  getCanvasState(): any {
    return this._canvas.toJSON();
  }
  
  setCanvasState(state: any): void {
    this._canvas.loadFromJSON(state, () => {
      this._canvas.renderAll();
    });
  }
  
  setStrokeStyle(style: StrokeStyle): void {
    if (this._canvas.freeDrawingBrush) {
      this._canvas.freeDrawingBrush.color = style.color;
      this._canvas.freeDrawingBrush.width = style.width;
    }
  }
  
  setZoom(level: number): void {
    this._canvas.setZoom(level);
    this._canvas.renderAll();
  }
  
  setPan(x: number, y: number): void {
    // Use proper Point type conversion
    const point = { x, y };
    this._canvas.absolutePan(point as any);
    this._canvas.renderAll();
  }
  
  on(event: string, callback: Function): void {
    // Type safe event handling
    this._canvas.on(event as any, callback as any);
  }
  
  off(event: string, callback: Function): void {
    // Type safe event handling
    this._canvas.off(event as any, callback as any);
  }
  
  dispose(): void {
    this._canvas.dispose();
  }
}
