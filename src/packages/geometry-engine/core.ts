
import { Point, Line, LineSegment } from './types';

/**
 * Calculate distance between two points
 * @param p1 First point
 * @param p2 Second point
 * @returns Distance between points
 */
export function calculateDistance(p1: Point, p2: Point): number {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Calculate perpendicular distance from point to line
 * @param point Point to measure from
 * @param lineP1 First point on line
 * @param lineP2 Second point on line
 * @returns Distance from point to line
 */
export function perpendicularDistance(point: Point, lineP1: Point, lineP2: Point): number {
  const lineLength = calculateDistance(lineP1, lineP2);
  
  if (lineLength === 0) return calculateDistance(point, lineP1);
  
  const t = ((point.x - lineP1.x) * (lineP2.x - lineP1.x) + 
             (point.y - lineP1.y) * (lineP2.y - lineP1.y)) / 
            (lineLength * lineLength);
  
  const projectionX = lineP1.x + t * (lineP2.x - lineP1.x);
  const projectionY = lineP1.y + t * (lineP2.y - lineP1.y);
  
  return calculateDistance(point, { x: projectionX, y: projectionY });
}

/**
 * Calculate area of a polygon
 * @param points Polygon vertices
 * @returns Area of polygon
 */
export function calculateArea(points: Point[]): number {
  let area = 0;
  const n = points.length;
  
  if (n < 3) return 0;
  
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    area += points[i].x * points[j].y;
    area -= points[j].x * points[i].y;
  }
  
  return Math.abs(area) / 2;
}

/**
 * Calculate intersection point of two lines
 * @param line1 First line
 * @param line2 Second line
 * @returns Intersection point or null if parallel
 */
export function calculateIntersection(line1: Line, line2: Line): Point | null {
  const det = line1.a * line2.b - line2.a * line1.b;
  
  if (Math.abs(det) < 1e-10) return null; // Lines are parallel
  
  const x = (line2.b * line1.c - line1.b * line2.c) / det;
  const y = (line1.a * line2.c - line2.a * line1.c) / det;
  
  return { x, y };
}

/**
 * Convert two points to Line (ax + by + c = 0)
 * @param p1 First point
 * @param p2 Second point
 * @returns Line equation coefficients
 */
export function pointsToLine(p1: Point, p2: Point): Line {
  const a = p2.y - p1.y;
  const b = p1.x - p2.x;
  const c = p2.x * p1.y - p1.x * p2.y;
  return { a, b, c };
}
