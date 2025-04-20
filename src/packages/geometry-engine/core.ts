
/**
 * Core geometry functions
 * @module geometry-engine/core
 */
import { Point, Line, Polygon, Rectangle, Circle } from './types';

/**
 * Calculate the distance between two points
 */
export function calculateDistance(point1: Point, point2: Point): number {
  const dx = point2.x - point1.x;
  const dy = point2.y - point1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Calculate the area of a polygon
 * Uses the Shoelace formula (Gauss's area formula)
 */
export function calculatePolygonArea(vertices: Point[]): number {
  if (vertices.length < 3) return 0;
  
  let area = 0;
  const n = vertices.length;
  
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    area += vertices[i].x * vertices[j].y;
    area -= vertices[j].x * vertices[i].y;
  }
  
  return Math.abs(area) / 2;
}

/**
 * Check if a point is inside a polygon
 * Uses ray casting algorithm
 */
export function isPointInPolygon(point: Point, polygon: Point[]): boolean {
  if (polygon.length < 3) return false;
  
  let inside = false;
  const x = point.x;
  const y = point.y;
  
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].x;
    const yi = polygon[i].y;
    const xj = polygon[j].x;
    const yj = polygon[j].y;
    
    const intersect = ((yi > y) !== (yj > y)) &&
        (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    
    if (intersect) inside = !inside;
  }
  
  return inside;
}

/**
 * Find the intersection point of two lines
 * Returns null if lines are parallel
 */
export function findLineIntersection(line1: Line, line2: Line): Point | null {
  const x1 = line1.start.x;
  const y1 = line1.start.y;
  const x2 = line1.end.x;
  const y2 = line1.end.y;
  const x3 = line2.start.x;
  const y3 = line2.start.y;
  const x4 = line2.end.x;
  const y4 = line2.end.y;
  
  const denominator = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
  
  // Check if lines are parallel
  if (denominator === 0) return null;
  
  const ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator;
  const ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator;
  
  // Check if intersection is within both line segments
  if (ua < 0 || ua > 1 || ub < 0 || ub > 1) return null;
  
  const x = x1 + ua * (x2 - x1);
  const y = y1 + ua * (y2 - y1);
  
  return { x, y };
}

/**
 * Get the perpendicular distance from a point to a line
 */
export function perpendicularDistance(point: Point, lineStart: Point, lineEnd: Point): number {
  const dx = lineEnd.x - lineStart.x;
  const dy = lineEnd.y - lineStart.y;
  
  // If line is just a point, return distance to that point
  if (dx === 0 && dy === 0) {
    const pdx = point.x - lineStart.x;
    const pdy = point.y - lineStart.y;
    return Math.sqrt(pdx * pdx + pdy * pdy);
  }
  
  // Calculate perpendicular distance
  const lineLengthSquared = dx * dx + dy * dy;
  const t = ((point.x - lineStart.x) * dx + (point.y - lineStart.y) * dy) / lineLengthSquared;
  
  if (t < 0) {
    // Point is before start of line, use distance to start
    return calculateDistance(point, lineStart);
  }
  
  if (t > 1) {
    // Point is after end of line, use distance to end
    return calculateDistance(point, lineEnd);
  }
  
  // Point is between start and end of line, calculate perpendicular distance
  const nearestX = lineStart.x + t * dx;
  const nearestY = lineStart.y + t * dy;
  
  return calculateDistance(point, { x: nearestX, y: nearestY });
}

/**
 * Calculate the bounding box of a set of points
 */
export function calculateBoundingBox(points: Point[]): Rectangle {
  if (!points.length) {
    return { x: 0, y: 0, width: 0, height: 0 };
  }
  
  let minX = points[0].x;
  let minY = points[0].y;
  let maxX = points[0].x;
  let maxY = points[0].y;
  
  for (let i = 1; i < points.length; i++) {
    const point = points[i];
    minX = Math.min(minX, point.x);
    minY = Math.min(minY, point.y);
    maxX = Math.max(maxX, point.x);
    maxY = Math.max(maxY, point.y);
  }
  
  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY
  };
}

/**
 * Calculate the midpoint between two points
 */
export function calculateMidpoint(point1: Point, point2: Point): Point {
  return {
    x: (point1.x + point2.x) / 2,
    y: (point1.y + point2.y) / 2
  };
}

/**
 * Create a point at the specified coordinates
 */
export function createPoint(x: number, y: number): Point {
  return { x, y };
}
