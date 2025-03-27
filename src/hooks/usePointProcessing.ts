
/**
 * Point processing hook
 * Handles operations on points and coordinates
 * @module hooks/usePointProcessing
 */
import { useCallback } from 'react';
import { Point } from '@/types/drawingTypes';

/**
 * Constants for point processing
 */
const POINT_PROCESSING_CONSTANTS = {
  /** Default tolerance for point proximity checks */
  DEFAULT_TOLERANCE: 5,
  
  /** Minimum distance for point filtering */
  MIN_POINT_DISTANCE: 2,
  
  /** Default distance for point smoothing */
  SMOOTHING_DISTANCE: 3
};

/**
 * Result type for point processing hook
 */
interface UsePointProcessingResult {
  /** Calculate distance between two points */
  calculateDistance: (point1: Point, point2: Point) => number;
  /** Check if two points are close to each other */
  arePointsClose: (point1: Point, point2: Point, tolerance?: number) => boolean;
  /** Filter points by minimum distance */
  filterPoints: (points: Point[], minDistance?: number) => Point[];
  /** Calculate midpoint between two points */
  calculateMidpoint: (point1: Point, point2: Point) => Point;
  /** Simplify a path by removing redundant points */
  simplifyPath: (points: Point[], tolerance?: number) => Point[];
}

/**
 * Hook for point-related operations
 * @returns Functions for point processing
 */
export const usePointProcessing = (): UsePointProcessingResult => {
  /**
   * Calculate the Euclidean distance between two points
   * 
   * @param point1 - First point
   * @param point2 - Second point
   * @returns Distance between the points
   */
  const calculateDistance = useCallback((point1: Point, point2: Point): number => {
    const dx = point2.x - point1.x;
    const dy = point2.y - point1.y;
    return Math.sqrt(dx * dx + dy * dy);
  }, []);
  
  /**
   * Check if two points are close to each other
   * 
   * @param point1 - First point
   * @param point2 - Second point
   * @param tolerance - Distance threshold
   * @returns Whether points are within tolerance
   */
  const arePointsClose = useCallback((
    point1: Point,
    point2: Point,
    tolerance: number = POINT_PROCESSING_CONSTANTS.DEFAULT_TOLERANCE
  ): boolean => {
    return calculateDistance(point1, point2) <= tolerance;
  }, [calculateDistance]);
  
  /**
   * Filter an array of points to remove points that are too close
   * 
   * @param points - Array of points to filter
   * @param minDistance - Minimum distance between points
   * @returns Filtered array of points
   */
  const filterPoints = useCallback((
    points: Point[],
    minDistance: number = POINT_PROCESSING_CONSTANTS.MIN_POINT_DISTANCE
  ): Point[] => {
    if (points.length <= 1) return points;
    
    const result: Point[] = [points[0]];
    
    for (let i = 1; i < points.length; i++) {
      const lastPoint = result[result.length - 1];
      
      // Only add point if it's far enough from the last added point
      if (!arePointsClose(lastPoint, points[i], minDistance)) {
        result.push(points[i]);
      }
    }
    
    return result;
  }, [arePointsClose]);
  
  /**
   * Calculate the midpoint between two points
   * 
   * @param point1 - First point
   * @param point2 - Second point
   * @returns Midpoint
   */
  const calculateMidpoint = useCallback((point1: Point, point2: Point): Point => {
    return {
      x: (point1.x + point2.x) / 2,
      y: (point1.y + point2.y) / 2
    };
  }, []);
  
  /**
   * Simplify a path by removing redundant points
   * Basic implementation of the Ramer-Douglas-Peucker algorithm
   * 
   * @param points - Array of points to simplify
   * @param tolerance - Tolerance for simplification
   * @returns Simplified array of points
   */
  const simplifyPath = useCallback((
    points: Point[],
    tolerance: number = POINT_PROCESSING_CONSTANTS.DEFAULT_TOLERANCE
  ): Point[] => {
    if (points.length <= 2) return points;
    
    // Implementation of path simplification algorithm
    // This is a simplified version
    let maxDistance = 0;
    let index = 0;
    
    // Find point with maximum distance
    for (let i = 1; i < points.length - 1; i++) {
      const distance = calculateDistance(
        calculateMidpoint(points[0], points[points.length - 1]),
        points[i]
      );
      
      if (distance > maxDistance) {
        maxDistance = distance;
        index = i;
      }
    }
    
    // If max distance is greater than tolerance, recursively simplify
    if (maxDistance > tolerance) {
      // Recursive simplification
      const firstSegment = simplifyPath(points.slice(0, index + 1), tolerance);
      const secondSegment = simplifyPath(points.slice(index), tolerance);
      
      // Combine segments (remove duplicate point)
      return [...firstSegment.slice(0, -1), ...secondSegment];
    }
    
    // If max distance is less than tolerance, use only endpoints
    return [points[0], points[points.length - 1]];
  }, [calculateDistance, calculateMidpoint]);
  
  return {
    calculateDistance,
    arePointsClose,
    filterPoints,
    calculateMidpoint,
    simplifyPath
  };
};
