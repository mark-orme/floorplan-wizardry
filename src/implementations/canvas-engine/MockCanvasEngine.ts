
import { ICanvasEngine } from '@/interfaces/canvas-engine/ICanvasEngine';
import { Point, DrawOptions, CanvasObject, StrokeStyle } from '@/types/canvas';

export class MockCanvasEngine implements ICanvasEngine {
  private objects: CanvasObject[] = [];
  private history: any[] = [];
  private currentZoom = 1;
  private eventHandlers: Map<string, Function[]> = new Map();
  
  drawLine(points: Point[], options: DrawOptions): void {
    this.objects.push({ type: 'line', points, options });
    this.emit('object:added', { target: this.objects[this.objects.length - 1] });
  }
  
  drawShape(points: Point[], options: DrawOptions): void {
    this.objects.push({ type: 'shape', points, options });
    this.emit('object:added', { target: this.objects[this.objects.length - 1] });
  }
  
  clear(): void {
    this.objects = [];
    this.emit('canvas:cleared');
  }
  
  undo(): void {
    if (this.history.length > 0) {
      this.history.pop();
      this.emit('history:changed');
    }
  }
  
  redo(): void {
    // Mock implementation
  }
  
  addObject(object: CanvasObject): void {
    this.objects.push(object);
    this.emit('object:added', { target: object });
  }
  
  removeObject(object: CanvasObject): void {
    const index = this.objects.indexOf(object);
    if (index > -1) {
      this.objects.splice(index, 1);
      this.emit('object:removed', { target: object });
    }
  }
  
  updateObject(object: CanvasObject): void {
    const index = this.objects.indexOf(object);
    if (index > -1) {
      this.objects[index] = { ...object };
      this.emit('object:modified', { target: object });
    }
  }
  
  getObjects(): CanvasObject[] {
    return [...this.objects];
  }
  
  getCanvasState(): any {
    return {
      objects: this.objects,
      zoom: this.currentZoom
    };
  }
  
  setCanvasState(state: any): void {
    this.objects = state.objects || [];
    this.currentZoom = state.zoom || 1;
    this.emit('canvas:loaded');
  }
  
  setStrokeStyle(style: StrokeStyle): void {
    // Mock implementation
  }
  
  setZoom(level: number): void {
    this.currentZoom = level;
    this.emit('zoom:changed', { zoom: level });
  }
  
  setPan(x: number, y: number): void {
    this.emit('pan:changed', { x, y });
  }
  
  on(event: string, callback: Function): void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, []);
    }
    this.eventHandlers.get(event)?.push(callback);
  }
  
  off(event: string, callback: Function): void {
    const handlers = this.eventHandlers.get(event) || [];
    const index = handlers.indexOf(callback);
    if (index > -1) {
      handlers.splice(index, 1);
    }
  }
  
  dispose(): void {
    this.eventHandlers.clear();
    this.objects = [];
    this.history = [];
  }
  
  private emit(event: string, data?: any): void {
    const handlers = this.eventHandlers.get(event) || [];
    handlers.forEach(handler => handler(data));
  }
}
