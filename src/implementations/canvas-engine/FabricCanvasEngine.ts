
import { Canvas, Object as FabricObject, IEvent } from 'fabric';
import { CanvasObject, Point, DrawOptions } from '@/types/canvas';

export class FabricCanvasEngine {
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

  public dispose(): void {
    if (this.canvas) {
      this.canvas.dispose();
      this.canvas = null;
    }
    this.eventHandlers = {};
  }

  public drawLine(start: Point, end: Point, options: DrawOptions): string {
    if (!this.canvas) return '';

    const line = new FabricObject.Line(
      [start.x, start.y, end.x, end.y],
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

    return line.id?.toString() || '';
  }

  public drawRect(left: number, top: number, width: number, height: number, options: DrawOptions): string {
    if (!this.canvas) return '';

    const rect = new FabricObject.Rect({
      left,
      top,
      width,
      height,
      fill: 'transparent',
      stroke: options.color,
      strokeWidth: options.width,
      opacity: options.opacity || 1,
      selectable: true,
      evented: true
    });

    this.canvas.add(rect);
    this.canvas.renderAll();

    return rect.id?.toString() || '';
  }

  public removeObject(id: string): void {
    if (!this.canvas) return;

    const objects = this.canvas.getObjects();
    const object = objects.find(obj => obj.id === id);
    
    if (object) {
      this.canvas.remove(object);
      this.canvas.renderAll();
    }
  }

  public addEventListener(eventType: string, callback: Function): void {
    if (!this.canvas) return;

    if (!this.eventHandlers[eventType]) {
      this.eventHandlers[eventType] = [];
    }

    this.eventHandlers[eventType].push(callback);

    this.canvas.on(eventType as any, (e: IEvent) => {
      const handlers = this.eventHandlers[eventType] || [];
      handlers.forEach(handler => handler(e));
    });
  }

  public removeEventListener(eventType: string, callback: Function): void {
    if (!this.canvas) return;

    if (this.eventHandlers[eventType]) {
      this.eventHandlers[eventType] = this.eventHandlers[eventType].filter(
        handler => handler !== callback
      );
      
      if (this.eventHandlers[eventType].length === 0) {
        this.canvas.off(eventType as any);
      }
    }
  }
}
