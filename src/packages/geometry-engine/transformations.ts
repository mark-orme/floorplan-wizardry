import { Point } from './types';

/**
 * Rotate a point around an origin
 * @param point Point to rotate
 * @param origin Origin point to rotate around
 * @param angle Angle in radians
 * @returns Rotated point
 */
export const rotatePoint = (point: Point, origin: Point, angle: number): Point => {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  
  const x = origin.x + (point.x - origin.x) * cos - (point.y - origin.y) * sin;
  const y = origin.y + (point.x - origin.x) * sin + (point.y - origin.y) * cos;
  
  return { x, y };
};

/**
 * Scale a point relative to an origin
 * @param point Point to scale
 * @param origin Origin point
 * @param scaleX Scale factor in X direction
 * @param scaleY Scale factor in Y direction
 * @returns Scaled point
 */
export const scalePoint = (
  point: Point, 
  origin: Point, 
  scaleX: number, 
  scaleY: number = scaleX
): Point => {
  const x = origin.x + (point.x - origin.x) * scaleX;
  const y = origin.y + (point.y - origin.y) * scaleY;
  
  return { x, y };
};

/**
 * Translate a point
 * @param point Point to translate
 * @param dx Distance to translate in X direction
 * @param dy Distance to translate in Y direction
 * @returns Translated point
 */
export const translatePoint = (point: Point, dx: number, dy: number): Point => {
  return {
    x: point.x + dx,
    y: point.y + dy
  };
};

/**
 * Optimize an array of points by removing redundant ones
 * @param points Array of points to optimize
 * @param tolerance Distance tolerance for considering points the same
 * @returns Optimized array of points
 */
export const optimizePoints = (points: Point[], tolerance: number = 1): Point[] => {
  if (points.length <= 2) return points;
  
  const result: Point[] = [points[0]];
  
  for (let i = 1; i < points.length - 1; i++) {
    const prev = result[result.length - 1];
    const curr = points[i];
    const next = points[i + 1];
    
    // Calculate vectors
    const v1 = { x: curr.x - prev.x, y: curr.y - prev.y };
    const v2 = { x: next.x - curr.x, y: next.y - curr.y };
    
    // Normalize vectors
    const len1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y);
    const len2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y);
    
    if (len1 < tolerance || len2 < tolerance) {
      // Skip points that are too close together
      continue;
    }
    
    const dot = (v1.x * v2.x + v1.y * v2.y) / (len1 * len2);
    
    // If the angle between vectors is significant, keep the point
    if (Math.abs(dot) < 0.99) {
      result.push(curr);
    }
  }
  
  // Always add the last point
  result.push(points[points.length - 1]);
  
  return result;
};

/**
 * Snap points to a grid
 * @param points Array of points to snap
 * @param gridSize Grid size to snap to
 * @returns Array of snapped points
 */
export const snapPointsToGrid = (points: Point[], gridSize: number): Point[] => {
  return points.map(point => ({
    x: Math.round(point.x / gridSize) * gridSize,
    y: Math.round(point.y / gridSize) * gridSize
  }));
};
