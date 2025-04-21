
/**
 * Geometry Engine Hook
 * Provides geometry calculation utilities for canvas operations
 */
import { useCallback } from 'react';
import { calculatePolygonArea, calculateDistance, findCenter, isPointInsidePolygon } from '@/utils/geometry/engine';
import { Point } from '@/types/core/Point';

export const useGeometryEngine = () => {
  /**
   * Calculate the area of a polygon
   */
  const calculateArea = useCallback(async (points: Point[]): Promise<number> => {
    if (points.length < 3) return 0;
    return calculatePolygonArea(points);
  }, []);

  /**
   * Calculate the distance between two points
   */
  const calculateDistance = useCallback((point1: Point, point2: Point): number => {
    return Math.sqrt(
      Math.pow(point2.x - point1.x, 2) + 
      Math.pow(point2.y - point1.y, 2)
    );
  }, []);

  /**
   * Check if polygon points are in clockwise order
   */
  const isPolygonClockwise = useCallback((points: Point[]): boolean => {
    if (points.length < 3) return true;
    
    // Calculate the sum of edges using the shoelace formula
    let sum = 0;
    for (let i = 0; i < points.length; i++) {
      const j = (i + 1) % points.length;
      sum += (points[j].x - points[i].x) * (points[j].y + points[i].y);
    }
    
    // If sum > 0, points are in clockwise order
    return sum > 0;
  }, []);

  /**
   * Calculate the center point of a polygon
   */
  const calculateCenter = useCallback((points: Point[]): Point => {
    if (points.length === 0) return { x: 0, y: 0 };
    return findCenter(points);
  }, []);

  /**
   * Check if a point is inside a polygon
   */
  const isPointInPolygon = useCallback((point: Point, polygon: Point[]): boolean => {
    return isPointInsidePolygon(point, polygon);
  }, []);

  return {
    calculatePolygonArea: calculateArea,
    calculateDistance,
    isPolygonClockwise,
    calculateCenter,
    isPointInPolygon
  };
};
