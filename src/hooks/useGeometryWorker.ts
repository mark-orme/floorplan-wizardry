
/**
 * Hook for using the geometry worker
 * Provides a clean API for offloading geometry calculations to a Web Worker
 */
import { useEffect, useRef, useCallback } from 'react';
import { perfLogger } from '@/utils/logger';

// Types for the geometry worker
type GeometryCalculationType = 'calculateArea' | 'calculateDistance' | 'snapToGrid' | 'optimizePoints';
type GeometryWorkerRequest = {
  id: string;
  type: GeometryCalculationType;
  payload: any;
  resolve: (result: any) => void;
  reject: (error: Error) => void;
};

// Hook for geometry worker operations
export const useGeometryWorker = () => {
  // Reference to the worker instance
  const workerRef = useRef<Worker | null>(null);
  
  // Map to track pending requests
  const pendingRequests = useRef<Map<string, GeometryWorkerRequest>>(new Map());
  
  // Initialize worker
  useEffect(() => {
    // Create worker only in browser environment
    if (typeof Worker !== 'undefined') {
      try {
        // Create the worker
        workerRef.current = new Worker(
          new URL('../workers/geometryWorker.ts', import.meta.url),
          { type: 'module' }
        );
        
        // Set up message handler
        workerRef.current.addEventListener('message', (event) => {
          const { id, success, result, error } = event.data;
          
          // Get the pending request
          const request = pendingRequests.current.get(id);
          if (!request) return;
          
          // Remove from pending requests
          pendingRequests.current.delete(id);
          
          // Handle result
          if (success) {
            request.resolve(result);
          } else {
            request.reject(new Error(error || 'Unknown worker error'));
          }
        });
        
        perfLogger.info('Geometry worker initialized successfully');
      } catch (error) {
        perfLogger.error('Failed to initialize geometry worker', error);
      }
    } else {
      perfLogger.warn('Web Workers not supported in this environment');
    }
    
    // Clean up worker on unmount
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
        workerRef.current = null;
        pendingRequests.current.clear();
        perfLogger.debug('Geometry worker terminated');
      }
    };
  }, []);
  
  // Send a request to the worker and return a promise
  const sendToWorker = useCallback(<T>(type: GeometryCalculationType, payload: any): Promise<T> => {
    return new Promise<T>((resolve, reject) => {
      if (!workerRef.current) {
        reject(new Error('Geometry worker not initialized'));
        return;
      }
      
      // Generate a unique ID for this request
      const id = `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Store the request
      pendingRequests.current.set(id, {
        id,
        type,
        payload,
        resolve,
        reject
      });
      
      // Send the request to the worker
      workerRef.current.postMessage({ id, type, payload });
    });
  }, []);
  
  // Helper methods for common calculations
  const calculateArea = useCallback((points: { x: number, y: number }[]): Promise<number> => {
    perfLogger.debug('Offloading area calculation to worker', { pointCount: points.length });
    return sendToWorker<number>('calculateArea', { points });
  }, [sendToWorker]);
  
  const calculateDistance = useCallback((
    start: { x: number, y: number }, 
    end: { x: number, y: number }
  ): Promise<number> => {
    return sendToWorker<number>('calculateDistance', { start, end });
  }, [sendToWorker]);
  
  const snapToGrid = useCallback((
    points: { x: number, y: number }[], 
    gridSize: number
  ): Promise<{ x: number, y: number }[]> => {
    return sendToWorker<{ x: number, y: number }[]>('snapToGrid', { points, gridSize });
  }, [sendToWorker]);
  
  const optimizePoints = useCallback((
    points: { x: number, y: number }[],
    tolerance = 1
  ): Promise<{ x: number, y: number }[]> => {
    perfLogger.debug('Optimizing points array', { pointCount: points.length, tolerance });
    return sendToWorker<{ x: number, y: number }[]>('optimizePoints', { points, tolerance });
  }, [sendToWorker]);
  
  return {
    calculateArea,
    calculateDistance,
    snapToGrid,
    optimizePoints,
    isSupported: typeof Worker !== 'undefined'
  };
};
