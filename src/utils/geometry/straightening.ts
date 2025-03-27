
/**
 * Line straightening utilities module
 * Functions for straightening lines and shapes
 * @module geometry/straightening
 */
import { Point } from '@/types/drawingTypes';
import { calculateAngle } from './lineOperations';
import { ANGLE_SNAP_THRESHOLD } from './constants';

/**
 * Straighten a line by aligning it to the nearest cardinal or 45° angle
 * @param {Point} start - Start point of the line
 * @param {Point} end - End point of the line
 * @param {number} threshold - Angle threshold for snapping in degrees
 * @returns {Point} New end point for the straightened line
 */
export const straightenLine = (
  start: Point, 
  end: Point, 
  threshold: number = ANGLE_SNAP_THRESHOLD
): Point => {
  if (!start || !end) return end;
  
  // Calculate original distance and angle
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  // Get the angle and normalize to 0-360
  let angle = calculateAngle(start, end);
  
  // Find the nearest 45° increment
  const snapIncrement = 45;
  const snapAngle = Math.round(angle / snapIncrement) * snapIncrement;
  
  // Check if we should snap
  if (Math.abs(angle - snapAngle) <= threshold) {
    // Convert back to radians for calculation
    const radians = snapAngle * (Math.PI / 180);
    
    // Calculate new end point along the snapped angle
    return {
      x: start.x + distance * Math.cos(radians),
      y: start.y + distance * Math.sin(radians)
    };
  }
  
  // If not within threshold, return original end point
  return end;
};

/**
 * Straighten a polygon by aligning each segment to the nearest cardinal or 45° angle
 * @param {Point[]} points - Array of points forming the polygon
 * @param {number} threshold - Angle threshold for snapping in degrees
 * @returns {Point[]} New array of points for the straightened polygon
 */
export const straightenPolygon = (
  points: Point[], 
  threshold: number = ANGLE_SNAP_THRESHOLD
): Point[] => {
  if (!points || points.length < 3) return points;
  
  const result: Point[] = [];
  const n = points.length;
  
  // Keep the first point as is
  result.push({ ...points[0] });
  
  // Process each segment
  for (let i = 1; i < n; i++) {
    const prevPoint = result[i - 1];
    const currentPoint = points[i];
    
    // Straighten the current segment
    const straightenedPoint = straightenLine(prevPoint, currentPoint, threshold);
    result.push(straightenedPoint);
  }
  
  // Handle the closing segment if needed
  if (points[0] !== points[n - 1]) {
    // Make sure the polygon is closed with a straight line
    const closingPoint = straightenLine(result[n - 1], result[0], threshold);
    // Replace the first point with the corrected closing point
    result[0] = closingPoint;
  }
  
  return result;
};

/**
 * Check if a polygon has aligned walls (parallel to axes)
 * Used to validate floor plan geometry
 * @param {Point[]} points - Array of points forming the polygon
 * @param {number} threshold - Angle threshold in degrees
 * @returns {boolean} Whether the polygon has aligned walls
 */
export const hasAlignedWalls = (
  points: Point[], 
  threshold: number = ANGLE_SNAP_THRESHOLD
): boolean => {
  if (!points || points.length < 3) return false;
  
  const n = points.length;
  
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    
    const angle = calculateAngle(points[i], points[j]);
    const mod90 = angle % 90;
    
    // Check if any wall is not aligned to 0°, 90°, 180°, 270°
    if (Math.min(mod90, 90 - mod90) > threshold) {
      return false;
    }
  }
  
  return true;
};

/**
 * Straighten a stroke (sequence of points) to create cleaner lines
 * @param {Point[]} points - Array of points in the stroke
 * @param {number} threshold - Angle threshold for straightening
 * @returns {Point[]} Straightened points
 */
export const straightenStroke = (
  points: Point[],
  threshold: number = ANGLE_SNAP_THRESHOLD
): Point[] => {
  if (!points || points.length < 2) return points;
  
  // For simple two-point strokes, just straighten the line
  if (points.length === 2) {
    const end = straightenLine(points[0], points[1], threshold);
    return [points[0], end];
  }
  
  // For longer strokes, we need to analyze the overall direction
  const startPoint = points[0];
  const endPoint = points[points.length - 1];
  
  // Straighten the overall direction
  const straightEnd = straightenLine(startPoint, endPoint, threshold);
  
  // Create a new array with just the start and straightened end
  return [startPoint, straightEnd];
};

/**
 * Quantize an angle to the nearest 45° increment
 * Used for straightening lines during drawing
 * 
 * @param {number} angle - Angle in degrees
 * @returns {number} Quantized angle in degrees
 */
export const quantizeAngle = (angle: number): number => {
  // Normalize to 0-360 range
  while (angle < 0) angle += 360;
  angle = angle % 360;
  
  // Quantize to nearest 45° increment
  return Math.round(angle / 45) * 45;
};

/**
 * Apply angle quantization to a line defined by two points
 * Creates a new end point that maintains distance but adjusts angle
 * 
 * @param {Point} start - Start point of the line
 * @param {Point} end - End point of the line
 * @returns {Point} New end point with quantized angle
 */
export const applyAngleQuantization = (start: Point, end: Point): Point => {
  if (!start || !end) return end;
  
  // Calculate distance between points
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  // Calculate angle in degrees
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);
  
  // Quantize the angle
  const quantizedAngle = quantizeAngle(angle);
  
  // Convert back to radians
  const radians = quantizedAngle * (Math.PI / 180);
  
  // Return new end point
  return {
    x: start.x + distance * Math.cos(radians),
    y: start.y + distance * Math.sin(radians)
  };
};
