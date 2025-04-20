
/**
 * Canvas type definitions for the floor plan editor
 */

export interface Point {
  x: number;
  y: number;
}

export interface DrawOptions {
  color: string;
  width: number;
  opacity?: number;
}

export interface CanvasObject {
  id?: string;
  type?: string;
  [key: string]: any;
}

export interface StrokeStyle {
  color: string;
  width: number;
  opacity?: number;
}

// Event system
export interface CanvasEvents {
  'object:added': CanvasObject;
  'object:removed': CanvasObject;
  'object:modified': CanvasObject;
  'selection:created': CanvasObject[];
  'selection:updated': CanvasObject[];
  'selection:cleared': void;
  'path:created': CanvasObject;
  'mouse:down': PointerEvent;
  'mouse:move': PointerEvent;
  'mouse:up': PointerEvent;
  'zoom:changed': number;
  'pan:changed': Point;
  [key: string]: any;
}

// Fix the implementation of MockCanvasEngine
<lov-write file_path="src/implementations/canvas-engine/MockCanvasEngine.ts">
import { ICanvasEngine } from '@/interfaces/canvas-engine/ICanvasEngine';
import { Point, DrawOptions, CanvasObject, StrokeStyle } from '@/types/canvas';

export class MockCanvasEngine implements ICanvasEngine {
  private objects: CanvasObject[] = [];
  private eventHandlers: Record<string, Function[]> = {};
  private strokeStyle: StrokeStyle = { color: 'black', width: 1 };

  drawLine(points: Point[], options: DrawOptions): void {
    const line = {
      id: `line-${this.objects.length}`,
      type: 'line',
      points: [...points],
      ...options
    };
    this.objects.push(line);
    this.triggerEvent('object:added', line);
  }

  drawShape(points: Point[], options: DrawOptions): void {
    const shape = {
      id: `shape-${this.objects.length}`,
      type: 'shape',
      points: [...points],
      ...options
    };
    this.objects.push(shape);
    this.triggerEvent('object:added', shape);
  }

  clear(): void {
    this.objects = [];
    this.triggerEvent('canvas:cleared', null);
  }

  undo(): void {
    if (this.objects.length > 0) {
      const removed = this.objects.pop();
      this.triggerEvent('object:removed', removed);
    }
  }

  redo(): void {
    // Mock implementation
  }

  addObject(object: CanvasObject): void {
    this.objects.push(object);
    this.triggerEvent('object:added', object);
  }

  removeObject(object: CanvasObject): void {
    const index = this.objects.findIndex(obj => obj.id === object.id);
    if (index !== -1) {
      this.objects.splice(index, 1);
      this.triggerEvent('object:removed', object);
    }
  }

  updateObject(object: CanvasObject): void {
    const index = this.objects.findIndex(obj => obj.id === object.id);
    if (index !== -1) {
      this.objects[index] = { ...this.objects[index], ...object };
      this.triggerEvent('object:modified', this.objects[index]);
    }
  }

  getObjects(): CanvasObject[] {
    return [...this.objects];
  }

  getCanvasState(): any {
    return {
      objects: this.getObjects(),
      strokeStyle: this.strokeStyle
    };
  }

  setCanvasState(state: any): void {
    if (state.objects) {
      this.objects = [...state.objects];
    }
    if (state.strokeStyle) {
      this.strokeStyle = { ...state.strokeStyle };
    }
  }

  setStrokeStyle(style: StrokeStyle): void {
    this.strokeStyle = { ...style };
  }

  setZoom(level: number): void {
    this.triggerEvent('zoom:changed', level);
  }

  setPan(x: number, y: number): void {
    this.triggerEvent('pan:changed', { x, y });
  }

  on(event: string, callback: Function): void {
    if (!this.eventHandlers[event]) {
      this.eventHandlers[event] = [];
    }
    this.eventHandlers[event].push(callback);
  }

  off(event: string, callback: Function): void {
    if (this.eventHandlers[event]) {
      this.eventHandlers[event] = this.eventHandlers[event].filter(
        handler => handler !== callback
      );
    }
  }

  private triggerEvent(event: string, data: any): void {
    if (this.eventHandlers[event]) {
      for (const handler of this.eventHandlers[event]) {
        handler(data);
      }
    }
  }

  dispose(): void {
    this.objects = [];
    this.eventHandlers = {};
  }
}
