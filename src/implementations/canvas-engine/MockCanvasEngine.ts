
import { ICanvasEngine } from '@/interfaces/canvas-engine/ICanvasEngine';
import { Point, DrawOptions, CanvasObject, StrokeStyle } from '@/types/canvas';

export class MockCanvasEngine implements ICanvasEngine {
  private objects: CanvasObject[] = [];
  private eventHandlers: Record<string, Function[]> = {};

  // Drawing operations
  drawLine(points: Point[], options: DrawOptions): void {
    const object: CanvasObject = {
      id: `line-${Date.now()}`,
      type: 'line',
      points: points,
      properties: { stroke: options.color, strokeWidth: options.width }
    };
    
    this.objects.push(object);
    this.triggerEvent('object:added', { target: object });
  }

  drawShape(points: Point[], options: DrawOptions): void {
    const object: CanvasObject = {
      id: `shape-${Date.now()}`,
      type: 'polygon',
      points: points,
      properties: { stroke: options.color, strokeWidth: options.width }
    };
    
    this.objects.push(object);
    this.triggerEvent('object:added', { target: object });
  }

  // Canvas state management
  clear(): void {
    this.objects = [];
    this.triggerEvent('canvas:cleared', {});
  }

  undo(): void {
    console.log('Undo operation');
  }

  redo(): void {
    console.log('Redo operation');
  }

  // Object manipulation
  addObject(object: CanvasObject): void {
    this.objects.push(object);
    this.triggerEvent('object:added', { target: object });
  }

  removeObject(object: CanvasObject): void {
    this.objects = this.objects.filter(obj => obj.id !== object.id);
    this.triggerEvent('object:removed', { target: object });
  }

  updateObject(object: CanvasObject): void {
    const index = this.objects.findIndex(obj => obj.id === object.id);
    if (index !== -1) {
      this.objects[index] = object;
      this.triggerEvent('object:modified', { target: object });
    }
  }

  // Canvas state
  getObjects(): CanvasObject[] {
    return [...this.objects];
  }

  getCanvasState(): any {
    return { objects: this.objects };
  }

  setCanvasState(state: any): void {
    if (state && Array.isArray(state.objects)) {
      this.objects = [...state.objects];
    }
  }

  // Style management
  setStrokeStyle(style: StrokeStyle): void {
    console.log('Set stroke style operation', style);
  }

  // Zoom and pan
  setZoom(level: number): void {
    console.log('Set zoom level', level);
  }

  setPan(x: number, y: number): void {
    console.log('Set pan', x, y);
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
    this.objects = [];
    this.eventHandlers = {};
  }

  // Helper to trigger events
  private triggerEvent(event: string, data: any): void {
    if (!this.eventHandlers[event]) return;
    
    for (const handler of this.eventHandlers[event]) {
      handler(data);
    }
  }
}
