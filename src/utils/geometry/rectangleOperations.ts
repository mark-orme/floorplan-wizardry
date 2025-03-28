
/**
 * Rectangle operation utilities
 * @module utils/geometry/rectangleOperations
 */
import { Point, Rectangle } from '@/types/geometryTypes';

/**
 * Create a rectangle from two points
 * @param p1 First point (any corner)
 * @param p2 Second point (opposite corner)
 * @returns Rectangle object
 */
export const createRectFromPoints = (p1: Point, p2: Point): Rectangle => {
  const x = Math.min(p1.x, p2.x);
  const y = Math.min(p1.y, p2.y);
  const width = Math.abs(p2.x - p1.x);
  const height = Math.abs(p2.y - p1.y);
  
  return { x, y, width, height };
};

/**
 * Get the four corners of a rectangle
 * @param rect Rectangle object
 * @returns Array of corner points [topLeft, topRight, bottomRight, bottomLeft]
 */
export const getRectangleCorners = (rect: Rectangle): Point[] => {
  const { x, y, width, height } = rect;
  
  return [
    { x, y },                    // Top-left
    { x: x + width, y },         // Top-right
    { x: x + width, y: y + height }, // Bottom-right
    { x, y: y + height }         // Bottom-left
  ];
};

/**
 * Get the center of a rectangle
 * @param rect Rectangle object
 * @returns Center point
 */
export const getRectangleCenter = (rect: Rectangle): Point => {
  return {
    x: rect.x + rect.width / 2,
    y: rect.y + rect.height / 2
  };
};

/**
 * Check if a point is inside a rectangle
 * @param point Point to check
 * @param rect Rectangle object
 * @returns True if point is inside rectangle
 */
export const isPointInRectangle = (point: Point, rect: Rectangle): boolean => {
  return (
    point.x >= rect.x && 
    point.x <= rect.x + rect.width && 
    point.y >= rect.y && 
    point.y <= rect.y + rect.height
  );
};

/**
 * Calculate the area of a rectangle
 * @param rect Rectangle object
 * @returns Area of the rectangle
 */
export const calculateRectangleArea = (rect: Rectangle): number => {
  return rect.width * rect.height;
};

/**
 * Calculate the perimeter of a rectangle
 * @param rect Rectangle object
 * @returns Perimeter of the rectangle
 */
export const calculateRectanglePerimeter = (rect: Rectangle): number => {
  return 2 * (rect.width + rect.height);
};
