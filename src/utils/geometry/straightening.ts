/**
 * Path straightening utilities
 * @module utils/geometry/straightening
 */
import { Point } from '@/types/geometryTypes';
import { calculateDistance, calculateAngle } from './lineOperations';

// Constants for angle snapping (in radians)
const HORIZONTAL_ANGLE = 0; // or Math.PI
const VERTICAL_ANGLE = Math.PI / 2; // or -Math.PI / 2
const DIAGONAL_ANGLE_POS = Math.PI / 4; // or 5 * Math.PI / 4
const DIAGONAL_ANGLE_NEG = -Math.PI / 4; // or 3 * Math.PI / 4
const ANGLE_TOLERANCE = 0.15; // ~8.6 degrees

/**
 * Check if two points are aligned to standard angles
 * @param p1 First point
 * @param p2 Second point
 * @returns True if points are aligned to standard angles
 */
export const arePointsAligned = (p1: Point, p2: Point): boolean => {
  const angle = calculateAngle(p1, p2);
  return isStandardAngle(angle);
};

/**
 * Check if an angle is close to a standard angle
 * @param angle Angle in radians
 * @returns True if angle is close to a standard angle
 */
export const isStandardAngle = (angle: number): boolean => {
  const normalizedAngle = normalizeAngle(angle);
  
  return (
    Math.abs(normalizedAngle - HORIZONTAL_ANGLE) <= ANGLE_TOLERANCE ||
    Math.abs(normalizedAngle - VERTICAL_ANGLE) <= ANGLE_TOLERANCE ||
    Math.abs(normalizedAngle - DIAGONAL_ANGLE_POS) <= ANGLE_TOLERANCE ||
    Math.abs(normalizedAngle - DIAGONAL_ANGLE_NEG) <= ANGLE_TOLERANCE ||
    Math.abs(Math.abs(normalizedAngle) - Math.PI) <= ANGLE_TOLERANCE // opposite of horizontal
  );
};

/**
 * Normalize angle to range between -PI and PI
 * @param angle Angle in radians
 * @returns Normalized angle
 */
const normalizeAngle = (angle: number): number => {
  let normalized = angle;
  while (normalized > Math.PI) normalized -= 2 * Math.PI;
  while (normalized < -Math.PI) normalized += 2 * Math.PI;
  return normalized;
};

/**
 * Snap an angle to the nearest standard angle
 * @param angle Angle in radians
 * @returns Snapped angle
 */
export const snapToStandardAngle = (angle: number): number => {
  const normalized = normalizeAngle(angle);
  
  // Find closest standard angle
  const angles = [
    HORIZONTAL_ANGLE,
    VERTICAL_ANGLE,
    DIAGONAL_ANGLE_POS,
    DIAGONAL_ANGLE_NEG,
    Math.PI, // opposite of horizontal
    -VERTICAL_ANGLE // opposite of vertical
  ];
  
  let closestAngle = angles[0];
  let minDiff = Math.abs(normalized - angles[0]);
  
  for (let i = 1; i < angles.length; i++) {
    const diff = Math.abs(normalized - angles[i]);
    if (diff < minDiff) {
      minDiff = diff;
      closestAngle = angles[i];
    }
  }
  
  return closestAngle;
};

/**
 * Straighten a polyline by snapping points to standard angles
 * @param points Polyline points
 * @returns Straightened polyline points
 */
export const straightenPolyline = (points: Point[]): Point[] => {
  if (points.length < 2) return [...points];
  
  const result: Point[] = [{ ...points[0] }]; // Start with first point
  
  for (let i = 1; i < points.length; i++) {
    const prevPoint = result[result.length - 1];
    const currentPoint = points[i];
    
    // Skip points that are too close to previous point
    if (calculateDistance(prevPoint, currentPoint) < 5) continue;
    
    // Get angle between previous and current point
    const angle = calculateAngle(prevPoint, currentPoint);
    const distance = calculateDistance(prevPoint, currentPoint);
    
    // If angle is close to a standard angle, straighten it
    if (Math.abs(angle - HORIZONTAL_ANGLE) <= ANGLE_TOLERANCE || 
        Math.abs(Math.abs(angle) - Math.PI) <= ANGLE_TOLERANCE) {
      // Horizontal line
      result.push({ x: currentPoint.x, y: prevPoint.y });
    } else if (Math.abs(Math.abs(angle) - VERTICAL_ANGLE) <= ANGLE_TOLERANCE) {
      // Vertical line
      result.push({ x: prevPoint.x, y: currentPoint.y });
    } else if (Math.abs(angle - DIAGONAL_ANGLE_POS) <= ANGLE_TOLERANCE || 
               Math.abs(angle - DIAGONAL_ANGLE_NEG) <= ANGLE_TOLERANCE) {
      // Diagonal line (45 degrees)
      const dx = currentPoint.x - prevPoint.x;
      const avgDelta = (Math.abs(dx) + Math.abs(currentPoint.y - prevPoint.y)) / 2;
      const signY = angle > 0 ? 1 : -1;
      result.push({ 
        x: prevPoint.x + (dx > 0 ? avgDelta : -avgDelta), 
        y: prevPoint.y + signY * avgDelta 
      });
    } else {
      // Keep original point for non-standard angles
      result.push({ ...currentPoint });
    }
  }
  
  return result;
};

/**
 * Also export as straightenLine for backward compatibility
 */
export const straightenLine = straightenPolyline;

/**
 * Check if a polygon has aligned walls (uses straightening internally)
 * @param points Polygon points
 * @returns True if polygon has aligned walls
 */
export const hasAlignedWalls = (points: Point[]): boolean => {
  if (points.length < 3) return false;
  
  // Check each segment
  for (let i = 0; i < points.length; i++) {
    const p1 = points[i];
    const p2 = points[(i + 1) % points.length];
    
    if (!arePointsAligned(p1, p2)) {
      return false;
    }
  }
  
  return true;
};

/**
 * Straighten a stroke (same as polyline but with alias for compatibility)
 * @param points Stroke points
 * @returns Straightened stroke points
 */
export const straightenStroke = straightenPolyline;

/**
 * Alias for straightenPolyline for backward compatibility
 */
export const straightenPolygon = straightenPolyline;
