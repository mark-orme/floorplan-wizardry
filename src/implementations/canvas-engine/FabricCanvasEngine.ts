
import { Canvas as FabricCanvas } from 'fabric';
import { ICanvasEngine } from '@/interfaces/canvas-engine/ICanvasEngine';
import { Point, DrawOptions, CanvasObject, StrokeStyle } from '@/types/canvas';

export class FabricCanvasEngine implements ICanvasEngine {
  private canvas: FabricCanvas;
  
  constructor(canvasElement: HTMLCanvasElement) {
    this.canvas = new FabricCanvas(canvasElement, {
      width: 800,
      height: 600,
      backgroundColor: '#ffffff',
      renderOnAddRemove: false
    });
  }
  
  drawLine(points: Point[], options: DrawOptions): void {
    // ... Implementation using Fabric.js
  }
  
  drawShape(points: Point[], options: DrawOptions): void {
    // ... Implementation using Fabric.js
  }
  
  clear(): void {
    this.canvas.clear();
    this.canvas.backgroundColor = '#ffffff';
    this.canvas.renderAll();
  }
  
  undo(): void {
    // ... Implementation using Fabric.js history
  }
  
  redo(): void {
    // ... Implementation using Fabric.js history
  }
  
  addObject(object: CanvasObject): void {
    this.canvas.add(object as any);
    this.canvas.renderAll();
  }
  
  removeObject(object: CanvasObject): void {
    this.canvas.remove(object as any);
    this.canvas.renderAll();
  }
  
  updateObject(object: CanvasObject): void {
    this.canvas.renderAll();
  }
  
  getObjects(): CanvasObject[] {
    return this.canvas.getObjects();
  }
  
  getCanvasState(): any {
    return this.canvas.toJSON();
  }
  
  setCanvasState(state: any): void {
    this.canvas.loadFromJSON(state, () => {
      this.canvas.renderAll();
    });
  }
  
  setStrokeStyle(style: StrokeStyle): void {
    if (this.canvas.freeDrawingBrush) {
      this.canvas.freeDrawingBrush.color = style.color;
      this.canvas.freeDrawingBrush.width = style.width;
    }
  }
  
  setZoom(level: number): void {
    this.canvas.setZoom(level);
    this.canvas.renderAll();
  }
  
  setPan(x: number, y: number): void {
    this.canvas.absolutePan({ x, y });
    this.canvas.renderAll();
  }
  
  on(event: string, callback: Function): void {
    this.canvas.on(event, callback as any);
  }
  
  off(event: string, callback: Function): void {
    this.canvas.off(event, callback as any);
  }
  
  dispose(): void {
    this.canvas.dispose();
  }
}
