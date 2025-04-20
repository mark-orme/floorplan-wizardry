
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

// Define core geometry interfaces
export interface GeometryEngine {
  calculateArea(points: Point[]): number;
  calculatePerimeter(points: Point[]): number;
  isPointInPolygon(point: Point, polygon: Point[]): boolean;
  getDistance(p1: Point, p2: Point): number;
}

export interface GeometryCalculator {
  area: number;
  perimeter: number;
  centroid: Point;
}

export interface GeometryValidator {
  isValid(points: Point[]): boolean;
  getErrors(): string[];
}
