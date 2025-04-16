
import { Point } from '@/types/core/Point';

/**
 * Grid size for snapping
 */
const GRID_SIZE = 20;

/**
 * Snaps a point to the grid
 * @param point Point to snap
 * @param gridSize Grid size in pixels
 * @returns Snapped point
 */
export const snapToGrid = (point: Point, gridSize: number = GRID_SIZE): Point => {
  return {
    x: Math.round(point.x / gridSize) * gridSize,
    y: Math.round(point.y / gridSize) * gridSize
  };
};

/**
 * Calculate distance between two points
 * @param point1 First point
 * @param point2 Second point
 * @returns Distance in pixels
 */
export const calculateDistance = (point1: Point, point2: Point): number => {
  const dx = point2.x - point1.x;
  const dy = point2.y - point1.y;
  return Math.sqrt(dx * dx + dy * dy);
};

/**
 * Calculate angle between two points in degrees
 * @param point1 First point
 * @param point2 Second point
 * @returns Angle in degrees
 */
export const calculateAngle = (point1: Point, point2: Point): number => {
  const dx = point2.x - point1.x;
  const dy = point2.y - point1.y;
  return Math.atan2(dy, dx) * 180 / Math.PI;
};

/**
 * Snap a point to the nearest angle
 * @param startPoint Origin point
 * @param endPoint Point to constrain
 * @param angleStep Angle step in degrees
 * @returns Constrained point
 */
export const snapToAngle = (startPoint: Point, endPoint: Point, angleStep: number = 45): Point => {
  const dx = endPoint.x - startPoint.x;
  const dy = endPoint.y - startPoint.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  let angle = Math.atan2(dy, dx) * 180 / Math.PI;
  
  // Snap to nearest angle step
  angle = Math.round(angle / angleStep) * angleStep;
  
  // Convert back to radians
  const radians = angle * Math.PI / 180;
  
  // Calculate new point
  return {
    x: startPoint.x + Math.cos(radians) * distance,
    y: startPoint.y + Math.sin(radians) * distance
  };
};
