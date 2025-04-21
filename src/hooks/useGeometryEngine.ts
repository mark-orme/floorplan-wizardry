
/**
 * Geometry Engine Hook
 * Lazily loads geometry calculations, optionally using Web Workers for heavy operations
 */
import { useState, useCallback, useEffect, useMemo } from 'react';
import { Point, Polygon } from '@/types/core/Geometry';
import { useGeometryWorker } from './useGeometryWorker';

interface GeometryEngineOptions {
  useWorker?: boolean;
  precision?: number;
}

export const useGeometryEngine = (options: GeometryEngineOptions = {}) => {
  const { useWorker = true, precision = 6 } = options;
  
  // State for tracking initialization
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Use the geometry worker for offloading calculations
  const {
    initialized: workerInitialized,
    calculateArea: workerCalculateArea,
    calculateDistance: workerCalculateDistance,
    isProcessing: workerIsProcessing
  } = useGeometryWorker();
  
  // Dynamically load the geometry utilities
  useEffect(() => {
    let mounted = true;
    
    const initGeometryEngine = async () => {
      setIsLoading(true);
      
      try {
        if (useWorker) {
          // Wait for worker to be ready
          if (!workerInitialized) {
            // Worker will be initialized by the useGeometryWorker hook
            setIsInitialized(workerInitialized);
          } else {
            setIsInitialized(true);
          }
        } else {
          // Dynamically import geometry utilities
          const { initGeometryEngine } = await import('../utils/geometry/engine');
          await initGeometryEngine();
          
          if (mounted) {
            setIsInitialized(true);
          }
        }
      } catch (err) {
        console.error('Failed to initialize geometry engine:', err);
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Unknown initialization error');
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };
    
    initGeometryEngine();
    
    return () => {
      mounted = false;
    };
  }, [useWorker, workerInitialized]);
  
  /**
   * Calculate area of a polygon
   */
  const calculatePolygonArea = useCallback(async (points: Point[]): Promise<number> => {
    if (points.length < 3) return 0;
    
    try {
      if (useWorker && workerInitialized) {
        // Use web worker for calculation
        return await workerCalculateArea(points);
      } else {
        // Fall back to direct calculation
        const { calculatePolygonArea } = await import('../utils/geometry/engine');
        return calculatePolygonArea(points);
      }
    } catch (error) {
      console.error('Error calculating polygon area:', error);
      return 0;
    }
  }, [useWorker, workerInitialized, workerCalculateArea]);
  
  /**
   * Calculate distance between two points
   */
  const calculateDistance = useCallback(async (point1: Point, point2: Point): Promise<number> => {
    try {
      if (useWorker && workerInitialized) {
        // Use web worker for calculation
        return await workerCalculateDistance(point1, point2);
      } else {
        // Fall back to direct calculation
        const { calculateDistance } = await import('../utils/geometry/engine');
        return calculateDistance(point1, point2);
      }
    } catch (error) {
      console.error('Error calculating distance:', error);
      return 0;
    }
  }, [useWorker, workerInitialized, workerCalculateDistance]);
  
  /**
   * Check if a point is inside a polygon
   */
  const isPointInPolygon = useCallback(async (point: Point, polygonPoints: Point[]): Promise<boolean> => {
    try {
      if (useWorker && workerInitialized) {
        // Use web worker for calculation
        // This would need to be implemented in the worker
        const { isPointInPolygon } = await import('../utils/geometry/engine');
        return isPointInPolygon(point, polygonPoints);
      } else {
        // Direct calculation
        const { isPointInPolygon } = await import('../utils/geometry/engine');
        return isPointInPolygon(point, polygonPoints);
      }
    } catch (error) {
      console.error('Error checking if point is in polygon:', error);
      return false;
    }
  }, [useWorker, workerInitialized]);
  
  /**
   * Check if polygon vertices are ordered clockwise
   */
  const isPolygonClockwise = useCallback((points: Point[]): boolean => {
    if (points.length < 3) return false;
    
    // Calculate signed area
    let signedArea = 0;
    for (let i = 0; i < points.length; i++) {
      const nextIndex = (i + 1) % points.length;
      signedArea += (points[i].x * points[nextIndex].y) - (points[nextIndex].x * points[i].y);
    }
    
    // If signed area is positive, the polygon is counterclockwise
    // If negative, it's clockwise
    return signedArea < 0;
  }, []);
  
  // The synchronous version of polygon area calculation
  const calculatePolygonAreaSync = useCallback((points: Point[]): number => {
    if (points.length < 3) return 0;
    
    let area = 0;
    for (let i = 0; i < points.length; i++) {
      const j = (i + 1) % points.length;
      area += points[i].x * points[j].y;
      area -= points[j].x * points[i].y;
    }
    
    return Math.abs(area) / 2;
  }, []);
  
  return {
    isInitialized,
    isLoading,
    error,
    isPolygonClockwise,
    calculatePolygonArea,
    calculatePolygonAreaSync,
    calculateDistance,
    isPointInPolygon,
    isProcessing: workerIsProcessing || isLoading
  };
};
