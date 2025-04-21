
/**
 * Geometry Worker Hook
 * Provides a worker interface to offload geometry calculations
 */

import { useCallback, useEffect, useState } from 'react';
import { useWebWorker } from './useWebWorker';
import { Point, Polygon } from '@/types/core/Geometry';

// Define message types for worker communication
type GeometryWorkerMessage = 
  | { type: 'calculateArea'; payload: { points: Point[] } }
  | { type: 'calculateDistance'; payload: { start: Point; end: Point } }
  | { type: 'calculateIntersection'; payload: { line1: [Point, Point]; line2: [Point, Point] } };

// Define result types for worker responses
type GeometryWorkerResult = 
  | { type: 'areaResult'; payload: { area: number } }
  | { type: 'distanceResult'; payload: { distance: number } }
  | { type: 'intersectionResult'; payload: { point: Point | null } };

export function useGeometryWorker() {
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Create the worker
  const { worker, postMessage, result, isProcessing } = useWebWorker<
    GeometryWorkerMessage, 
    GeometryWorkerResult
  >('/workers/geometry-worker.js');
  
  // Initialize worker
  useEffect(() => {
    if (worker) {
      setInitialized(true);
    } else {
      setError('Failed to initialize geometry worker');
    }
  }, [worker]);
  
  // Calculate polygon area
  const calculateArea = useCallback((points: Point[]): Promise<number> => {
    if (!initialized) {
      return Promise.reject(new Error('Geometry worker not initialized'));
    }
    
    return new Promise((resolve, reject) => {
      const messageId = postMessage({ type: 'calculateArea', payload: { points } });
      
      // Wait for result
      const checkResult = () => {
        if (result && result.messageId === messageId) {
          if (result.data.type === 'areaResult') {
            resolve(result.data.payload.area);
          } else {
            reject(new Error('Invalid result type'));
          }
        } else {
          setTimeout(checkResult, 10);
        }
      };
      
      checkResult();
    });
  }, [initialized, postMessage, result]);
  
  // Calculate distance between two points
  const calculateDistance = useCallback((start: Point, end: Point): Promise<number> => {
    if (!initialized) {
      return Promise.reject(new Error('Geometry worker not initialized'));
    }
    
    return new Promise((resolve, reject) => {
      const messageId = postMessage({ type: 'calculateDistance', payload: { start, end } });
      
      // Wait for result
      const checkResult = () => {
        if (result && result.messageId === messageId) {
          if (result.data.type === 'distanceResult') {
            resolve(result.data.payload.distance);
          } else {
            reject(new Error('Invalid result type'));
          }
        } else {
          setTimeout(checkResult, 10);
        }
      };
      
      checkResult();
    });
  }, [initialized, postMessage, result]);
  
  // Calculate intersection of two lines
  const calculateIntersection = useCallback((
    line1: [Point, Point], 
    line2: [Point, Point]
  ): Promise<Point | null> => {
    if (!initialized) {
      return Promise.reject(new Error('Geometry worker not initialized'));
    }
    
    return new Promise((resolve, reject) => {
      const messageId = postMessage({ 
        type: 'calculateIntersection', 
        payload: { line1, line2 } 
      });
      
      // Wait for result
      const checkResult = () => {
        if (result && result.messageId === messageId) {
          if (result.data.type === 'intersectionResult') {
            resolve(result.data.payload.point);
          } else {
            reject(new Error('Invalid result type'));
          }
        } else {
          setTimeout(checkResult, 10);
        }
      };
      
      checkResult();
    });
  }, [initialized, postMessage, result]);
  
  return {
    initialized,
    error,
    isProcessing,
    calculateArea,
    calculateDistance,
    calculateIntersection
  };
}
