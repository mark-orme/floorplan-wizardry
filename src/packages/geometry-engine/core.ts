
import { Point, LineSegment } from './types';

// Additional geometry types
export interface Polygon {
  points: Point[];
}

export interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Circle {
  center: Point;
  radius: number;
}

// Core geometry functions
export function createPoint(x: number, y: number): Point {
  return { x, y };
}

export function createLineSegment(p1: Point, p2: Point): LineSegment {
  return { p1, p2 };
}

export function createPolygon(points: Point[]): Polygon {
  return { points };
}

export function createRectangle(x: number, y: number, width: number, height: number): Rectangle {
  return { x, y, width, height };
}

export function createCircle(center: Point, radius: number): Circle {
  return { center, radius };
}

// Utility functions
export function calculateLineLength(line: LineSegment): number {
  return Math.sqrt(
    Math.pow(line.p2.x - line.p1.x, 2) + 
    Math.pow(line.p2.y - line.p1.y, 2)
  );
}

export function calculatePolygonArea(polygon: Polygon): number {
  const { points } = polygon;
  if (points.length < 3) return 0;
  
  let area = 0;
  for (let i = 0; i < points.length; i++) {
    const j = (i + 1) % points.length;
    area += points[i].x * points[j].y;
    area -= points[j].x * points[i].y;
  }
  
  return Math.abs(area / 2);
}

export function calculatePolygonPerimeter(polygon: Polygon): number {
  const { points } = polygon;
  if (points.length < 2) return 0;
  
  let perimeter = 0;
  for (let i = 0; i < points.length; i++) {
    const j = (i + 1) % points.length;
    perimeter += Math.sqrt(
      Math.pow(points[j].x - points[i].x, 2) + 
      Math.pow(points[j].y - points[i].y, 2)
    );
  }
  
  return perimeter;
}

export function calculateRectangleArea(rect: Rectangle): number {
  return rect.width * rect.height;
}

export function calculateRectanglePerimeter(rect: Rectangle): number {
  return 2 * (rect.width + rect.height);
}

export function calculateCircleArea(circle: Circle): number {
  return Math.PI * circle.radius * circle.radius;
}

export function calculateCircleCircumference(circle: Circle): number {
  return 2 * Math.PI * circle.radius;
}
