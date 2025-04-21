
/**
 * Hook for using geometry engine features
 */
import { useState, useEffect, useCallback } from 'react';
import * as engine from '@/utils/geometry/engine';
import { Point } from '@/types/core/Geometry';
import logger from '@/utils/logger';

export const useGeometryEngine = () => {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Initialize the geometry engine
  useEffect(() => {
    const initEngine = async () => {
      try {
        await engine.initGeometryEngine();
        setIsReady(true);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to initialize geometry engine'));
        logger.error('Failed to initialize geometry engine', { error: err });
      }
    };
    
    initEngine();
  }, []);
  
  // Calculate area using the geometry engine
  const calculateArea = useCallback(async (points: Point[]): Promise<number> => {
    if (!isReady) {
      logger.warn('Geometry engine not ready, using fallback');
      return calculatePolygonAreaFallback(points);
    }
    
    try {
      return engine.calculatePolygonArea(points);
    } catch (err) {
      logger.error('Error calculating area', { error: err });
      return calculatePolygonAreaFallback(points);
    }
  }, [isReady]);
  
  // Fallback calculation for polygon area
  const calculatePolygonAreaFallback = (points: Point[]): number => {
    if (points.length < 3) return 0;
    
    let total = 0;
    
    for (let i = 0, l = points.length; i < l; i++) {
      const addX = points[i].x;
      const addY = points[i === points.length - 1 ? 0 : i + 1].y;
      const subX = points[i === points.length - 1 ? 0 : i + 1].x;
      const subY = points[i].y;
      
      total += (addX * addY * 0.5);
      total -= (subX * subY * 0.5);
    }
    
    return Math.abs(total);
  };
  
  return {
    isReady,
    error,
    calculateArea
  };
};
