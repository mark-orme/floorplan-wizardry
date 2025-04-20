
import { Point, LineSegment } from './types';

/**
 * Calculate the distance between two points
 * @param p1 First point
 * @param p2 Second point
 * @returns Distance between the points
 */
export function calculateDistance(p1: Point, p2: Point): number {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}

/**
 * Calculate the angle between a line and the x-axis
 * @param line Line segment
 * @returns Angle in radians
 */
export function calculateAngle(line: LineSegment): number {
  return Math.atan2(line.p2.y - line.p1.y, line.p2.x - line.p1.x);
}

/**
 * Calculate the perpendicular distance from a point to a line segment
 * @param point Point to calculate distance from
 * @param lineStart Start point of the line
 * @param lineEnd End point of the line
 * @returns Perpendicular distance from the point to the line
 */
export function perpendicularDistance(point: Point, lineStart: Point, lineEnd: Point): number {
  const lineLength = calculateDistance(lineStart, lineEnd);
  
  if (lineLength === 0) {
    return calculateDistance(point, lineStart);
  }
  
  const t = ((point.x - lineStart.x) * (lineEnd.x - lineStart.x) + 
            (point.y - lineStart.y) * (lineEnd.y - lineStart.y)) / 
            (lineLength * lineLength);
  
  const clampedT = Math.max(0, Math.min(1, t));
  
  const projectionX = lineStart.x + clampedT * (lineEnd.x - lineStart.x);
  const projectionY = lineStart.y + clampedT * (lineEnd.y - lineStart.y);
  
  return calculateDistance(point, { x: projectionX, y: projectionY });
}

/**
 * Check if two line segments intersect
 * @param line1 First line segment
 * @param line2 Second line segment
 * @returns Whether the line segments intersect
 */
export function linesIntersect(line1: LineSegment, line2: LineSegment): boolean {
  const a = line1.p1;
  const b = line1.p2;
  const c = line2.p1;
  const d = line2.p2;
  
  const denominator = ((b.y - a.y) * (d.x - c.x)) - ((b.x - a.x) * (d.y - c.y));
  
  if (denominator === 0) {
    return false; // Lines are parallel
  }
  
  const ua = (((b.x - a.x) * (c.y - a.y)) - ((b.y - a.y) * (c.x - a.x))) / denominator;
  const ub = (((d.x - c.x) * (c.y - a.y)) - ((d.y - c.y) * (c.x - a.x))) / denominator;
  
  return (ua >= 0 && ua <= 1) && (ub >= 0 && ub <= 1);
}
