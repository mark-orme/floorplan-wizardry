
import { Point, LineSegment } from './types';
import { Polygon } from './core';

// Basic validation functions
export function isValidPoint(point: any): point is Point {
  return (
    point &&
    typeof point === 'object' &&
    typeof point.x === 'number' &&
    typeof point.y === 'number' &&
    !isNaN(point.x) &&
    !isNaN(point.y)
  );
}

export function isValidLineSegment(line: any): line is LineSegment {
  return (
    line &&
    typeof line === 'object' &&
    isValidPoint(line.p1) &&
    isValidPoint(line.p2)
  );
}

export function isValidPolygon(polygon: any): polygon is Polygon {
  return (
    polygon &&
    typeof polygon === 'object' &&
    Array.isArray(polygon.points) &&
    polygon.points.length >= 3 &&
    polygon.points.every((point: any) => isValidPoint(point))
  );
}

// Utility validation functions
export function isPointWithinPolygon(point: Point, polygon: Polygon): boolean {
  if (!isValidPoint(point) || !isValidPolygon(polygon)) {
    return false;
  }
  
  const { points } = polygon;
  let inside = false;
  
  for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
    const intersect = (
      (points[i].y > point.y) !== (points[j].y > point.y)
    ) && (
      point.x < (points[j].x - points[i].x) * (point.y - points[i].y) / (points[j].y - points[i].y) + points[i].x
    );
    
    if (intersect) inside = !inside;
  }
  
  return inside;
}

export function doSegmentsIntersect(line1: LineSegment, line2: LineSegment): boolean {
  if (!isValidLineSegment(line1) || !isValidLineSegment(line2)) {
    return false;
  }
  
  const { p1: p1, p2: p2 } = line1;
  const { p1: p3, p2: p4 } = line2;
  
  const d1 = direction(p3, p4, p1);
  const d2 = direction(p3, p4, p2);
  const d3 = direction(p1, p2, p3);
  const d4 = direction(p1, p2, p4);
  
  // Check if lines intersect
  if (((d1 > 0 && d2 < 0) || (d1 < 0 && d2 > 0)) && 
      ((d3 > 0 && d4 < 0) || (d3 < 0 && d4 > 0))) {
    return true;
  }
  
  // Check for colinearity and overlap
  if (d1 === 0 && onSegment(p3, p4, p1)) return true;
  if (d2 === 0 && onSegment(p3, p4, p2)) return true;
  if (d3 === 0 && onSegment(p1, p2, p3)) return true;
  if (d4 === 0 && onSegment(p1, p2, p4)) return true;
  
  return false;
}

// Helper functions for segment intersection
function direction(p1: Point, p2: Point, p3: Point): number {
  const val = ((p3.y - p1.y) * (p2.x - p1.x)) - ((p2.y - p1.y) * (p3.x - p1.x));
  
  if (val === 0) return 0;  // Colinear
  return (val > 0) ? 1 : -1; // Clockwise or counterclockwise
}

function onSegment(p1: Point, p2: Point, p3: Point): boolean {
  return (
    p3.x <= Math.max(p1.x, p2.x) &&
    p3.x >= Math.min(p1.x, p2.x) &&
    p3.y <= Math.max(p1.y, p2.y) &&
    p3.y >= Math.min(p1.y, p2.y)
  );
}
