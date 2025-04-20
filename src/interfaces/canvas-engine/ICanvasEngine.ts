
import { Point, DrawOptions, CanvasObject, StrokeStyle } from '@/types/canvas';

export interface ICanvasEngine {
  // Core drawing operations
  drawLine(points: Point[], options: DrawOptions): void;
  drawShape(points: Point[], options: DrawOptions): void;
  
  // Canvas state management
  clear(): void;
  undo(): void;
  redo(): void;
  
  // Object manipulation
  addObject(object: CanvasObject): void;
  removeObject(object: CanvasObject): void;
  updateObject(object: CanvasObject): void;
  
  // Canvas state
  getObjects(): CanvasObject[];
  getCanvasState(): any;
  setCanvasState(state: any): void;
  
  // Style management
  setStrokeStyle(style: StrokeStyle): void;
  
  // Zoom and pan
  setZoom(level: number): void;
  setPan(x: number, y: number): void;
  
  // Event handlers
  on(event: string, callback: Function): void;
  off(event: string, callback: Function): void;
  
  // Cleanup
  dispose(): void;
}
