
import { Point } from '@/types/core/Point';

/**
 * Calculates the distance between two points
 */
export const calculateDistance = (point1: Point, point2: Point): number => {
  const dx = point2.x - point1.x;
  const dy = point2.y - point1.y;
  return Math.sqrt(dx * dx + dy * dy);
};

/**
 * Calculates the angle between two points in degrees
 */
export const calculateAngle = (point1: Point, point2: Point): number => {
  const dx = point2.x - point1.x;
  const dy = point2.y - point1.y;
  let angle = Math.atan2(dy, dx) * (180 / Math.PI);
  return angle < 0 ? angle + 360 : angle;
};

/**
 * Calculates the midpoint between two points
 */
export const calculateMidpoint = (point1: Point, point2: Point): Point => {
  return {
    x: (point1.x + point2.x) / 2,
    y: (point1.y + point2.y) / 2
  };
};

/**
 * Snaps a point to the closest grid intersection
 */
export const snapToGrid = (point: Point, gridSize: number): Point => {
  return {
    x: Math.round(point.x / gridSize) * gridSize,
    y: Math.round(point.y / gridSize) * gridSize
  };
};

/**
 * Snaps both endpoints of a line to the grid
 */
export const snapLineToGrid = (start: Point, end: Point, gridSize: number): [Point, Point] => {
  return [
    snapToGrid(start, gridSize),
    snapToGrid(end, gridSize)
  ];
};

/**
 * Checks if a value is an exact multiple of the grid size
 */
export const isExactGridMultiple = (value: number, gridSize: number): boolean => {
  // Using epsilon for floating point comparison
  const epsilon = 0.0001;
  return Math.abs(Math.round(value / gridSize) * gridSize - value) < epsilon;
};

/**
 * Checks if a line is aligned with the grid
 */
export const isLineAlignedWithGrid = (start: Point, end: Point): boolean => {
  // Line is aligned if it's horizontal or vertical
  return start.x === end.x || start.y === end.y;
};
