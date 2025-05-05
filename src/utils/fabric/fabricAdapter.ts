
/**
 * Fabric.js adapter
 * Provides a consistent interface for different versions of Fabric.js
 */
import { Canvas, Object as FabricObject, Line, Group, Point, Polyline, Path, ILineOptions } from 'fabric';

// Re-export fabric types
export { Canvas, FabricObject, Line, Group, Point, Polyline, Path };

// Type definitions for the adapter
export interface FabricAdapterOptions {
  safeMode?: boolean;
  debug?: boolean;
}

// Create a path with safety checks
export function createPath(pathData: string | any[], options: any = {}) {
  try {
    return new Path(pathData, options);
  } catch (error) {
    console.error('Error creating Fabric.js Path:', error);
    return null;
  }
}

// Create a line with safety checks
export function createLine(points: number[], options: ILineOptions = {}) {
  try {
    return new Line(points, options);
  } catch (error) {
    console.error('Error creating Fabric.js Line:', error);
    return null;
  }
}

// Create a polyline with safety checks
export function createPolyline(points: Array<{ x: number, y: number }>, options: any = {}) {
  try {
    return new Polyline(points, options);
  } catch (error) {
    console.error('Error creating Fabric.js Polyline:', error);
    return null;
  }
}

// Safe canvas creation
export function createCanvas(element: HTMLCanvasElement | string, options: any = {}) {
  try {
    return new Canvas(element, options);
  } catch (error) {
    console.error('Error creating Fabric.js Canvas:', error);
    return null;
  }
}

// Safe event attachment for canvas
export function addCanvasEvent(canvas: Canvas | null, eventName: string, handler: Function) {
  if (!canvas) return;
  try {
    canvas.on(eventName, handler as any);
  } catch (error) {
    console.error(`Error adding event ${eventName} to canvas:`, error);
  }
}

// Safe event removal for canvas
export function removeCanvasEvent(canvas: Canvas | null, eventName: string, handler?: Function) {
  if (!canvas) return;
  try {
    if (handler) {
      canvas.off(eventName, handler as any);
    } else {
      // Some fabric versions allow removing all handlers for an event
      (canvas as any).off(eventName);
    }
  } catch (error) {
    console.error(`Error removing event ${eventName} from canvas:`, error);
  }
}

// Type guard functions
export function isPath(obj: any): obj is Path {
  return obj && obj.type === 'path';
}

export function isLine(obj: any): obj is Line {
  return obj && obj.type === 'line';
}

export function isPolyline(obj: any): obj is Polyline {
  return obj && obj.type === 'polyline';
}

// Convert our Point to Fabric Point
export function toFabricPoint(point: { x: number, y: number }): Point {
  return new Point(point.x, point.y);
}

// Convert Fabric Point to our Point
export function fromFabricPoint(point: Point): { x: number, y: number } {
  return { x: point.x, y: point.y };
}
