
/**
 * Extended type definitions for Fabric.js
 * Adds custom properties to base Fabric types
 */
import { Object as FabricObject, Line, Canvas, CanvasEvents } from 'fabric';

// Extend the Fabric Object interface
declare module 'fabric' {
  interface Object {
    id?: string;
    objectType?: string;
    data?: any;
    visible?: boolean;
    selectable?: boolean;
    evented?: boolean;
    set(options: Record<string, any>): FabricObject;
  }
  
  // Extend specific shape interfaces
  interface Line {
    data?: any;
    stroke?: string;
    strokeWidth?: number;
  }

  interface ILineOptions {
    stroke?: string;
    strokeWidth?: number;
  }

  // Add custom events
  interface CanvasEvents {
    'object:created': any;
  }

  // Add exports for ActiveSelection and Point
  export class ActiveSelection extends FabricObject {
    // Add properties and methods for ActiveSelection
    constructor(objects: FabricObject[], options?: any);
    forEachObject(callback: (obj: FabricObject) => void): void;
  }

  export class Point {
    x: number;
    y: number;
    constructor(x: number, y: number);
    add(point: Point): Point;
    subtract(point: Point): Point;
    multiply(scalar: number): Point;
    divide(scalar: number): Point;
  }
  
  // Add missing Canvas properties
  interface Canvas {
    getActiveObject(): FabricObject | null;
    zoomToPoint(point: Point, zoom: number): Canvas;
    renderOnAddRemove: boolean;
    allowTouchScrolling: boolean;
    forEachObject(callback: (obj: FabricObject) => void): void;
    viewportTransform: number[];
  }
}
