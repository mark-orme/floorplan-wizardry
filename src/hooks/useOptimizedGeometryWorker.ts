
/**
 * Enhanced hook for geometry worker with transferable objects support
 */
import { useEffect, useRef, useCallback, useState } from 'react';
import logger from '@/utils/logger';
import { useMemo } from 'react';

// Types for the geometry worker
type GeometryCalculationType = 
  'calculateArea' | 
  'calculateDistance' | 
  'snapToGrid' | 
  'optimizePoints' |
  'batchProcess';

type GeometryWorkerRequest = {
  id: string;
  type: GeometryCalculationType;
  payload: any;
  transferList?: ArrayBuffer[];
  resolve: (result: any) => void;
  reject: (error: Error) => void;
};

// Point type
interface Point {
  x: number;
  y: number;
}

export const useOptimizedGeometryWorker = () => {
  // Reference to the worker instance
  const workerRef = useRef<Worker | null>(null);
  
  // Map to track pending requests
  const pendingRequests = useRef<Map<string, GeometryWorkerRequest>>(new Map());
  
  // Track supported features
  const [supportsTransferables, setSupportsTransferables] = useState(false);
  
  // Initialize worker
  useEffect(() => {
    // Create worker only in browser environment
    if (typeof Worker !== 'undefined') {
      try {
        // Create the worker
        workerRef.current = new Worker(
          new URL('../workers/optimizedGeometryWorker.ts', import.meta.url),
          { type: 'module' }
        );
        
        // Check for transferables support
        const buffer = new ArrayBuffer(1);
        try {
          // Attempt to use a transferable object
          workerRef.current.postMessage({ testTransferable: true }, [buffer]);
          // If we get here without throwing, transferables are supported
          setSupportsTransferables(true);
          logger.info('Transferable objects are supported in this browser');
        } catch (e) {
          // Transferables not supported
          setSupportsTransferables(false);
          logger.warn('Transferable objects are not supported in this browser');
        }
        
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
        
        logger.info('Optimized geometry worker initialized successfully');
      } catch (error) {
        logger.error('Failed to initialize geometry worker', error);
      }
    } else {
      logger.warn('Web Workers not supported in this environment');
    }
    
    // Clean up worker on unmount
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
        workerRef.current = null;
        pendingRequests.current.clear();
        logger.debug('Geometry worker terminated');
      }
    };
  }, []);
  
  // Create a Float32Array from points
  const createTransferablePoints = useCallback((points: Point[]): Float32Array => {
    const buffer = new Float32Array(points.length * 2);
    points.forEach((point, index) => {
      buffer[index * 2] = point.x;
      buffer[index * 2 + 1] = point.y;
    });
    return buffer;
  }, []);
  
  // Convert Float32Array back to points
  const processTransferableResult = useCallback((result: any): Point[] => {
    if (result && result.buffer && result.points instanceof Float32Array) {
      // Convert typed array back to points
      const points: Point[] = [];
      const arr = result.points;
      for (let i = 0; i < arr.length; i += 2) {
        points.push({ x: arr[i], y: arr[i + 1] });
      }
      return points;
    }
    return result;
  }, []);
  
  // Send a request to the worker and return a promise
  const sendToWorker = useCallback(<T>(
    type: GeometryCalculationType, 
    payload: any,
    transferList?: ArrayBuffer[]
  ): Promise<T> => {
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
        transferList,
        resolve,
        reject
      });
      
      // Send the request to the worker with transferables if provided
      if (transferList && transferList.length > 0 && supportsTransferables) {
        workerRef.current.postMessage({ id, type, payload }, transferList);
      } else {
        workerRef.current.postMessage({ id, type, payload });
      }
    });
  }, [supportsTransferables]);
  
  // Helper methods for common calculations
  const calculateArea = useCallback((points: Point[]): Promise<number> => {
    logger.debug('Offloading area calculation to worker', { pointCount: points.length });
    
    if (supportsTransferables && points.length > 100) {
      // For large point sets, use transferable objects
      const buffer = createTransferablePoints(points);
      return sendToWorker<number>('calculateArea', { points: buffer }, [buffer.buffer]);
    }
    
    return sendToWorker<number>('calculateArea', { points });
  }, [sendToWorker, supportsTransferables, createTransferablePoints]);
  
  const calculateDistance = useCallback((
    start: Point, 
    end: Point
  ): Promise<number> => {
    return sendToWorker<number>('calculateDistance', { start, end });
  }, [sendToWorker]);
  
  const snapToGrid = useCallback((
    points: Point[], 
    gridSize: number
  ): Promise<Point[]> => {
    if (supportsTransferables && points.length > 100) {
      // For large point sets, use transferable objects
      const buffer = createTransferablePoints(points);
      
      return sendToWorker<any>(
        'snapToGrid', 
        { 
          points: buffer, 
          gridSize, 
          useTransferable: true 
        }, 
        [buffer.buffer]
      ).then(processTransferableResult);
    }
    
    return sendToWorker<Point[]>('snapToGrid', { points, gridSize });
  }, [sendToWorker, supportsTransferables, createTransferablePoints, processTransferableResult]);
  
  const optimizePoints = useCallback((
    points: Point[],
    tolerance = 1
  ): Promise<Point[]> => {
    logger.debug('Optimizing points array', { pointCount: points.length, tolerance });
    
    if (supportsTransferables && points.length > 100) {
      // For large point sets, use transferable objects
      const buffer = createTransferablePoints(points);
      
      return sendToWorker<any>(
        'optimizePoints', 
        {
          points: buffer,
          tolerance,
          useTransferable: true
        },
        [buffer.buffer]
      ).then(processTransferableResult);
    }
    
    return sendToWorker<Point[]>('optimizePoints', { points, tolerance });
  }, [sendToWorker, supportsTransferables, createTransferablePoints, processTransferableResult]);
  
  // Batch process multiple calculations in a single worker call
  const batchProcess = useCallback((
    operations: { type: GeometryCalculationType; payload: any }[]
  ): Promise<any[]> => {
    return sendToWorker<any[]>('batchProcess', { operations });
  }, [sendToWorker]);
  
  // Features status
  const features = useMemo(() => ({
    isSupported: typeof Worker !== 'undefined',
    supportsTransferables
  }), [supportsTransferables]);
  
  return {
    calculateArea,
    calculateDistance,
    snapToGrid,
    optimizePoints,
    batchProcess,
    features
  };
};
