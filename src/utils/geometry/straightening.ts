/**
 * Line straightening utilities
 * Provides functions for straightening wall lines and strokes
 * @module geometry/straightening
 */
import { Point } from '@/types/drawingTypes';
import { snapToGrid } from '../grid/core';
import { GRID_SIZE } from '../drawing';

/**
 * Straightens a stroke to ensure perfect horizontal or vertical alignment
 * Critical for creating accurate wall layouts by eliminating diagonal lines
 * 
 * @param {Point[]} points - The array of points to straighten
 * @returns {Point[]} Straightened array of points
 */
export const straightenStroke = (points: Point[]): Point[] => {
  if (!points || points.length < 2) return points;
  
  const result: Point[] = [];
  let lastPoint = points[0];
  result.push(lastPoint);
  
  // Process all points except the first and last
  for (let i = 1; i < points.length - 1; i++) {
    const currentPoint = points[i];
    const nextPoint = points[i + 1];
    
    // Check if we should force horizontal or vertical
    const deltaX = Math.abs(currentPoint.x - lastPoint.x);
    const deltaY = Math.abs(currentPoint.y - lastPoint.y);
    
    // Decide if this should be a horizontal or vertical line
    if (deltaX >= deltaY) {
      // Horizontal line - keep X, snap Y to last point
      result.push({
        x: currentPoint.x,
        y: lastPoint.y
      });
    } else {
      // Vertical line - keep Y, snap X to last point
      result.push({
        x: lastPoint.x,
        y: currentPoint.y
      });
    }
    
    lastPoint = result[result.length - 1];
  }
  
  // Add the last point
  if (points.length > 1) {
    result.push(points[points.length - 1]);
  }
  
  // Ensure all points are snapped to the grid
  return result.map(point => snapToGrid(point, GRID_SIZE));
};
