
/**
 * Client module for the geometry web worker
 * Provides a clean API for offloading geometry calculations to a Web Worker
 */
import { Point } from '@/types/core/Geometry';

// Define geometry calculation types
type GeometryCalculationType = 'calculateArea' | 'calculateDistance' | 'simplifyPath' | 'snapToGrid';

// Track pending requests 
const pendingRequests = new Map<string, {
  resolve: (result: any) => void;
  reject: (error: Error) => void;
}>();

// Create a single worker instance
let worker: Worker | null = null;
let isInitialized = false;

/**
 * Initialize the geometry worker
 */
export function initGeometryWorker(): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      if (isInitialized || worker) {
        resolve();
        return;
      }
      
      // Create worker
      worker = new Worker(new URL('./geometryWorker.ts', import.meta.url), { type: 'module' });
      
      // Set up message handler for worker responses
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
      
      // Mark as initialized
      isInitialized = true;
      resolve();
      console.log('Geometry worker initialized');
    } catch (error) {
      console.error('Failed to initialize geometry worker:', error);
      reject(error);
    }
  });
}

/**
 * Send a request to the geometry worker
 */
function sendToWorker<T>(type: GeometryCalculationType, payload: any): Promise<T> {
  return new Promise<T>(async (resolve, reject) => {
    try {
      // Initialize worker if not already done
      if (!isInitialized) {
        await initGeometryWorker();
      }
      
      if (!worker) {
        throw new Error('Geometry worker not initialized');
      }
      
      // Generate unique ID for this request
      const id = `${type}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      
      // Store callbacks
      pendingRequests.set(id, { resolve, reject });
      
      // Send request to worker
      worker.postMessage({ id, type, payload });
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Calculate area of a polygon
 */
export function calculateArea(points: Point[]): Promise<number> {
  return sendToWorker<number>('calculateArea', { points });
}

/**
 * Calculate distance between points
 */
export function calculateDistance(start: Point, end: Point): Promise<number> {
  return sendToWorker<number>('calculateDistance', { start, end });
}

/**
 * Simplify a path using the Douglas-Peucker algorithm
 */
export function simplifyPath(points: Point[], tolerance: number): Promise<Point[]> {
  return sendToWorker<Point[]>('simplifyPath', { points, tolerance });
}

/**
 * Snap points to a grid
 */
export function snapToGrid(points: Point[], gridSize: number): Promise<Point[]> {
  return sendToWorker<Point[]>('snapToGrid', { points, gridSize });
}

/**
 * Terminate the worker
 */
export function terminateGeometryWorker(): void {
  if (worker) {
    worker.terminate();
    worker = null;
    isInitialized = false;
    pendingRequests.clear();
  }
}
