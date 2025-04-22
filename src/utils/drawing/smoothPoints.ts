
/**
 * Utilities for smoothing drawing points
 * Especially useful for stylus and Apple Pencil input
 * @module utils/drawing/smoothPoints
 */
import { Point } from '@/types/core/Geometry';

/**
 * Apply a simple moving average filter to smooth points
 * @param points Array of points to smooth
 * @param windowSize Size of the smoothing window (odd number recommended)
 * @returns Smoothed array of points
 */
export function smoothPoints(points: Point[], windowSize = 3): Point[] {
  if (points.length <= 2 || windowSize < 2) return [...points];
  
  return points.map((_, i, arr) => {
    // Get surrounding points based on window size
    const startIdx = Math.max(0, i - Math.floor(windowSize / 2));
    const endIdx = Math.min(arr.length - 1, i + Math.floor(windowSize / 2));
    const windowPoints = arr.slice(startIdx, endIdx + 1);
    
    // Calculate the average
    const sumX = windowPoints.reduce((sum, p) => sum + p.x, 0);
    const sumY = windowPoints.reduce((sum, p) => sum + p.y, 0);
    
    return {
      x: sumX / windowPoints.length,
      y: sumY / windowPoints.length
    };
  });
}

/**
 * Apply Bezier curve smoothing to a set of points
 * Creates a smoother, more natural curve through the points
 * @param points Array of points to smooth
 * @param tension Tension factor (0.0 to 1.0), higher = smoother
 * @param numSegments Number of segments to add between points
 * @returns Smoothed array of points with additional interpolated points
 */
export function smoothPointsWithBezier(
  points: Point[],
  tension = 0.3,
  numSegments = 3
): Point[] {
  if (points.length < 3) return [...points];
  
  const result: Point[] = [];
  
  // Add the first point
  result.push({ ...points[0] });
  
  // Process the middle points
  for (let i = 1; i < points.length - 1; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const next = points[i + 1];
    
    // Calculate control points
    const controlX1 = curr.x - (next.x - prev.x) * tension;
    const controlY1 = curr.y - (next.y - prev.y) * tension;
    const controlX2 = curr.x + (next.x - prev.x) * tension;
    const controlY2 = curr.y + (next.y - prev.y) * tension;
    
    // Add bezier curve segments
    for (let t = 0; t <= 1; t += 1 / numSegments) {
      // Cubic bezier formula
      const x = (1 - t) * (1 - t) * (1 - t) * prev.x +
               3 * (1 - t) * (1 - t) * t * controlX1 +
               3 * (1 - t) * t * t * controlX2 +
               t * t * t * curr.x;
               
      const y = (1 - t) * (1 - t) * (1 - t) * prev.y +
               3 * (1 - t) * (1 - t) * t * controlY1 +
               3 * (1 - t) * t * t * controlY2 +
               t * t * t * curr.y;
               
      if (t > 0) { // Skip first point to avoid duplication
        result.push({ x, y });
      }
    }
  }
  
  // Add the last point
  result.push({ ...points[points.length - 1] });
  
  return result;
}

/**
 * Use pressure data to adjust stroke width
 * @param pressure Pressure value (0.0 to 1.0)
 * @param baseWidth Base width for the stroke
 * @param minWidthRatio Minimum width as ratio of base width
 * @param maxWidthRatio Maximum width as ratio of base width
 * @returns Adjusted stroke width
 */
export function getPressureAdjustedWidth(
  pressure: number,
  baseWidth: number,
  minWidthRatio = 0.5,
  maxWidthRatio = 2.0
): number {
  // Ensure pressure is between 0 and 1
  const normalizedPressure = Math.min(Math.max(pressure, 0), 1);
  
  // Apply a curve to make it feel more natural (squared)
  const adjustedPressure = normalizedPressure * normalizedPressure;
  
  // Calculate width with constraints
  const minWidth = baseWidth * minWidthRatio;
  const maxWidth = baseWidth * maxWidthRatio;
  const range = maxWidth - minWidth;
  
  return minWidth + (range * adjustedPressure);
}
