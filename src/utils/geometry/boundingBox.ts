
/**
 * Bounding box utilities
 * @module geometry/boundingBox
 */
import { Point } from '@/types';

/**
 * Calculate the bounding box of a set of points
 * 
 * @param {Point[]} points - Array of points
 * @returns {object} Bounding box with min/max coordinates
 */
export const getBoundingBox = (points: Point[]) => {
  if (!points.length) {
    return { minX: 0, minY: 0, maxX: 0, maxY: 0, width: 0, height: 0 };
  }
  
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  
  for (const point of points) {
    minX = Math.min(minX, point.x);
    minY = Math.min(minY, point.y);
    maxX = Math.max(maxX, point.x);
    maxY = Math.max(maxY, point.y);
  }
  
  return {
    minX,
    minY,
    maxX,
    maxY,
    width: maxX - minX,
    height: maxY - minY
  };
};

/**
 * Calculate the midpoint of a set of points
 * 
 * @param {Point[]} points - Array of points
 * @returns {Point} Midpoint
 */
export const getMidpoint = (points: Point[]): Point => {
  if (!points.length) {
    return { x: 0, y: 0 } as Point;
  }
  
  const bbox = getBoundingBox(points);
  
  return {
    x: (bbox.minX + bbox.maxX) / 2,
    y: (bbox.minY + bbox.maxY) / 2
  } as Point;
};
