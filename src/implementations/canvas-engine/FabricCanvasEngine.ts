
import { Canvas as FabricCanvas, Point as FabricPoint, Object as FabricObject } from 'fabric';
import { ICanvasEngine } from '@/interfaces/canvas-engine/ICanvasEngine';
import { Point, DrawOptions, CanvasObject, StrokeStyle, CanvasEvents } from '@/types/canvas';

export class FabricCanvasEngine implements ICanvasEngine {
  private canvas: FabricCanvas;
  private eventHandlers: Record<string, Function[]> = {};

  constructor(canvasElement: HTMLCanvasElement) {
    this.canvas = new FabricCanvas(canvasElement);
    this.canvas.selection = false; // Disable selection by default
  }

  // Get the internal Fabric.js canvas instance
  getCanvas(): FabricCanvas {
    return this.canvas;
  }

  // Drawing operations
  drawLine(points: Point[], options: DrawOptions): void {
    if (points.length < 2) return;
    
    const line = new fabric.Line([
      points[0].x, 
      points[0].y, 
      points[1].x, 
      points[1].y
    ], {
      stroke: options.color,
      strokeWidth: options.width,
      opacity: options.opacity || 1,
      selectable: true
    });
    
    this.canvas.add(line);
    this.canvas.renderAll();
    
    this.triggerEvent('object:added', { target: this.convertToCanvasObject(line) });
  }

  drawShape(points: Point[], options: DrawOptions): void {
    if (points.length < 3) return;
    
    const fabricPoints = points.map(p => new fabric.Point(p.x, p.y));
    const polygon = new fabric.Polygon(fabricPoints, {
      fill: 'transparent',
      stroke: options.color,
      strokeWidth: options.width,
      opacity: options.opacity || 1,
      selectable: true
    });
    
    this.canvas.add(polygon);
    this.canvas.renderAll();
    
    this.triggerEvent('object:added', { target: this.convertToCanvasObject(polygon) });
  }

  // Canvas state management
  clear(): void {
    this.canvas.clear();
    this.triggerEvent('canvas:cleared', {});
  }

  undo(): void {
    // Undo implementation would go here
    console.log('Undo operation');
  }

  redo(): void {
    // Redo implementation would go here
    console.log('Redo operation');
  }

  // Object manipulation
  addObject(object: CanvasObject): void {
    // Implementation for adding objects
    console.log('Add object operation', object);
  }

  removeObject(object: CanvasObject): void {
    // Implementation for removing objects
    console.log('Remove object operation', object);
  }

  updateObject(object: CanvasObject): void {
    // Implementation for updating objects
    console.log('Update object operation', object);
  }

  // Canvas state
  getObjects(): CanvasObject[] {
    return this.canvas.getObjects().map(this.convertToCanvasObject);
  }

  getCanvasState(): any {
    return this.canvas.toJSON(['id', 'objectType']);
  }

  setCanvasState(state: any): void {
    this.canvas.loadFromJSON(state, () => {
      this.canvas.renderAll();
    });
  }

  // Style management
  setStrokeStyle(style: StrokeStyle): void {
    // Implementation for setting stroke style
    console.log('Set stroke style operation', style);
  }

  // Zoom and pan
  setZoom(level: number): void {
    this.canvas.setZoom(level);
    this.canvas.renderAll();
  }

  setPan(x: number, y: number): void {
    this.canvas.absolutePan(new fabric.Point(x, y));
    this.canvas.renderAll();
  }

  // Event handlers
  on(event: string, callback: Function): void {
    if (!this.eventHandlers[event]) {
      this.eventHandlers[event] = [];
    }
    this.eventHandlers[event].push(callback);
  }

  off(event: string, callback: Function): void {
    if (!this.eventHandlers[event]) return;
    
    this.eventHandlers[event] = this.eventHandlers[event].filter(
      handler => handler !== callback
    );
  }

  // Cleanup
  dispose(): void {
    this.canvas.dispose();
    this.eventHandlers = {};
  }

  // Helper to trigger events
  private triggerEvent(event: string, data: any): void {
    if (!this.eventHandlers[event]) return;
    
    for (const handler of this.eventHandlers[event]) {
      handler(data);
    }
  }

  // Helper to convert Fabric objects to CanvasObject
  private convertToCanvasObject(fabricObject: FabricObject): CanvasObject {
    return {
      id: fabricObject.data?.id || `obj-${Date.now()}`,
      type: fabricObject.data?.type || 'unknown',
      properties: { 
        ...fabricObject.toObject(['left', 'top', 'width', 'height']),
        objectType: fabricObject.data?.objectType
      }
    };
  }
}
