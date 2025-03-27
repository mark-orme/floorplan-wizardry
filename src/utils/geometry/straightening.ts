
/**
 * Line straightening utilities module
 * Functions for straightening lines and shapes
 * @module geometry/straightening
 */
import { Point } from '@/types/drawingTypes';
import { calculateAngle } from './lineOperations';
import { ANGLE_SNAP_THRESHOLD } from './constants';

/**
 * Straightening operation constants
 * Defines thresholds and angles for straightening operations
 */
const STRAIGHTENING_CONSTANTS = {
  /**
   * Standard angle increment for snapping in degrees
   * Lines will snap to multiples of this angle
   * @constant {number}
   */
  STANDARD_ANGLE_INCREMENT: 45,
  
  /**
   * Minimum angle difference in degrees to consider walls aligned
   * Used for floor plan validation
   * @constant {number}
   */
  ALIGNMENT_DIFFERENCE_THRESHOLD: 3,
  
  /**
   * Orthogonal angle increment in degrees
   * Used for horizontal/vertical snapping
   * @constant {number}
   */
  ORTHOGONAL_INCREMENT: 90,
  
  /**
   * Standard angles for snapping in degrees
   * Common angles that lines will snap to
   * @constant {number[]}
   */
  STANDARD_ANGLES: [0, 45, 90, 135, 180, 225, 270, 315]
};

/**
 * Straighten a line by aligning it to the nearest cardinal or 45° angle
 * Critical for creating clean floor plans with consistent angles
 * 
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
  const snapIncrement = STRAIGHTENING_CONSTANTS.STANDARD_ANGLE_INCREMENT;
  const snapAngle = Math.round(angle / snapIncrement) * snapIncrement;
  
  // Check if we should snap
  if (Math.abs(angle - snapAngle) <= threshold) {
    // Convert back to radians for calculation
    const radians = snapAngle * (Math.PI / 180);
    
    // Calculate new end point along the snapped angle
    // Using trigonometric functions to maintain the same distance from start
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
 * Creates cleaner room shapes with consistent angles
 * 
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
 * 
 * @param {Point[]} points - Array of points forming the polygon
 * @param {number} threshold - Angle threshold in degrees
 * @returns {boolean} Whether the polygon has aligned walls
 */
export const hasAlignedWalls = (
  points: Point[], 
  threshold: number = STRAIGHTENING_CONSTANTS.ALIGNMENT_DIFFERENCE_THRESHOLD
): boolean => {
  if (!points || points.length < 3) return false;
  
  const n = points.length;
  
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    
    const angle = calculateAngle(points[i], points[j]);
    const mod90 = angle % STRAIGHTENING_CONSTANTS.ORTHOGONAL_INCREMENT;
    
    // Check if any wall is not aligned to 0°, 90°, 180°, 270°
    // We check both mod90 and (90-mod90) to handle angles in any quadrant
    if (Math.min(mod90, STRAIGHTENING_CONSTANTS.ORTHOGONAL_INCREMENT - mod90) > threshold) {
      return false;
    }
  }
  
  return true;
};

/**
 * Straighten a stroke (sequence of points) to create cleaner lines
 * Simplifies free-hand drawing into straight line segments
 * 
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
 * Quantize an angle to the nearest standard increment
 * Used for straightening lines during drawing
 * 
 * @param {number} angle - Angle in degrees
 * @param {number} increment - Angle increment for quantization (default: 45°)
 * @returns {number} Quantized angle in degrees
 */
export const quantizeAngle = (
  angle: number, 
  increment: number = STRAIGHTENING_CONSTANTS.STANDARD_ANGLE_INCREMENT
): number => {
  // Normalize to 0-360 range
  while (angle < 0) angle += 360;
  angle = angle % 360;
  
  // Quantize to nearest increment
  return Math.round(angle / increment) * increment;
};

/**
 * Apply angle quantization to a line defined by two points
 * Creates a new end point that maintains distance but adjusts angle
 * Essential for ensuring clean, professional-looking floor plans
 * 
 * @param {Point} start - Start point of the line
 * @param {Point} end - End point of the line
 * @param {number} [increment] - Angle increment for quantization (default: 45°)
 * @param {number[]} [allowedAngles] - Array of allowed angles for snapping
 * @returns {Point} New end point with quantized angle
 */
export const applyAngleQuantization = (
  start: Point, 
  end: Point, 
  increment?: number,
  allowedAngles?: number[]
): Point => {
  if (!start || !end) return end;
  
  // Calculate distance between points
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  // Calculate angle in degrees
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);
  
  // Quantize the angle - either to specific allowed angles or to increments
  let quantizedAngle: number;
  
  if (allowedAngles && allowedAngles.length > 0) {
    // Find closest allowed angle
    let closestAngle = allowedAngles[0];
    let minDiff = Math.abs(angle - closestAngle);
    
    for (const allowed of allowedAngles) {
      const diff = Math.abs(angle - allowed);
      if (diff < minDiff) {
        minDiff = diff;
        closestAngle = allowed;
      }
    }
    
    quantizedAngle = closestAngle;
  } else {
    // Use increment-based quantization
    quantizedAngle = quantizeAngle(angle, increment || STRAIGHTENING_CONSTANTS.STANDARD_ANGLE_INCREMENT);
  }
  
  // Convert back to radians for trigonometric calculations
  const radians = quantizedAngle * (Math.PI / 180);
  
  // Return new end point maintaining the original distance but with adjusted angle
  return {
    x: start.x + distance * Math.cos(radians),
    y: start.y + distance * Math.sin(radians)
  };
};

