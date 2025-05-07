/**
 * Geometry Engine Hook
 * Provides geometry calculation utilities for canvas operations
 */
import { useCallback } from 'react';
import * as geometryEngine from '@/utils/geometry/engine';
import { Point } from '@/types/core/Geometry';

export const useGeometryEngine = () => {
  /**
   * Calculate the area of a polygon
   */
  const calculatePolygonArea = useCallback(async (points: Point[]): Promise<number> => {
    if (points.length < 3) return 0;
    return geometryEngine.calculatePolygonArea(points);
  }, []);

  /**
   * Calculate the distance between two points
   */
  const calculateDistance = useCallback((point1: Point, point2: Point): number => {
    return geometryEngine.calculateDistance(point1, point2);
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
    return geometryEngine.findCenter(points);
  }, []);

  /**
   * Check if a point is inside a polygon
   */
  const isPointInPolygon = useCallback((point: Point, polygon: Point[]): boolean => {
    return geometryEngine.isPointInsidePolygon(point, polygon);
  }, []);

  /**
   * Calculate the area of a bounding box
   */
  const calculateBoundingBoxArea = (rect?: { left?: number, top?: number, width?: number, height?: number }) => {
    if (!rect) return 0;
    
    // Add proper null checks
    const left = rect.left ?? 0;
    const top = rect.top ?? 0;
    const width = rect.width ?? 0;
    const height = rect.height ?? 0;
    
    return width * height;
  };

  return {
    calculatePolygonArea,
    calculateDistance,
    isPolygonClockwise,
    calculateCenter,
    isPointInPolygon,
    calculateBoundingBoxArea
  };
};
