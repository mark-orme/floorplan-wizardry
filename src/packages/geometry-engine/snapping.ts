
import { Point } from '@/types/canvas';
import { calculateDistance } from './calculations';

/**
 * Snap a point to the nearest grid intersection
 */
export const snapToGrid = (point: Point, gridSize: number): Point => {
  return {
    x: Math.round(point.x / gridSize) * gridSize,
    y: Math.round(point.y / gridSize) * gridSize
  };
};

/**
 * Snap a point to the nearest point in an array of points if it's within a threshold
 */
export const snapToPoint = (point: Point, points: Point[], threshold: number): Point => {
  let closestPoint = point;
  let minDistance = threshold;
  
  for (const p of points) {
    const distance = calculateDistance(point, p);
    if (distance < minDistance) {
      minDistance = distance;
      closestPoint = p;
    }
  }
  
  return closestPoint;
};

/**
 * Snap to nearest line if within threshold
 */
export const snapToLine = (
  point: Point, 
  lineStart: Point, 
  lineEnd: Point, 
  threshold: number
): Point => {
  // Calculate projection of point onto line
  const lineLength = calculateDistance(lineStart, lineEnd);
  
  if (lineLength === 0) return point;
  
  // Calculate normalized direction vector of line
  const dirX = (lineEnd.x - lineStart.x) / lineLength;
  const dirY = (lineEnd.y - lineStart.y) / lineLength;
  
  // Calculate vector from line start to point
  const vecX = point.x - lineStart.x;
  const vecY = point.y - lineStart.y;
  
  // Calculate dot product to find projection length
  const projLength = vecX * dirX + vecY * dirY;
  
  // Calculate projection point
  const projX = lineStart.x + dirX * Math.max(0, Math.min(projLength, lineLength));
  const projY = lineStart.y + dirY * Math.max(0, Math.min(projLength, lineLength));
  
  // Calculate distance to projection
  const distance = calculateDistance(point, { x: projX, y: projY });
  
  // Snap if within threshold
  if (distance <= threshold) {
    return { x: projX, y: projY };
  }
  
  return point;
};
