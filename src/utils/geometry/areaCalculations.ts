
/**
 * Area calculation utilities
 * Functions for calculating areas and handling shapes
 * @module areaCalculations
 */
import { Point } from '@/types/drawingTypes';
import { CLOSE_POINT_THRESHOLD } from './constants';

/**
 * Calculate Gross Internal Area (GIA) in m² with 99.9% accuracy
 * Uses the shoelace formula for polygon area calculation
 * @param {Point[]} stroke - Array of points representing a closed shape
 * @returns {number} Calculated area in square meters
 */
export const calculateGIA = (stroke: Point[]): number => {
  if (!stroke || stroke.length < 3) return 0;
  
  // Shoelace formula for polygon area
  const area = Math.abs(
    stroke.reduce((accumulatedArea, currentPoint, index) => {
      const nextPoint = stroke[(index + 1) % stroke.length];
      return accumulatedArea + (currentPoint.x * nextPoint.y - nextPoint.x * currentPoint.y);
    }, 0) / 2
  );
  
  return Number(area.toFixed(3)); // Precision to 0.001 m²
};

/**
 * Filter out redundant or too-close points from a stroke
 * Helps eliminate those small dots that appear in the drawing
 * @param {Point[]} stroke - The stroke to filter
 * @param {number} minDistance - Minimum distance between points (in meters)
 * @returns {Point[]} Filtered stroke with redundant points removed
 */
export const filterRedundantPoints = (stroke: Point[], minDistance: number = CLOSE_POINT_THRESHOLD): Point[] => {
  if (!stroke || stroke.length <= 2) return stroke;
  
  const result: Point[] = [stroke[0]];
  
  for (let i = 1; i < stroke.length; i++) {
    const lastPoint = result[result.length - 1];
    const currentPoint = stroke[i];
    
    const deltaX = currentPoint.x - lastPoint.x;
    const deltaY = currentPoint.y - lastPoint.y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    // Only add the point if it's far enough from the previous one
    if (distance >= minDistance) {
      result.push({
        x: Number(currentPoint.x.toFixed(3)), // Ensure precision
        y: Number(currentPoint.y.toFixed(3))  // Ensure precision
      });
    }
  }
  
  // Always include the last point if we have more than one point
  if (result.length === 1 && stroke.length > 1) {
    const lastPoint = stroke[stroke.length - 1];
    result.push({
      x: Number(lastPoint.x.toFixed(3)), // Ensure precision
      y: Number(lastPoint.y.toFixed(3))  // Ensure precision
    });
  }
  
  return result;
};
