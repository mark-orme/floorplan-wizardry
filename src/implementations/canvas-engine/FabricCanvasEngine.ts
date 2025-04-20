
import { CanvasEngine } from './CanvasEngine';
import { Canvas as FabricCanvas, Object as FabricObject, Point } from 'fabric';

// Define simple point interface to use within this file
interface SimplePoint {
  x: number;
  y: number;
}

export class FabricCanvasEngine implements CanvasEngine {
  private canvas: FabricCanvas | null = null;
  private objectMap: Map<string, FabricObject> = new Map();
  private defaultOptions = {
    stroke: '#000000',
    strokeWidth: 2,
    fill: 'transparent',
    selectable: true,
    hasControls: true,
    hasBorders: true
  };

  constructor(canvasElement: HTMLCanvasElement | null) {
    if (canvasElement) {
      this.initializeCanvas(canvasElement);
    }
  }

  private initializeCanvas(element: HTMLCanvasElement): void {
    try {
      this.canvas = new FabricCanvas(element, {
        width: element.width,
        height: element.height,
        selection: true,
        preserveObjectStacking: true,
        renderOnAddRemove: true,
        stopContextMenu: true
      });
      
      console.log('FabricCanvasEngine: Canvas initialized');
    } catch (error) {
      console.error('FabricCanvasEngine: Error initializing canvas', error);
      throw error;
    }
  }

  getCanvas(): FabricCanvas | null {
    return this.canvas;
  }

  clear(): void {
    if (!this.canvas) return;
    this.canvas.clear();
    this.objectMap.clear();
  }

  refresh(): void {
    if (!this.canvas) return;
    this.canvas.requestRenderAll();
  }

  resize(width: number, height: number): void {
    if (!this.canvas) return;
    this.canvas.setWidth(width);
    this.canvas.setHeight(height);
    this.canvas.requestRenderAll();
  }

  /* Drawing Methods */
  
  drawRectangle(
    id: string,
    x: number,
    y: number,
    width: number,
    height: number,
    options: any = {}
  ): void {
    if (!this.canvas) return;
    
    try {
      // Use fabric.js Rect class
      const rect = new fabric.Rect({
        left: x,
        top: y,
        width: width,
        height: height,
        ...this.defaultOptions,
        ...options,
        id
      });
      
      this.canvas.add(rect);
      this.objectMap.set(id, rect);
    } catch (error) {
      console.error('Error creating rectangle:', error);
    }
  }

  drawCircle(
    id: string,
    x: number,
    y: number,
    radius: number,
    options: any = {}
  ): void {
    if (!this.canvas) return;
    
    try {
      // Use fabric.js Circle class
      const circle = new fabric.Circle({
        left: x - radius,
        top: y - radius,
        radius: radius,
        ...this.defaultOptions,
        ...options,
        id
      });
      
      this.canvas.add(circle);
      this.objectMap.set(id, circle);
    } catch (error) {
      console.error('Error creating circle:', error);
    }
  }

  drawLine(
    id: string,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    options: any = {}
  ): void {
    if (!this.canvas) return;
    
    try {
      // Use fabric.js Line class
      const line = new fabric.Line([x1, y1, x2, y2], {
        ...this.defaultOptions,
        ...options,
        id
      });
      
      this.canvas.add(line);
      this.objectMap.set(id, line);
    } catch (error) {
      console.error('Error creating line:', error);
    }
  }

  drawPolyline(
    id: string,
    points: SimplePoint[],
    options: any = {}
  ): void {
    if (!this.canvas) return;
    
    try {
      // Convert points to fabric.js format
      const fabricPoints = points.flatMap(p => [p.x, p.y]);
      
      // Use fabric.js Polyline class
      const polyline = new fabric.Polyline(fabricPoints as any, {
        ...this.defaultOptions,
        ...options,
        fill: 'transparent',
        id
      });
      
      this.canvas.add(polyline);
      this.objectMap.set(id, polyline);
    } catch (error) {
      console.error('Error creating polyline:', error);
    }
  }

  drawPath(
    id: string,
    path: string,
    options: any = {}
  ): void {
    if (!this.canvas) return;
    
    try {
      // Use fabric.js Path class
      const pathObj = new fabric.Path(path, {
        ...this.defaultOptions,
        ...options,
        id
      });
      
      this.canvas.add(pathObj);
      this.objectMap.set(id, pathObj);
    } catch (error) {
      console.error('Error creating path:', error);
    }
  }

  drawText(
    id: string,
    text: string,
    x: number,
    y: number,
    options: any = {}
  ): void {
    if (!this.canvas) return;
    
    try {
      // Use fabric.js Text class
      const textObj = new fabric.Text(text, {
        left: x,
        top: y,
        ...this.defaultOptions,
        ...options,
        id
      });
      
      this.canvas.add(textObj);
      this.objectMap.set(id, textObj);
    } catch (error) {
      console.error('Error creating text:', error);
    }
  }

  /* Object Management */
  
  removeObject(id: string): void {
    if (!this.canvas) return;
    
    const obj = this.objectMap.get(id);
    if (obj) {
      this.canvas.remove(obj);
      this.objectMap.delete(id);
    }
  }

  updateObject(id: string, options: any): void {
    if (!this.canvas) return;
    
    const obj = this.objectMap.get(id);
    if (obj) {
      obj.set(options);
      obj.setCoords();
      this.canvas.requestRenderAll();
    }
  }

  getObject(id: string): FabricObject | undefined {
    return this.objectMap.get(id);
  }

  /* Canvas Management */
  
  zoomTo(level: number, point?: SimplePoint): void {
    if (!this.canvas) return;
    
    const center = point || {
      x: this.canvas.getWidth() / 2,
      y: this.canvas.getHeight() / 2
    };
    
    this.canvas.zoomToPoint(new fabric.Point(center.x, center.y), level);
  }

  panTo(x: number, y: number): void {
    if (!this.canvas) return;
    
    const vpt = this.canvas.viewportTransform;
    if (!vpt) return;
    
    vpt[4] = x;
    vpt[5] = y;
    
    this.canvas.requestRenderAll();
  }

  /* Event Handling */
  
  enableEvents(): void {
    if (!this.canvas) return;
    
    this.canvas.selection = true;
    this.canvas.forEachObject(obj => {
      obj.selectable = true;
      obj.evented = true;
    });
  }

  disableEvents(): void {
    if (!this.canvas) return;
    
    this.canvas.selection = false;
    this.canvas.forEachObject(obj => {
      obj.selectable = false;
      obj.evented = false;
    });
  }
}
