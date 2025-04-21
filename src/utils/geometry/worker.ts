
/**
 * Geometry worker utilities
 * Functions for offloading geometry calculations to web workers
 * @module utils/geometry/worker
 */

import { Point, Polygon } from '@/types/core/Geometry';
import { calculateArea, simplifyPath } from './engine';

/**
 * Message types for worker communication
 */
export enum GeometryWorkerMessageType {
  CALCULATE_AREA = 'calculateArea',
  SIMPLIFY_PATH = 'simplifyPath',
  RESULT = 'result',
  ERROR = 'error'
}

/**
 * Base interface for worker messages
 */
interface GeometryWorkerMessage {
  type: GeometryWorkerMessageType;
  id: string;
}

/**
 * Calculate area message
 */
interface CalculateAreaMessage extends GeometryWorkerMessage {
  type: GeometryWorkerMessageType.CALCULATE_AREA;
  points: Point[];
}

/**
 * Simplify path message
 */
interface SimplifyPathMessage extends GeometryWorkerMessage {
  type: GeometryWorkerMessageType.SIMPLIFY_PATH;
  points: Point[];
  tolerance: number;
}

/**
 * Result message
 */
interface ResultMessage extends GeometryWorkerMessage {
  type: GeometryWorkerMessageType.RESULT;
  result: any;
}

/**
 * Error message
 */
interface ErrorMessage extends GeometryWorkerMessage {
  type: GeometryWorkerMessageType.ERROR;
  error: string;
}

/**
 * Union type for all worker messages
 */
export type GeometryWorkerMessageData = 
  | CalculateAreaMessage
  | SimplifyPathMessage
  | ResultMessage
  | ErrorMessage;

/**
 * Create a geometry worker
 * @returns Worker instance or null if not supported
 */
export function createGeometryWorker(): Worker | null {
  if (typeof Worker === 'undefined') {
    return null;
  }
  
  // Inline worker code as string
  const workerCode = `
    self.onmessage = function(event) {
      const { type, id, points, tolerance } = event.data;
      
      try {
        let result;
        
        switch (type) {
          case 'calculateArea':
            result = calculateArea(points);
            break;
          case 'simplifyPath':
            result = simplifyPath(points, tolerance);
            break;
          default:
            throw new Error('Unknown message type: ' + type);
        }
        
        self.postMessage({
          type: 'result',
          id,
          result
        });
      } catch (error) {
        self.postMessage({
          type: 'error',
          id,
          error: error.message
        });
      }
    };
    
    // Copied implementations of geometry functions
    function calculateArea(points) {
      if (!points || points.length < 3) {
        return 0;
      }
      
      let area = 0;
      const numPoints = points.length;
      
      for (let i = 0; i < numPoints; i++) {
        const j = (i + 1) % numPoints;
        area += points[i].x * points[j].y;
        area -= points[j].x * points[i].y;
      }
      
      area = Math.abs(area) / 2;
      
      return area;
    }
    
    function calculateDistance(p1, p2) {
      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      return Math.sqrt(dx * dx + dy * dy);
    }
    
    function simplifyPath(points, tolerance) {
      if (points.length <= 2) return [...points];
      
      // Implementation of Douglas-Peucker algorithm
      const findPerpendicularDistance = (p, p1, p2) => {
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        
        if (dx === 0 && dy === 0) return calculateDistance(p, p1);
        
        const t = ((p.x - p1.x) * dx + (p.y - p1.y) * dy) / (dx * dx + dy * dy);
        
        if (t < 0) return calculateDistance(p, p1);
        if (t > 1) return calculateDistance(p, p2);
        
        return Math.abs((dy * p.x - dx * p.y + p2.x * p1.y - p2.y * p1.x) / Math.sqrt(dx * dx + dy * dy));
      };
      
      // Recursive function
      function douglasPeucker(points, tolerance) {
        if (points.length <= 2) return points;
        
        let maxDistance = 0;
        let maxIndex = 0;
        
        for (let i = 1; i < points.length - 1; i++) {
          const distance = findPerpendicularDistance(points[i], points[0], points[points.length - 1]);
          if (distance > maxDistance) {
            maxDistance = distance;
            maxIndex = i;
          }
        }
        
        if (maxDistance > tolerance) {
          const firstSegment = douglasPeucker(points.slice(0, maxIndex + 1), tolerance);
          const secondSegment = douglasPeucker(points.slice(maxIndex), tolerance);
          
          return [...firstSegment.slice(0, -1), ...secondSegment];
        } else {
          return [points[0], points[points.length - 1]];
        }
      }
      
      return douglasPeucker(points, tolerance);
    }
  `;
  
  // Create blob URL for the worker
  const blob = new Blob([workerCode], { type: 'application/javascript' });
  const url = URL.createObjectURL(blob);
  
  // Create the worker
  const worker = new Worker(url);
  
  // Clean up the URL when done
  URL.revokeObjectURL(url);
  
  return worker;
}

/**
 * Offload calculateArea to a worker
 * @param points Points defining a polygon
 * @returns Promise resolving to the area
 */
export function calculateAreaInWorker(points: Point[]): Promise<number> {
  // For small polygons, just calculate inline
  if (points.length < 10) {
    return Promise.resolve(calculateArea(points));
  }
  
  const worker = createGeometryWorker();
  
  if (!worker) {
    // Fallback to synchronous calculation
    return Promise.resolve(calculateArea(points));
  }
  
  return new Promise((resolve, reject) => {
    const id = Math.random().toString(36).substr(2, 9);
    
    const handleMessage = (event: MessageEvent) => {
      const data = event.data as ResultMessage | ErrorMessage;
      
      if (data.id !== id) return;
      
      worker.removeEventListener('message', handleMessage);
      worker.terminate();
      
      if (data.type === GeometryWorkerMessageType.RESULT) {
        resolve(data.result);
      } else if (data.type === GeometryWorkerMessageType.ERROR) {
        reject(new Error(data.error));
      }
    };
    
    worker.addEventListener('message', handleMessage);
    
    worker.postMessage({
      type: GeometryWorkerMessageType.CALCULATE_AREA,
      id,
      points
    });
  });
}

/**
 * Offload simplifyPath to a worker
 * @param points Points defining a path
 * @param tolerance Distance tolerance
 * @returns Promise resolving to simplified points
 */
export function simplifyPathInWorker(points: Point[], tolerance: number = 1): Promise<Point[]> {
  // For small paths, just calculate inline
  if (points.length < 20) {
    return Promise.resolve(simplifyPath(points, tolerance));
  }
  
  const worker = createGeometryWorker();
  
  if (!worker) {
    // Fallback to synchronous calculation
    return Promise.resolve(simplifyPath(points, tolerance));
  }
  
  return new Promise((resolve, reject) => {
    const id = Math.random().toString(36).substr(2, 9);
    
    const handleMessage = (event: MessageEvent) => {
      const data = event.data as ResultMessage | ErrorMessage;
      
      if (data.id !== id) return;
      
      worker.removeEventListener('message', handleMessage);
      worker.terminate();
      
      if (data.type === GeometryWorkerMessageType.RESULT) {
        resolve(data.result);
      } else if (data.type === GeometryWorkerMessageType.ERROR) {
        reject(new Error(data.error));
      }
    };
    
    worker.addEventListener('message', handleMessage);
    
    worker.postMessage({
      type: GeometryWorkerMessageType.SIMPLIFY_PATH,
      id,
      points,
      tolerance
    });
  });
}
