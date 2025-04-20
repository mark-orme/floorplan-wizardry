
import { CanvasObject, Point } from '@/types/canvas';

export class MockCanvasEngine {
  private objects: CanvasObject[] = [];
  private eventHandlers: Map<string, ((...args: any[]) => void)[]> = new Map();
  private backgroundColor: string = '#FFFFFF';
  private zoomLevel: number = 1;

  // Mock implementation of FabricCanvasEngine for testing
  constructor(canvasElement?: HTMLCanvasElement) {
    // Initialize with sample objects
    this.objects = [
      {
        id: '1',
        type: 'line',
        properties: { color: 'black', width: 2 },
        options: { selectable: true }
      },
      {
        id: '2',
        type: 'rectangle',
        properties: { fill: 'transparent', stroke: 'black', strokeWidth: 1 },
        options: { selectable: true }
      }
    ];
  }

  // Getter for canvas to match FabricCanvasEngine
  public getCanvas(): any {
    // Return a mock canvas object
    return {
      getObjects: () => this.objects,
      on: this.addEventListener.bind(this),
      off: this.removeEventListener.bind(this),
      add: this.addObject.bind(this),
      remove: this.removeObject.bind(this),
      setBackgroundColor: this.setBackgroundColor.bind(this),
      renderAll: this.renderAll.bind(this),
      setZoom: this.setZoom.bind(this)
    };
  }

  dispose(): void {
    this.objects = [];
    this.eventHandlers.clear();
  }

  addObject(object: CanvasObject): void {
    this.objects.push(object);
    this.triggerEvent('object:added', { target: object });
  }

  removeObject(id: string | CanvasObject): void {
    const objectId = typeof id === 'string' ? id : id.id;
    const index = this.objects.findIndex(obj => obj.id === objectId);
    
    if (index !== -1) {
      const removed = this.objects.splice(index, 1)[0];
      this.triggerEvent('object:removed', { target: removed });
    }
  }

  getObjects(): CanvasObject[] {
    return [...this.objects];
  }

  addEventListener(eventName: string, handler: (...args: any[]) => void): void {
    if (!this.eventHandlers.has(eventName)) {
      this.eventHandlers.set(eventName, []);
    }
    this.eventHandlers.get(eventName)?.push(handler);
  }

  removeEventListener(eventName: string, handler: (...args: any[]) => void): void {
    const handlers = this.eventHandlers.get(eventName);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index !== -1) {
        handlers.splice(index, 1);
      }
    }
  }

  triggerEvent(eventName: string, data: any): void {
    const handlers = this.eventHandlers.get(eventName);
    if (handlers) {
      handlers.forEach(handler => handler(data));
    }
  }

  getPointerPosition(event: MouseEvent | TouchEvent): Point {
    // Mock implementation
    return { x: 100, y: 100 };
  }

  setBackgroundColor(color: string, callback?: () => void): void {
    this.backgroundColor = color;
    if (callback) {
      callback();
    }
  }

  setZoom(zoomLevel: number): void {
    this.zoomLevel = zoomLevel;
  }

  pan(deltaX: number, deltaY: number): void {
    // Mock implementation
  }

  renderAll(): void {
    // Mock implementation
  }
}
