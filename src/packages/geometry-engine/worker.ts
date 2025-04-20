
/**
 * Web worker for optimized geometry calculations
 * @module geometry-engine/worker
 */
import { WorkerMessageData } from './types';
import { calculatePolygonArea, calculateDistance, perpendicularDistance } from './core';
import { optimizePoints, snapPointsToGrid } from './transformations';

// Track worker instance
let worker: Worker | null = null;
const pendingRequests = new Map();

/**
 * Initialize the geometry worker
 * This lazy-loads the worker when needed
 */
export function initGeometryWorker(): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      if (worker) {
        resolve();
        return;
      }
      
      // Create the worker
      worker = new Worker(new URL('./worker-impl.ts', import.meta.url), { type: 'module' });
      
      // Set up message handler
      worker.addEventListener('message', (event) => {
        const { id, success, result, error } = event.data;
        
        // Get the pending request
        const request = pendingRequests.get(id);
        if (!request) return;
        
        // Remove from pending
        pendingRequests.delete(id);
        
        // Resolve or reject the promise
        if (success) {
          request.resolve(result);
        } else {
          request.reject(new Error(error || 'Unknown worker error'));
        }
      });
      
      // Handle errors
      worker.addEventListener('error', (event) => {
        console.error('Geometry worker error:', event);
        reject(new Error('Worker initialization failed'));
      });
      
      resolve();
    } catch (error) {
      console.error('Failed to initialize geometry worker:', error);
      reject(error);
    }
  });
}

/**
 * Send a calculation request to the worker
 * @param type Type of calculation
 * @param payload Data for the calculation
 * @returns Promise with the result
 */
export function sendToWorker<T>(type: string, payload: any): Promise<T> {
  return new Promise(async (resolve, reject) => {
    try {
      // Initialize worker if needed
      if (!worker) {
        await initGeometryWorker();
      }
      
      // Generate unique request ID
      const id = `${type}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      
      // Store promise callbacks
      pendingRequests.set(id, { resolve, reject });
      
      // Send request to worker
      worker!.postMessage({ id, type, payload });
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Calculate area of a polygon using the worker
 * @param points Points defining the polygon
 * @returns Promise with the area
 */
export function calculateAreaAsync(points: any[]): Promise<number> {
  return sendToWorker<number>('calculateArea', { points });
}

/**
 * Calculate distance between points using the worker
 * @param start Start point
 * @param end End point
 * @returns Promise with the distance
 */
export function calculateDistanceAsync(start: any, end: any): Promise<number> {
  return sendToWorker<number>('calculateDistance', { start, end });
}

/**
 * Optimize points using the worker
 * @param points Points to optimize
 * @param tolerance Tolerance for optimization
 * @returns Promise with optimized points
 */
export function optimizePointsAsync(points: any[], tolerance: number = 1): Promise<any[]> {
  return sendToWorker<any[]>('optimizePoints', { points, tolerance });
}

/**
 * Snap points to grid using the worker
 * @param points Points to snap
 * @param gridSize Grid size
 * @returns Promise with snapped points
 */
export function snapToGridAsync(points: any[], gridSize: number): Promise<any[]> {
  return sendToWorker<any[]>('snapToGrid', { points, gridSize });
}

/**
 * Terminate the worker
 */
export function terminateGeometryWorker(): void {
  if (worker) {
    worker.terminate();
    worker = null;
    pendingRequests.clear();
  }
}
