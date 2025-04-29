import { Point } from '@/types/core/Point';
import { SMALL_GRID_SIZE } from '@/constants/gridConstants';

/**
 * Snap a point to the nearest grid point
 */
export const snapToGrid = (point: Point, gridSize = SMALL_GRID_SIZE): Point => {
  return {
    x: Math.round(point.x / gridSize) * gridSize,
    y: Math.round(point.y / gridSize) * gridSize
  };
};

/**
 * Snap an angle to the nearest angle step
 */
export const snapToAngle = (
  start: Point, 
  end: Point, 
  angleStep = 45
): Point => {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const angle = Math.atan2(dy, dx);
  
  // Calculate distance
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  // Snap angle to nearest step
  const snappedAngle = Math.round(angle / (Math.PI * angleStep / 180)) * (Math.PI * angleStep / 180);
  
  // Calculate new end point using snapped angle and keeping the same distance
  return {
    x: start.x + Math.cos(snappedAngle) * distance,
    y: start.y + Math.sin(snappedAngle) * distance
  };
};

/**
 * Calculate angle between two points in degrees
 */
export const calculateAngle = (start: Point, end: Point): number => {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  
  // Calculate angle in degrees
  return Math.atan2(dy, dx) * 180 / Math.PI;
};

/**
 * Calculate distance between two points
 */
export const calculateDistance = (start: Point, end: Point): number => {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  
  return Math.sqrt(dx * dx + dy * dy);
};

/**
 * Get midpoint between two points
 */
export const getMidpoint = (start: Point, end: Point): Point => {
  return {
    x: (start.x + end.x) / 2,
    y: (start.y + end.y) / 2
  };
};
