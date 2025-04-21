
/**
 * Geometry Engine Hook
 * Provides access to geometry calculation functionality
 */
import { useCallback, useEffect, useState } from 'react';
import { Point } from '@/types/core/Point';
import * as GeometryEngine from '@/utils/geometry/engine';
import { useWebWorker } from '@/hooks/useWebWorker';
import logger from '@/utils/logger';

export type GeometryFunction = 'calculateArea' | 'calculateIntersection' | 'isPointInPolygon';

interface GeometryWorkerMessage {
  type: GeometryFunction;
  payload: any;
}

interface GeometryWorkerResponse {
  type: string;
  payload: any;
}

/**
 * Hook providing access to geometry calculations
 * Uses Web Workers for CPU-intensive operations
 */
export const useGeometryEngine = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [workerSupported, setWorkerSupported] = useState(true);
  
  // Set up web worker for geometry calculations
  const {
    worker,
    postMessage,
    result,
    isProcessing,
    error,
    terminateWorker
  } = useWebWorker<GeometryWorkerMessage, GeometryWorkerResponse>('/workers/geometry-worker.js');
  
  // Initialize geometry engine
  useEffect(() => {
    const initEngine = async () => {
      try {
        // Initialize the geometry engine
        if (typeof GeometryEngine.initializeEngine === 'function') {
          await GeometryEngine.initializeEngine();
        }
        setIsInitialized(true);
        logger.info('Geometry engine initialized');
      } catch (err) {
        logger.error('Failed to initialize geometry engine', { err });
        setIsInitialized(false);
      }
    };
    
    initEngine();
    
    return () => {
      if (worker) {
        terminateWorker();
      }
    };
  }, [worker, terminateWorker]);
  
  /**
   * Calculate area of a polygon
   * @param points Points defining the polygon
   * @returns Area in square units
   */
  const calculateArea = useCallback(async (points: Point[]): Promise<number> => {
    if (!isInitialized) {
      logger.warn('Geometry engine not initialized, using fallback');
    }
    
    try {
      if (worker && workerSupported) {
        // Use web worker for calculation
        const messageId = postMessage({
          type: 'calculateArea',
          payload: { points }
        });
        
        // Wait for result
        // In a real implementation, we would handle the response asynchronously
        return 0; // Placeholder
      } else {
        // Fallback to direct calculation
        return GeometryEngine.calculatePolygonArea(points);
      }
    } catch (error) {
      logger.error('Error calculating area', { error });
      setWorkerSupported(false);
      return GeometryEngine.calculatePolygonArea(points);
    }
  }, [isInitialized, worker, workerSupported, postMessage]);
  
  /**
   * Check if a point is inside a polygon
   * @param point Point to check
   * @param polygon Points defining the polygon
   * @returns True if point is inside polygon
   */
  const isPointInPolygon = useCallback((point: Point, polygon: Point[]): boolean => {
    if (!isInitialized) {
      logger.warn('Geometry engine not initialized, using fallback');
    }
    
    try {
      if (worker && workerSupported) {
        // For synchronous operations, we still use direct calculation
        return GeometryEngine.isPointInsidePolygon(point, polygon);
      } else {
        return GeometryEngine.isPointInsidePolygon(point, polygon);
      }
    } catch (error) {
      logger.error('Error checking if point is in polygon', { error });
      setWorkerSupported(false);
      return false;
    }
  }, [isInitialized, worker, workerSupported]);
  
  return {
    isInitialized,
    calculateArea,
    isPointInPolygon,
    isProcessing,
    error
  };
};
