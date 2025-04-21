
/**
 * Hook for using the geometry web worker
 */
import { useEffect, useCallback, useState, useRef } from 'react';
import { Point } from '@/types/core/Point';
import logger from '@/utils/logger';

interface GeometryWorkerMessage {
  id: string;
  success: boolean;
  result?: any;
  error?: string;
}

export const useGeometryWorker = () => {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const workerRef = useRef<Worker | null>(null);
  const callbacksRef = useRef<Map<string, { resolve: Function; reject: Function }>>(new Map());
  
  // Initialize the worker
  useEffect(() => {
    try {
      const worker = new Worker(new URL('../workers/geometryWorker.ts', import.meta.url), {
        type: 'module'
      });
      
      worker.addEventListener('message', (event: MessageEvent<GeometryWorkerMessage>) => {
        const { id, success, result, error } = event.data;
        const callbacks = callbacksRef.current.get(id);
        
        if (!callbacks) return;
        
        if (success) {
          callbacks.resolve(result);
        } else {
          callbacks.reject(new Error(error || 'Unknown error in geometry worker'));
        }
        
        callbacksRef.current.delete(id);
      });
      
      workerRef.current = worker;
      setIsReady(true);
      logger.info('Geometry worker initialized');
      
      return () => {
        worker.terminate();
        workerRef.current = null;
        callbacksRef.current.clear();
      };
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      logger.error('Failed to initialize geometry worker', { error: err });
      return () => {};
    }
  }, []);
  
  // Send a message to the worker
  const sendMessage = useCallback(<T>(type: string, payload: any): Promise<T> => {
    return new Promise((resolve, reject) => {
      if (!workerRef.current) {
        reject(new Error('Geometry worker not initialized'));
        return;
      }
      
      if (!isReady) {
        reject(new Error('Geometry worker not ready'));
        return;
      }
      
      const id = `${type}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      
      callbacksRef.current.set(id, { resolve, reject });
      
      workerRef.current.postMessage({
        id,
        type,
        payload
      });
    });
  }, [isReady]);
  
  // Calculate area using the worker
  const calculateArea = useCallback(async (points: Point[]): Promise<number> => {
    try {
      return await sendMessage<number>('calculateArea', { points });
    } catch (err) {
      logger.error('Error calculating area in worker', { error: err });
      
      // Fallback to synchronous calculation if worker fails
      logger.warn('Falling back to synchronous area calculation');
      return calculatePolygonAreaSync(points);
    }
  }, [sendMessage]);
  
  // Synchronous fallback for calculating area
  const calculatePolygonAreaSync = (points: Point[]): number => {
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
