
import { Point } from "@/types/core/Point";

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
 * @returns Constrained end point
 */
export const constrainToMajorAngles = (startPoint: Point, endPoint: Point): Point => {
  return snapToAngle(startPoint, endPoint, 45);
};

/**
 * Checks if a point is on a grid intersection
 * 
 * @param point Point to check
 * @param gridSize Grid size (default: 20px)
 * @returns Whether the point is on a grid intersection
 */
export const isPointOnGrid = (point: Point, gridSize: number = 20): boolean => {
  return point.x % gridSize === 0 && point.y % gridSize === 0;
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
): 'grid' | 'angle' | 'object' | null => {
  if (snapTypes.grid && isPointOnGrid(point)) {
    return 'grid';
  }
  if (snapTypes.angle) {
    return 'angle';
  }
  if (snapTypes.object) {
    return 'object';
  }
  return null;
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

// Export aliases for backward compatibility
export const snap = snapPointToGrid;
export const snapToGrid = snapPointToGrid;
export const snapLineToStandardAngles = snapToAngle;
export const distanceToGrid = (point: Point, gridSize: number = 20): number => {
  const snappedPoint = snapPointToGrid(point, gridSize);
  const dx = point.x - snappedPoint.x;
  const dy = point.y - snappedPoint.y;
  return Math.sqrt(dx * dx + dy * dy);
};

export const distanceToGridLine = (point: Point, gridSize: number = 20): number => {
  return Math.min(
    point.x % gridSize, // Distance to vertical grid line
    point.y % gridSize  // Distance to horizontal grid line
  );
};

export const getNearestGridPoint = snapPointToGrid;
