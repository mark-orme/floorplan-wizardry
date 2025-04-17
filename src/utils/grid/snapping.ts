
import { Point } from "@/types/core/Point";

/**
 * Snap a value to the nearest grid increment
 * 
 * @param value Value to snap
 * @param gridSize Grid size (default: 20px)
 * @returns Snapped value
 */
export const snap = (value: number, gridSize: number = 20): number => {
  return Math.round(value / gridSize) * gridSize;
};

/**
 * Snap a line to standard angles (0°, 45°, 90°, etc.)
 * 
 * @param startPoint Starting point of the line
 * @param endPoint End point of the line
 * @param angleStep Angle step in degrees (default: 45°)
 * @returns New end point constrained to the angle
 */
export const snapToAngle = (startPoint: Point, endPoint: Point, angleStep: number = 45): Point => {
  // Calculate the angle between the points
  const dx = endPoint.x - startPoint.x;
  const dy = endPoint.y - startPoint.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  let angle = Math.atan2(dy, dx) * 180 / Math.PI;
  
  // Snap the angle to the nearest step
  angle = Math.round(angle / angleStep) * angleStep;
  
  // Convert angle back to radians
  const angleRadians = angle * Math.PI / 180;
  
  // Calculate the new point based on the snapped angle
  return {
    x: startPoint.x + Math.cos(angleRadians) * distance,
    y: startPoint.y + Math.sin(angleRadians) * distance
  };
};

/**
 * Snap a point to the nearest grid intersection
 * 
 * @param point Point to snap
 * @param gridSize Grid size (default: 20px)
 * @returns Snapped point
 */
export const snapPointToGrid = (point: Point, gridSize: number = 20): Point => {
  return {
    x: Math.round(point.x / gridSize) * gridSize,
    y: Math.round(point.y / gridSize) * gridSize
  };
};

/**
 * Snap a line to the grid
 * 
 * @param startPoint Starting point of the line
 * @param endPoint End point of the line
 * @param gridSize Grid size (default: 20px)
 * @returns Snapped start and end points
 */
export const snapLineToGrid = (
  startPoint: Point, 
  endPoint: Point, 
  gridSize: number = 20
): { start: Point; end: Point } => {
  return {
    start: snapPointToGrid(startPoint, gridSize),
    end: snapPointToGrid(endPoint, gridSize)
  };
};

/**
 * Constrain a line to major angles (0°, 45°, 90°)
 * 
 * @param startPoint Starting point of the line
 * @param endPoint End point of the line
 * @returns Object containing constrained start and end points
 */
export const constrainToMajorAngles = (
  startPoint: Point, 
  endPoint: Point
): { start: Point; end: Point } => {
  const snappedEnd = snapToAngle(startPoint, endPoint, 45);
  return {
    start: startPoint,
    end: snappedEnd
  };
};

/**
 * Checks if a point is on a grid intersection
 * 
 * @param point Point to check
 * @param gridSize Grid size (default: 20px)
 * @param threshold Threshold for considering a point on grid (default: 0.5)
 * @returns Whether the point is on a grid intersection
 */
export const isPointOnGrid = (
  point: Point, 
  gridSize: number = 20,
  threshold: number = 0.5
): boolean => {
  const xOnGrid = Math.abs(point.x % gridSize) <= threshold || 
                  Math.abs(point.x % gridSize - gridSize) <= threshold;
  const yOnGrid = Math.abs(point.y % gridSize) <= threshold || 
                  Math.abs(point.y % gridSize - gridSize) <= threshold;
  return xOnGrid && yOnGrid;
};

/**
 * Find the nearest grid point to a given point
 * 
 * @param point Point to find nearest grid point for
 * @param gridSize Grid size (default: 20px)
 * @returns Nearest grid point
 */
export const getNearestGridPoint = (point: Point, gridSize: number = 20): Point => {
  return snapPointToGrid(point, gridSize);
};

/**
 * Calculate distance from a point to the nearest grid intersection
 * 
 * @param point Point to check
 * @param gridSize Grid size (default: 20px)
 * @returns Distance to nearest grid intersection
 */
export const distanceToGrid = (point: Point, gridSize: number = 20): number => {
  const snappedPoint = snapPointToGrid(point, gridSize);
  const dx = point.x - snappedPoint.x;
  const dy = point.y - snappedPoint.y;
  return Math.sqrt(dx * dx + dy * dy);
};

/**
 * Calculate distance from a point to the nearest grid lines
 * 
 * @param point Point to check
 * @param gridSize Grid size (default: 20px)
 * @returns Object with distances to nearest horizontal and vertical grid lines
 */
export const distanceToGridLine = (
  point: Point, 
  gridSize: number = 20
): { x: number; y: number } => {
  const nearestHorizontalLine = Math.round(point.y / gridSize) * gridSize;
  const nearestVerticalLine = Math.round(point.x / gridSize) * gridSize;
  
  return {
    x: Math.abs(point.x - nearestVerticalLine),
    y: Math.abs(point.y - nearestHorizontalLine)
  };
};

/**
 * Highlights what type of snapping is in effect
 * 
 * @param point Current point
 * @param snapTypes List of snap types to check
 * @returns The type of snap that is active, or null
 */
export const getActiveSnapType = (
  point: Point, 
  snapTypes: { grid?: boolean; angle?: boolean; object?: boolean; } = {}
): 'grid' | 'angle' | 'object' | 'both' | null => {
  let activeTypes = [];
  
  if (snapTypes.grid && isPointOnGrid(point)) {
    activeTypes.push('grid');
  }
  if (snapTypes.angle) {
    activeTypes.push('angle');
  }
  if (snapTypes.object) {
    activeTypes.push('object');
  }
  
  if (activeTypes.length === 0) {
    return null;
  }
  if (activeTypes.length > 1) {
    return 'both';
  }
  
  return activeTypes[0] as 'grid' | 'angle' | 'object';
};

/**
 * Formats the angle for display
 * 
 * @param angleInDegrees Angle in degrees
 * @returns Formatted angle string
 */
export const formatAngle = (angleInDegrees: number): string => {
  // Normalize angle to 0-360
  let normalizedAngle = angleInDegrees % 360;
  if (normalizedAngle < 0) normalizedAngle += 360;
  
  // Round to 1 decimal place
  return `${normalizedAngle.toFixed(1)}°`;
};

// Alias for backward compatibility
export const snapToGrid = snapPointToGrid;
export const snapLineToStandardAngles = snapToAngle;
