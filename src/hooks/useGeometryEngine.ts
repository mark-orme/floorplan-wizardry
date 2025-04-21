
/**
 * Hook for using geometry engine features
 */
import { useCallback } from 'react';
import * as engine from '@/utils/geometry/engine';
import { Point } from '@/types/core/Geometry';

export const useGeometryEngine = () => {
  // Calculate area using the geometry engine
  const calculatePolygonArea = useCallback((points: Point[]): number => {
    try {
      return engine.calculatePolygonArea(points);
    } catch (err) {
      console.error('Error calculating area', err);
      return 0;
    }
  }, []);
  
  // Check if polygon points are in clockwise order
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
  
  // Calculate the center point of a polygon
  const calculateCenter = useCallback((points: Point[]): Point => {
    if (points.length === 0) return { x: 0, y: 0 };
    return engine.findCenter(points);
  }, []);
  
  // Check if a point is inside a polygon
  const isPointInPolygon = useCallback((point: Point, polygon: Point[]): boolean => {
    return engine.isPointInsidePolygon(point, polygon);
  }, []);
  
  // Scale a point from origin
  const scalePoint = useCallback((point: Point, origin: Point, scale: number): Point => {
    return engine.scalePoint(point, origin, scale, scale);
  }, []);
  
  // Rotate a point around origin
  const rotatePoint = useCallback((point: Point, origin: Point, angle: number): Point => {
    return engine.rotatePoint(point, origin, angle);
  }, []);
  
  // Check if a polygon is valid
  const validatePolygon = useCallback((points: Point[]): boolean => {
    return engine.validatePolygon(points);
  }, []);
  
  return {
    calculatePolygonArea,
    isPolygonClockwise,
    calculateCenter,
    isPointInPolygon,
    scalePoint,
    rotatePoint,
    validatePolygon
  };
};
