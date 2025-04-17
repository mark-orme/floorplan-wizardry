
import { useCallback, useEffect, useRef } from 'react';

// Define worker message types
type GeometryWorkerTaskType = 
  | 'calculateArea' 
  | 'calculateDistance' 
  | 'optimizePoints' 
  | 'snapToGrid';

interface GeometryWorkerMessage {
  id: string;
  type: GeometryWorkerTaskType;
  payload: any;
}

interface GeometryWorkerResponse {
  id: string;
  success: boolean;
  result?: any;
  error?: string;
}

type TaskCallback = (result: any) => void;
type ErrorCallback = (error: string) => void;

/**
 * Hook for efficient communication with the geometry web worker
 * Optimizes data transfer with transferable objects
 */
export const useGeometryWorker = () => {
  // Create a worker instance
  const workerRef = useRef<Worker | null>(null);
  const callbacksRef = useRef<Map<string, {
    resolve: TaskCallback;
    reject: ErrorCallback;
    transferables?: Transferable[];
  }>>(new Map());
  
  // Initialize worker
  useEffect(() => {
    try {
      workerRef.current = new Worker(
        new URL('../workers/geometryWorker.ts', import.meta.url),
        { type: 'module' }
      );
      
      // Set up message handler
      workerRef.current.onmessage = (event: MessageEvent<GeometryWorkerResponse>) => {
        const { id, success, result, error } = event.data;
        
        const callbacks = callbacksRef.current.get(id);
        if (!callbacks) return;
        
        if (success) {
          callbacks.resolve(result);
        } else {
          callbacks.reject(error || 'Unknown error');
        }
        
        callbacksRef.current.delete(id);
      };
      
      return () => {
        workerRef.current?.terminate();
        workerRef.current = null;
        callbacksRef.current.clear();
      };
    } catch (error) {
      console.error('Failed to initialize geometry worker:', error);
    }
  }, []);
  
  // Send tasks to worker with proper transferable object handling
  const sendTask = useCallback(<T>(
    type: GeometryWorkerTaskType, 
    payload: any, 
    transferables?: Transferable[]
  ): Promise<T> => {
    return new Promise((resolve, reject) => {
      if (!workerRef.current) {
        reject('Worker not initialized');
        return;
      }
      
      const id = `${type}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      
      callbacksRef.current.set(id, {
        resolve: resolve as TaskCallback,
        reject,
        transferables
      });
      
      const message: GeometryWorkerMessage = {
        id,
        type,
        payload
      };
      
      if (transferables && transferables.length > 0) {
        workerRef.current.postMessage(message, transferables);
      } else {
        workerRef.current.postMessage(message);
      }
    });
  }, []);
  
  // Helper functions for specific geometry tasks
  const calculateArea = useCallback((points: { x: number, y: number }[] | Float32Array) => {
    const useTransferable = points instanceof Float32Array;
    const transferables = useTransferable ? [points.buffer] : undefined;
    
    return sendTask<number>('calculateArea', { points, useTransferable }, transferables);
  }, [sendTask]);
  
  const optimizePoints = useCallback((
    points: { x: number, y: number }[] | Float32Array,
    tolerance: number = 1
  ) => {
    const useTransferable = points instanceof Float32Array;
    const transferables = useTransferable ? [points.buffer] : undefined;
    
    return sendTask<{ x: number, y: number }[] | Float32Array>(
      'optimizePoints', 
      { points, tolerance, useTransferable },
      transferables
    );
  }, [sendTask]);
  
  const snapToGrid = useCallback((
    points: { x: number, y: number }[] | Float32Array,
    gridSize: number
  ) => {
    const useTransferable = points instanceof Float32Array;
    const transferables = useTransferable ? [points.buffer] : undefined;
    
    return sendTask<{ x: number, y: number }[] | Float32Array>(
      'snapToGrid',
      { points, gridSize, useTransferable },
      transferables
    );
  }, [sendTask]);
  
  return {
    calculateArea,
    optimizePoints,
    snapToGrid,
    sendTask
  };
};
