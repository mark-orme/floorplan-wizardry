
/**
 * Line straightening utilities
 * @module geometry/straightening
 */
import { Point } from '@/types/geometryTypes';
import { calculateAngle } from './lineOperations';
import { snapToAngle } from '../grid/snapping';
import { ANGLE_SNAP_THRESHOLD } from '@/constants/numerics';

/**
 * Check if a line is horizontal, vertical, or diagonal
 * @param {Point} start - Start point
 * @param {Point} end - End point
 * @returns {boolean} Whether the line is at a standard angle
 */
export const isStandardAngle = (start: Point, end: Point): boolean => {
  const angle = calculateAngle(start, end);
  const snappedAngle = snapToAngle(angle);
  return Math.abs(angle - snappedAngle) < ANGLE_SNAP_THRESHOLD;
};

/**
 * Straighten a line to the nearest standard angle
 * @param {Point} start - Start point
 * @param {Point} end - End point
 * @returns {Object} Straightened line
 */
export const straightenLine = (
  start: Point, 
  end: Point
): { start: Point; end: Point } => {
  const angle = calculateAngle(start, end);
  const snappedAngle = snapToAngle(angle);
  
  // If already at a standard angle, return original
  if (Math.abs(angle - snappedAngle) < ANGLE_SNAP_THRESHOLD) {
    return { start, end };
  }
  
  // Calculate distance between points
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const length = Math.sqrt(dx * dx + dy * dy);
  
  // Convert snapped angle to radians
  const snappedRad = snappedAngle * (Math.PI / 180);
  
  // Calculate new end point
  const newEnd = {
    x: start.x + Math.cos(snappedRad) * length,
    y: start.y + Math.sin(snappedRad) * length
  };
  
  return { start, end: newEnd };
};

/**
 * Straighten a polyline (multiple connected points)
 * @param {Point[]} points - Array of points
 * @returns {Point[]} Straightened points
 */
export const straightenPolyline = (points: Point[]): Point[] => {
  if (points.length < 2) return points;
  
  const result: Point[] = [points[0]];
  
  for (let i = 1; i < points.length; i++) {
    const { end } = straightenLine(result[result.length - 1], points[i]);
    result.push(end);
  }
  
  return result;
};

/**
 * Auto-straighten a path when close to a standard angle
 * @param {Point[]} points - Path points
 * @returns {Point[]} Straightened path points
 */
export const autoStraightenPath = (points: Point[]): Point[] => {
  return straightenPolyline(points);
};
