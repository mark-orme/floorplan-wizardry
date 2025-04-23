import { ICanvasEngine } from '@/interfaces/canvas-engine/ICanvasEngine';
import { Point } from '@/types/core/Point';
import { DrawOptions, CanvasObject, StrokeStyle } from '@/types/canvas/canvasTypes';

export class MockCanvasEngine implements ICanvasEngine {
  // Implementation of the interface methods for testing
  drawLine(points: Point[], options: DrawOptions): void {
    console.log('MockCanvasEngine.drawLine called');
  }
  
  drawShape(points: Point[], options: DrawOptions): void {
    console.log('MockCanvasEngine.drawShape called');
  }
  
  clear(): void {
    console.log('MockCanvasEngine.clear called');
  }
  
  undo(): void {
    console.log('MockCanvasEngine.undo called');
  }
  
  redo(): void {
    console.log('MockCanvasEngine.redo called');
  }
  
  addObject(object: CanvasObject): void {
    console.log('MockCanvasEngine.addObject called');
  }
  
  removeObject(object: CanvasObject): void {
    console.log('MockCanvasEngine.removeObject called');
  }
  
  updateObject(object: CanvasObject): void {
    console.log('MockCanvasEngine.updateObject called');
  }
  
  getObjects(): CanvasObject[] {
    console.log('MockCanvasEngine.getObjects called');
    return [];
  }
  
  getCanvasState(): any {
    console.log('MockCanvasEngine.getCanvasState called');
    return {};
  }
  
  setCanvasState(state: any): void {
    console.log('MockCanvasEngine.setCanvasState called');
  }
  
  setStrokeStyle(style: StrokeStyle): void {
    console.log('MockCanvasEngine.setStrokeStyle called');
  }
  
  setZoom(level: number): void {
    console.log('MockCanvasEngine.setZoom called');
  }
  
  setPan(x: number, y: number): void {
    console.log('MockCanvasEngine.setPan called');
  }
  
  on(event: string, callback: Function): void {
    console.log('MockCanvasEngine.on called');
  }
  
  off(event: string, callback: Function): void {
    console.log('MockCanvasEngine.off called');
  }
  
  dispose(): void {
    console.log('MockCanvasEngine.dispose called');
  }
}
