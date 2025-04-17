
/**
 * Central utility for offloading heavy computations to workers
 * Maps computational bottlenecks to appropriate worker implementations
 * @module utils/computeUtils
 */
import { useOptimizedGeometryWorker } from '@/hooks/useOptimizedGeometryWorker';
import { Point } from '@/types/geometryTypes';
import { Canvas as FabricCanvas } from 'fabric';
import { measurePerformance } from '@/utils/performance';
import logger from '@/utils/logger';

// Performance threshold for worker offloading (ms)
const PERFORMANCE_THRESHOLD = 16; // 60fps threshold

// Singleton worker instance
let geometryWorker: Worker | null = null;

/**
 * Get or create the geometry worker
 * @returns The geometry worker instance
 */
export const getGeometryWorker = (): Worker => {
  if (!geometryWorker) {
    geometryWorker = new Worker(
      new URL('./workers/optimizedGeometryWorker.ts', import.meta.url),
      { type: 'module' }
    );
    
    // Log worker creation
    logger.info('Geometry worker created');
  }
  
  return geometryWorker;
};

/**
 * Detect if computation should be offloaded based on complexity
 * @param operationComplexity Estimation of operation complexity
 * @returns Whether to use worker
 */
export const shouldUseWorker = (operationComplexity: number): boolean => {
  // Basic complexity threshold
  return operationComplexity > 1000;
};

/**
 * Convert points to transferable Float32Array for efficient worker communication
 * @param points Array of points to convert
 * @returns Float32Array and the underlying ArrayBuffer for transfer
 */
export const pointsToTransferable = (points: Point[]): { 
  data: Float32Array; 
  buffer: ArrayBuffer;
} => {
  const float32Array = new Float32Array(points.length * 2);
  
  points.forEach((point, index) => {
    float32Array[index * 2] = point.x;
    float32Array[index * 2 + 1] = point.y;
  });
  
  return {
    data: float32Array,
    buffer: float32Array.buffer
  };
};

/**
 * Convert transferable Float32Array back to points
 * @param float32Array Float32Array containing point data
 * @returns Array of Point objects
 */
export const transferableToPoints = (float32Array: Float32Array): Point[] => {
  const points: Point[] = [];
  
  for (let i = 0; i < float32Array.length; i += 2) {
    points.push({
      x: float32Array[i],
      y: float32Array[i + 1]
    });
  }
  
  return points;
};

/**
 * Calculate area of polygon
 * Automatically decides whether to use worker based on point count
 * Uses transferable objects for large datasets
 * @param points Points defining the polygon
 * @returns Area value (async for worker compatibility)
 */
export const calculatePolygonArea = async (points: Point[]): Promise<number> => {
  // For small point sets, compute directly
  if (points.length < 100) {
    return measurePerformance('calculateAreaDirect', () => {
      let area = 0;
      const n = points.length;
      
      for (let i = 0; i < n; i++) {
        const j = (i + 1) % n;
        area += points[i].x * points[j].y;
        area -= points[j].x * points[i].y;
      }
      
      return Math.abs(area) / 2;
    })[0];
  }
  
  // For larger point sets, use worker with transferables
  try {
    const worker = getGeometryWorker();
    
    return await new Promise<number>((resolve, reject) => {
      const id = `area-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      
      // Create transferable buffer from points
      const { data: pointsArray, buffer } = pointsToTransferable(points);
      
      // One-time message handler
      const handler = (event: MessageEvent) => {
        const { id: responseId, success, result, error } = event.data;
        
        if (responseId === id) {
          // Remove handler after use
          worker.removeEventListener('message', handler);
          
          if (success) {
            resolve(result);
          } else {
            reject(new Error(error || 'Unknown worker error'));
          }
        }
      };
      
      // Add message handler
      worker.addEventListener('message', handler);
      
      // Send to worker with transferable buffer
      worker.postMessage({
        id,
        type: 'calculateArea',
        payload: { points: pointsArray, useTransferable: true }
      }, [buffer]);
    });
  } catch (error) {
    // Fall back to direct calculation on error
    logger.error('Worker error, falling back to direct calculation:', error);
    
    return measurePerformance('calculateAreaFallback', () => {
      let area = 0;
      const n = points.length;
      
      for (let i = 0; i < n; i++) {
        const j = (i + 1) % n;
        area += points[i].x * points[j].y;
        area -= points[j].x * points[i].y;
      }
      
      return Math.abs(area) / 2;
    })[0];
  }
};

/**
 * Optimize canvas operations for large datasets
 * @param canvas Fabric canvas instance
 * @param operation Operation to perform
 * @returns Operation result
 */
export const optimizeCanvasOperation = <T>(
  canvas: FabricCanvas | null,
  operation: (canvas: FabricCanvas) => T
): T | null => {
  if (!canvas) return null;
  
  // Measure operation performance
  const [result, measurement] = measurePerformance(
    'canvasOperation',
    () => operation(canvas),
    { objectCount: canvas.getObjects().length }
  );
  
  // Log slow operations
  if (measurement.duration > PERFORMANCE_THRESHOLD) {
    logger.warn('Slow canvas operation detected', {
      duration: measurement.duration,
      objectCount: canvas.getObjects().length,
      operation: measurement.name
    });
  }
  
  return result;
};
