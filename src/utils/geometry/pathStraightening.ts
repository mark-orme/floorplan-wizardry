
/**
 * Path straightening utilities
 * @module utils/geometry/pathStraightening
 */
import { Point } from '@/types/core/Point';
import { snapToGrid } from './pointOperations';

/**
 * Check if a path resembles a straight line
 * @param points Array of points in the path
 * @param angleThreshold Maximum angle deviation in radians (default ~5°)
 * @returns True if the path is nearly straight
 */
export function isStraightPath(points: Point[], angleThreshold: number = 0.09): boolean {
  // Need at least 3 points to determine straightness
  if (points.length < 3) return true;
  
  // Calculate angle of the line from first to last point (base angle)
  const firstPoint = points[0];
  const lastPoint = points[points.length - 1];
  const baseAngle = Math.atan2(lastPoint.y - firstPoint.y, lastPoint.x - firstPoint.x);
  
  // Check if all points lie close to the base angle line
  for (let i = 1; i < points.length - 1; i++) {
    const currentPoint = points[i];
    const prevPoint = points[i - 1];
    
    // Calculate angle between consecutive points
    const pointAngle = Math.atan2(currentPoint.y - prevPoint.y, currentPoint.x - prevPoint.x);
    
    // Check if angle deviation is within threshold
    const angleDiff = Math.abs(normalizeAngle(pointAngle - baseAngle));
    if (angleDiff > angleThreshold) {
      return false;
    }
  }
  
  return true;
}

/**
 * Create a straightened line from a nearly-straight path
 * @param points Array of points in the path
 * @param snapToGridEnabled Whether to snap endpoints to grid
 * @param gridSize Grid size for snapping
 * @returns Start and end points for the straightened line
 */
export function straightenPath(
  points: Point[], 
  snapToGridEnabled: boolean = false, 
  gridSize: number = 20
): { start: Point, end: Point } {
  // Get first and last points
  const start = { ...points[0] };
  const end = { ...points[points.length - 1] };
  
  // Snap to grid if enabled
  if (snapToGridEnabled) {
    return {
      start: snapToGrid(start, gridSize),
      end: snapToGrid(end, gridSize)
    };
  }
  
  return { start, end };
}

/**
 * Normalize angle to range [0, π]
 * @param angle Angle in radians
 * @returns Normalized angle
 */
function normalizeAngle(angle: number): number {
  const pi = Math.PI;
  // Normalize to [-π, π]
  angle = ((angle + pi) % (2 * pi)) - pi;
  // Take absolute value to get [0, π]
  return Math.abs(angle);
}
