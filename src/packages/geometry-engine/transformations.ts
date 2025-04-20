
import { Point } from './types';

/**
 * Rotate a point around origin
 * @param point Point to rotate
 * @param angle Angle in radians
 * @param origin Origin point (default: 0,0)
 * @returns Rotated point
 */
export function rotatePoint(
  point: Point, 
  angle: number, 
  origin: Point = { x: 0, y: 0 }
): Point {
  // Translate point to origin
  const x = point.x - origin.x;
  const y = point.y - origin.y;
  
  // Rotate point
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const xNew = x * cos - y * sin;
  const yNew = x * sin + y * cos;
  
  // Translate point back
  return {
    x: xNew + origin.x,
    y: yNew + origin.y
  };
}

/**
 * Scale a point from origin
 * @param point Point to scale
 * @param scaleX X scale factor
 * @param scaleY Y scale factor
 * @param origin Origin point (default: 0,0)
 * @returns Scaled point
 */
export function scalePoint(
  point: Point,
  scaleX: number,
  scaleY: number,
  origin: Point = { x: 0, y: 0 }
): Point {
  return {
    x: origin.x + (point.x - origin.x) * scaleX,
    y: origin.y + (point.y - origin.y) * scaleY
  };
}

/**
 * Translate a point
 * @param point Point to translate
 * @param dx X distance
 * @param dy Y distance
 * @returns Translated point
 */
export function translatePoint(
  point: Point,
  dx: number,
  dy: number
): Point {
  return {
    x: point.x + dx,
    y: point.y + dy
  };
}

/**
 * Optimize an array of points by removing points that are too close
 * @param points Array of points
 * @param minDistance Minimum distance between points
 * @returns Optimized array of points
 */
export function optimizePoints(
  points: Point[],
  minDistance: number = 5
): Point[] {
  if (points.length <= 2) return [...points];
  
  const result: Point[] = [points[0]];
  let lastPoint = points[0];
  
  for (let i = 1; i < points.length; i++) {
    const dx = points[i].x - lastPoint.x;
    const dy = points[i].y - lastPoint.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance >= minDistance) {
      result.push(points[i]);
      lastPoint = points[i];
    }
  }
  
  // Always include the last point
  if (points.length > 1 && result[result.length - 1] !== points[points.length - 1]) {
    result.push(points[points.length - 1]);
  }
  
  return result;
}

/**
 * Snap points to a grid
 * @param points Array of points
 * @param gridSize Size of grid cells
 * @returns Array of snapped points
 */
export function snapPointsToGrid(
  points: Point[],
  gridSize: number
): Point[] {
  return points.map(point => ({
    x: Math.round(point.x / gridSize) * gridSize,
    y: Math.round(point.y / gridSize) * gridSize
  }));
}
