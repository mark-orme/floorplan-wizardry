
import { Canvas, Object as FabricObject, Line, Rect, Circle, Path, IObjectOptions } from 'fabric';
import { CanvasObject, Point, DrawOptions, StrokeStyle } from '@/types/canvas';
import { ICanvasEngine } from '@/interfaces/canvas-engine/ICanvasEngine';

export class FabricCanvasEngine implements ICanvasEngine {
  private canvas: Canvas | null = null;
  private eventHandlers: Record<string, Function[]> = {};

  constructor(canvasElement: HTMLCanvasElement) {
    this.canvas = new Canvas(canvasElement, {
      width: canvasElement.width,
      height: canvasElement.height,
      selection: true,
      backgroundColor: '#ffffff'
    });
  }

  public getCanvas(): Canvas | null {
    return this.canvas;
  }

  public dispose(): void {
    if (this.canvas) {
      this.canvas.dispose();
      this.canvas = null;
    }
    this.eventHandlers = {};
  }

  public drawLine(points: Point[], options: DrawOptions): void {
    if (!this.canvas || points.length < 2) return;

    const line = new Line(
      [points[0].x, points[0].y, points[1].x, points[1].y],
      {
        stroke: options.color,
        strokeWidth: options.width,
        opacity: options.opacity || 1,
        selectable: true,
        evented: true
      }
    );

    this.canvas.add(line);
    this.canvas.renderAll();
  }

  public drawShape(points: Point[], options: DrawOptions): void {
    if (!this.canvas || points.length < 3) return;
    
    const pathData = points.map((point, i) => 
      (i === 0 ? 'M' : 'L') + point.x + ' ' + point.y
    ).join(' ') + ' Z';
    
    const path = new Path(pathData, {
      fill: 'transparent',
      stroke: options.color,
      strokeWidth: options.width,
      opacity: options.opacity || 1
    });
    
    this.canvas.add(path);
    this.canvas.renderAll();
  }

  public clear(): void {
    if (!this.canvas) return;
    this.canvas.clear();
    this.canvas.renderAll();
  }

  public undo(): void {
    // Implement undo logic
    console.log('Undo not implemented');
  }

  public redo(): void {
    // Implement redo logic
    console.log('Redo not implemented');
  }

  public addObject(object: CanvasObject): void {
    if (!this.canvas) return;
    
    // Convert CanvasObject to FabricObject
    // This is a simplified implementation
    const fabricObject = this.createFabricObject(object);
    if (fabricObject) {
      this.canvas.add(fabricObject);
      this.canvas.renderAll();
    }
  }

  private createFabricObject(object: CanvasObject): FabricObject | null {
    // Simplified implementation
    return null;
  }

  public removeObject(object: CanvasObject): void {
    if (!this.canvas) return;
    
    // Find and remove object by id
    const objects = this.canvas.getObjects();
    const targetObject = objects.find(obj => obj.data?.id === object.id);
    
    if (targetObject) {
      this.canvas.remove(targetObject);
      this.canvas.renderAll();
    }
  }

  public updateObject(object: CanvasObject): void {
    // Implement update logic
    console.log('Update object not implemented');
  }

  public getObjects(): CanvasObject[] {
    if (!this.canvas) return [];
    
    // Convert FabricObject[] to CanvasObject[]
    // This is a simplified implementation
    return [];
  }

  public getCanvasState(): any {
    if (!this.canvas) return null;
    return this.canvas.toJSON();
  }

  public setCanvasState(state: any): void {
    if (!this.canvas) return;
    this.canvas.loadFromJSON(state, () => {
      this.canvas?.renderAll();
    });
  }

  public setStrokeStyle(style: StrokeStyle): void {
    if (!this.canvas) return;
    
    if (this.canvas.isDrawingMode && this.canvas.freeDrawingBrush) {
      this.canvas.freeDrawingBrush.color = style.color;
      this.canvas.freeDrawingBrush.width = style.width;
      this.canvas.freeDrawingBrush.opacity = style.opacity;
    }
  }

  public setZoom(level: number): void {
    if (!this.canvas) return;
    this.canvas.setZoom(level);
    this.canvas.renderAll();
  }

  public setPan(x: number, y: number): void {
    if (!this.canvas) return;
    this.canvas.relativePan({ x, y });
    this.canvas.renderAll();
  }

  public on(event: string, callback: Function): void {
    if (!this.canvas) return;

    if (!this.eventHandlers[event]) {
      this.eventHandlers[event] = [];
    }

    this.eventHandlers[event].push(callback);

    this.canvas.on(event as any, (e: any) => {
      const handlers = this.eventHandlers[event] || [];
      handlers.forEach(handler => handler(e));
    });
  }

  public off(event: string, callback: Function): void {
    if (!this.canvas) return;

    if (this.eventHandlers[event]) {
      this.eventHandlers[event] = this.eventHandlers[event].filter(
        handler => handler !== callback
      );
      
      if (this.eventHandlers[event].length === 0) {
        this.canvas.off(event as any);
      }
    }
  }
}
