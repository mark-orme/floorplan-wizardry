
/**
 * Line straightening utilities
 * @module geometry/straightening
 */
import { Point } from '@/types/geometryTypes';
import { calculateAngle } from './lineOperations';

/**
 * Straighten a line to the nearest cardinal or ordinal direction
 * 
 * @param {Point} start - Start point
 * @param {Point} end - End point
 * @returns {Point} New end point for straightened line
 */
export const straightenLine = (start: Point, end: Point): Point => {
  // Calculate angle and distance
  const angle = calculateAngle(start, end);
  const distance = Math.sqrt(
    Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2)
  );
  
  // Snap to nearest 45 degree angle
  const snapAngle = Math.round(angle / 45) * 45;
  const snapAngleRadians = (snapAngle * Math.PI) / 180;
  
  // Calculate new endpoint
  return {
    x: start.x + Math.cos(snapAngleRadians) * distance,
    y: start.y + Math.sin(snapAngleRadians) * distance
  };
};

/**
 * Straighten a polygon (array of points) to the nearest cardinal or ordinal directions
 * 
 * @param {Point[]} points - Points defining the polygon
 * @returns {Point[]} Straightened points
 */
export const straightenPolygon = (points: Point[]): Point[] => {
  if (points.length < 2) return [...points];
  
  const result: Point[] = [points[0]]; // Keep the first point as is
  
  // Straighten each segment
  for (let i = 1; i < points.length; i++) {
    const start = result[i - 1];
    const end = points[i];
    const straightened = straightenLine(start, end);
    result.push(straightened);
  }
  
  return result;
};

/**
 * Check if a line is already straightened
 * 
 * @param {Point} start - Start point
 * @param {Point} end - End point
 * @param {number} [tolerance=5] - Angle tolerance in degrees
 * @returns {boolean} Whether the line is already straightened
 */
export const isLineStraight = (
  start: Point,
  end: Point,
  tolerance = 5
): boolean => {
  const angle = calculateAngle(start, end);
  const snapAngle = Math.round(angle / 45) * 45;
  
  return Math.abs(angle - snapAngle) <= tolerance;
};

/**
 * Get the nearest straight angle for a line
 * 
 * @param {Point} start - Start point
 * @param {Point} end - End point
 * @returns {number} Nearest standard angle in degrees
 */
export const getNearestStraightAngle = (start: Point, end: Point): number => {
  const angle = calculateAngle(start, end);
  return Math.round(angle / 45) * 45;
};

/**
 * Determines whether the given angle is close to horizontal or vertical
 * 
 * @param {number} angle - Angle in degrees
 * @param {number} [tolerance=10] - Tolerance in degrees
 * @returns {boolean} Whether the angle is close to horizontal or vertical
 */
export const isHorizontalOrVertical = (angle: number, tolerance = 10): boolean => {
  // Normalize angle to 0-360
  const normalizedAngle = ((angle % 360) + 360) % 360;
  
  // Check if close to 0, 90, 180, or 270 degrees
  return (
    Math.abs(normalizedAngle) <= tolerance ||
    Math.abs(normalizedAngle - 90) <= tolerance ||
    Math.abs(normalizedAngle - 180) <= tolerance ||
    Math.abs(normalizedAngle - 270) <= tolerance ||
    Math.abs(normalizedAngle - 360) <= tolerance
  );
};

/**
 * Straighten a stroke (array of points) while maintaining relative positions
 * 
 * @param {Point[]} points - Points defining the stroke
 * @returns {Point[]} Straightened points
 */
export const straightenStroke = (points: Point[]): Point[] => {
  if (points.length < 2) return [...points];
  
  return straightenPolygon(points);
};

/**
 * Check if walls are aligned (parallel or perpendicular)
 * 
 * @param {Point[]} strokeA - First wall stroke
 * @param {Point[]} strokeB - Second wall stroke
 * @param {number} [tolerance=3] - Angle tolerance in degrees
 * @returns {boolean} Whether the walls are aligned
 */
export const hasAlignedWalls = (
  strokeA: Point[],
  strokeB: Point[],
  tolerance = 3
): boolean => {
  if (strokeA.length < 2 || strokeB.length < 2) return false;
  
  // Get the main directions of the strokes
  const angleA = calculateAngle(strokeA[0], strokeA[strokeA.length - 1]);
  const angleB = calculateAngle(strokeB[0], strokeB[strokeB.length - 1]);
  
  // Normalize angles to 0-90 degrees (treating perpendicular as aligned)
  const normA = angleA % 90;
  const normB = angleB % 90;
  
  // Check if angles are within tolerance
  return Math.abs(normA - normB) <= tolerance;
};
