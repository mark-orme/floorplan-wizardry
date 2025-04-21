
/**
 * Hook for using the geometry web worker
 */
import { useEffect, useCallback, useState, useRef } from 'react';
import { Point } from '@/types/core/Geometry';
import { calculatePolygonArea } from '@/utils/geometry/engine';

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
      // Create a worker
      const worker = new Worker(new URL('../workers/geometryWorker.ts', import.meta.url), {
        type: 'module'
      });
      
      // Set up message handler
      worker.addEventListener('message', (event: MessageEvent<GeometryWorkerMessage>) => {
        const { id, success, result, error } = event.data;
        
        // Handle initialization message
        if (id === 'init' && success) {
          setIsReady(true);
          return;
        }
        
        const callbacks = callbacksRef.current.get(id);
        
        if (!callbacks) return;
        
        if (success) {
          callbacks.resolve(result);
        } else {
          callbacks.reject(new Error(error || 'Unknown error in geometry worker'));
        }
        
        callbacksRef.current.delete(id);
      });
      
      // Handle worker errors
      worker.addEventListener('error', (event) => {
        console.error('Worker error:', event);
        setError(new Error('Worker error: ' + event.message));
      });
      
      workerRef.current = worker;
      
      // Clean up worker on unmount
      return () => {
        worker.terminate();
        workerRef.current = null;
        callbacksRef.current.clear();
      };
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
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
      
      const id = `${type}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      
      callbacksRef.current.set(id, { resolve, reject });
      
      workerRef.current.postMessage({
        id,
        type,
        payload
      });
    });
  }, []);
  
  // Calculate area using the worker
  const calculateArea = useCallback(async (points: Point[]): Promise<number> => {
    try {
      if (!isReady || !workerRef.current) {
        // Fallback to synchronous calculation
        return calculatePolygonArea(points);
      }
      
      return await sendMessage<number>('calculateArea', { points });
    } catch (err) {
      console.error('Error calculating area in worker, falling back to sync calculation');
      return calculatePolygonArea(points);
    }
  }, [isReady, sendMessage]);
  
  // Snap points to grid using the worker
  const snapToGrid = useCallback(async (points: Point[], gridSize: number): Promise<Point[]> => {
    try {
      if (!isReady || !workerRef.current) {
        // Return original points if worker not available
        return points;
      }
      
      return await sendMessage<Point[]>('snapToGrid', { points, gridSize });
    } catch (err) {
      console.error('Error snapping to grid in worker');
      return points;
    }
  }, [isReady, sendMessage]);
  
  // Optimize a path using the worker
  const optimizePath = useCallback(async (points: Point[], tolerance = 1): Promise<Point[]> => {
    try {
      if (!isReady || !workerRef.current) {
        // Return original points if worker not available
        return points;
      }
      
      return await sendMessage<Point[]>('optimizePath', { points, tolerance });
    } catch (err) {
      console.error('Error optimizing path in worker');
      return points;
    }
  }, [isReady, sendMessage]);
  
  return {
    isReady,
    error,
    calculateArea,
    snapToGrid,
    optimizePath
  };
};
