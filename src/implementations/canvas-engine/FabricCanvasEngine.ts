
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';
import { CanvasObject, Point } from '@/types/canvas';

export class FabricCanvasEngine {
  private canvas: FabricCanvas;
  private eventHandlers: Map<string, ((...args: any[]) => void)[]> = new Map();

  constructor(canvasElement: HTMLCanvasElement) {
    this.canvas = new FabricCanvas(canvasElement, {
      width: canvasElement.width,
      height: canvasElement.height,
      backgroundColor: '#FFFFFF',
      selection: true,
      preserveObjectStacking: true
    });
  }

  // Getter for canvas to allow read access
  public getCanvas(): FabricCanvas {
    return this.canvas;
  }

  dispose(): void {
    this.canvas.dispose();
  }

  addObject(object: CanvasObject): void {
    // Convert CanvasObject to FabricObject
    const fabricObject = this.createFabricObject(object);
    if (fabricObject) {
      this.canvas.add(fabricObject);
      this.canvas.renderAll();
    }
  }

  removeObject(id: string): void {
    const objects = this.canvas.getObjects();
    const objectToRemove = objects.find(obj => obj.id === id);
    
    if (objectToRemove) {
      this.canvas.remove(objectToRemove);
      this.canvas.renderAll();
    }
  }

  getObjects(): CanvasObject[] {
    const fabricObjects = this.canvas.getObjects();
    
    // Convert FabricObjects to CanvasObjects
    return fabricObjects.map(obj => ({
      id: obj.id as string || `obj-${Date.now()}`,
      type: obj.type as string,
      properties: obj.toObject()
    }));
  }

  createFabricObject(object: CanvasObject): FabricObject | null {
    // This is a simplified implementation
    // In a real app, you would create the appropriate Fabric.js object based on the type
    
    switch (object.type) {
      case 'line':
        if (object.points && object.points.length >= 2) {
          const [start, end] = object.points;
          return new fabric.Line([start.x, start.y, end.x, end.y], {
            stroke: object.properties?.color || 'black',
            strokeWidth: object.properties?.width || 1,
            ...object.properties
          });
        }
        break;
        
      case 'rectangle':
        if (object.points && object.points.length >= 2) {
          const [topLeft, bottomRight] = object.points;
          const width = bottomRight.x - topLeft.x;
          const height = bottomRight.y - topLeft.y;
          
          return new fabric.Rect({
            left: topLeft.x,
            top: topLeft.y,
            width: width,
            height: height,
            fill: object.properties?.fill || 'transparent',
            stroke: object.properties?.stroke || 'black',
            strokeWidth: object.properties?.strokeWidth || 1,
            ...object.properties
          });
        }
        break;
        
      // Add more cases for different object types
    }
    
    return null;
  }

  addEventListener(eventName: string, handler: (...args: any[]) => void): void {
    // Store the handler
    if (!this.eventHandlers.has(eventName)) {
      this.eventHandlers.set(eventName, []);
    }
    this.eventHandlers.get(eventName)?.push(handler);
    
    // Add the actual event listener to the Fabric canvas
    this.canvas.on(eventName as any, handler);
  }

  removeEventListener(eventName: string, handler: (...args: any[]) => void): void {
    // Remove from our handler map
    const handlers = this.eventHandlers.get(eventName);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index !== -1) {
        handlers.splice(index, 1);
      }
    }
    
    // Remove from Fabric canvas
    this.canvas.off(eventName as any, handler);
  }

  getPointerPosition(event: MouseEvent | TouchEvent): Point {
    // Convert event to Fabric pointer position
    const pointer = this.canvas.getPointer(event);
    return { x: pointer.x, y: pointer.y };
  }

  setBackgroundColor(color: string): void {
    this.canvas.setBackgroundColor(color, () => {
      this.canvas.renderAll();
    });
  }

  setZoom(zoomLevel: number): void {
    this.canvas.setZoom(zoomLevel);
    this.canvas.renderAll();
  }

  pan(deltaX: number, deltaY: number): void {
    const vpt = this.canvas.viewportTransform;
    if (vpt) {
      vpt[4] += deltaX;
      vpt[5] += deltaY;
      this.canvas.renderAll();
    }
  }

  renderAll(): void {
    this.canvas.renderAll();
  }
}
