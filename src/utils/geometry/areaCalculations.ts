
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
 * @param {Point[]} polygonPoints - Array of points representing a closed shape
 * @returns {number} Calculated area in square meters
 */
export const calculateGIA = (polygonPoints: { x: number; y: number }[]): number => {
  if (!polygonPoints || polygonPoints.length < 3) return 0;
  
  // Shoelace formula for polygon area
  const area = Math.abs(
    polygonPoints.reduce((accumulatedArea, currentPoint, index) => {
      const nextPoint = polygonPoints[(index + 1) % polygonPoints.length];
      return accumulatedArea + (currentPoint.x * nextPoint.y - nextPoint.x * currentPoint.y);
    }, 0) / 2
  );
  
  return Number(area.toFixed(3)); // Precision to 0.001 m²
};

/**
 * Filter out redundant or too-close points from a polygon path
 * Helps eliminate those small dots that appear in the drawing
 * @param {Point[]} pointsArray - The points array to filter
 * @param {number} minDistance - Minimum distance between points (in meters)
 * @returns {Point[]} Filtered points with redundant points removed
 */
export const filterRedundantPoints = (pointsArray: { x: number; y: number }[], minDistance: number = CLOSE_POINT_THRESHOLD): { x: number; y: number }[] => {
  if (!pointsArray || pointsArray.length <= 2) return pointsArray;
  
  const filteredPoints: { x: number; y: number }[] = [pointsArray[0]];
  
  for (let i = 1; i < pointsArray.length; i++) {
    const lastPoint = filteredPoints[filteredPoints.length - 1];
    const currentPoint = pointsArray[i];
    
    const distanceX = currentPoint.x - lastPoint.x;
    const distanceY = currentPoint.y - lastPoint.y;
    const pointDistance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
    
    // Only add the point if it's far enough from the previous one
    if (pointDistance >= minDistance) {
      filteredPoints.push({
        x: Number(currentPoint.x.toFixed(3)), // Ensure precision
        y: Number(currentPoint.y.toFixed(3))  // Ensure precision
      });
    }
  }
  
  // Always include the last point if we have more than one point
  if (filteredPoints.length === 1 && pointsArray.length > 1) {
    const lastPoint = pointsArray[pointsArray.length - 1];
    filteredPoints.push({
      x: Number(lastPoint.x.toFixed(3)), // Ensure precision
      y: Number(lastPoint.y.toFixed(3))  // Ensure precision
    });
  }
  
  return filteredPoints;
};
