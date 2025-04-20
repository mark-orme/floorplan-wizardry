
/**
 * Geometry Engine
 * Core module for geometric calculations
 * @module geometry-engine
 */

import {
  Point,
  Line,
  LineSegment,
  Polygon,
  GeometryOperationOptions,
  WorkerMessageData,
  WorkerResponse
} from './types';

// Worker instance for offloading calculations
let geometryWorker: Worker | null = null;

// Pending requests map
const pendingRequests = new Map<string, {
  resolve: (value: any) => void;
  reject: (reason: any) => void;
}>();

/**
 * Initialize the geometry engine with a worker
 */
export function initGeometryEngine(): void {
  if (typeof Worker !== 'undefined' && !geometryWorker) {
    try {
      geometryWorker = new Worker(new URL('./worker.ts', import.meta.url), { type: 'module' });
      
      geometryWorker.onmessage = (event: MessageEvent<WorkerResponse>) => {
        const { id, result, error } = event.data;
        const request = pendingRequests.get(id);
        
        if (request) {
          if (error) {
            request.reject(new Error(error));
          } else {
            request.resolve(result);
          }
          pendingRequests.delete(id);
        }
      };
      
      geometryWorker.onerror = (error) => {
        console.error('Geometry engine worker error:', error);
      };
    } catch (error) {
      console.error('Failed to initialize geometry engine worker:', error);
    }
  }
}

/**
 * Clean up the geometry engine, terminating the worker
 */
export function terminateGeometryEngine(): void {
  if (geometryWorker) {
    geometryWorker.terminate();
    geometryWorker = null;
    pendingRequests.clear();
  }
}

/**
 * Send a message to the geometry worker
 */
function sendToWorker<T>(
  operation: string,
  payload: any,
  options?: GeometryOperationOptions
): Promise<T> {
  return new Promise((resolve, reject) => {
    if (!geometryWorker) {
      initGeometryEngine();
      
      if (!geometryWorker) {
        // Fallback for client-side calculation
        try {
          const result = processClientSide(operation, payload, options);
          resolve(result as T);
        } catch (error) {
          reject(error);
        }
        return;
      }
    }
    
    const id = Math.random().toString(36).substring(2, 15);
    
    pendingRequests.set(id, { resolve, reject });
    
    const message: WorkerMessageData = {
      operation,
      payload: { ...payload, options },
      id
    };
    
    geometryWorker.postMessage(message);
  });
}

/**
 * Process geometry operations on the client side as a fallback
 */
function processClientSide(
  operation: string,
  payload: any,
  options?: GeometryOperationOptions
): any {
  switch (operation) {
    case 'calculateIntersection':
      return calculateIntersection(payload.line1, payload.line2, options);
    case 'calculatePolygonArea':
      return calculatePolygonArea(payload.polygon, options);
    case 'isPointInPolygon':
      return isPointInPolygon(payload.point, payload.polygon, options);
    case 'calculateDistance':
      return calculateDistance(payload.point1, payload.point2);
    default:
      throw new Error(`Unknown operation: ${operation}`);
  }
}

/**
 * Calculate intersection point between two line segments
 */
export function calculateIntersection(
  line1: LineSegment,
  line2: LineSegment,
  options?: GeometryOperationOptions
): Point | null {
  return sendToWorker<Point | null>('calculateIntersection', { line1, line2 }, options);
}

/**
 * Calculate the area of a polygon
 */
export function calculatePolygonArea(
  polygon: Polygon,
  options?: GeometryOperationOptions
): Promise<number> {
  return sendToWorker<number>('calculatePolygonArea', { polygon }, options);
}

/**
 * Check if a point is inside a polygon
 */
export function isPointInPolygon(
  point: Point,
  polygon: Polygon,
  options?: GeometryOperationOptions
): Promise<boolean> {
  return sendToWorker<boolean>('isPointInPolygon', { point, polygon }, options);
}

/**
 * Calculate the distance between two points
 */
export function calculateDistance(point1: Point, point2: Point): number {
  const dx = point2.x - point1.x;
  const dy = point2.y - point1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

// Client-side implementation of these functions for fallback
function calculateIntersectionClientSide(
  line1: LineSegment,
  line2: LineSegment,
  options?: GeometryOperationOptions
): Point | null {
  // Implementation omitted for brevity, will be added if needed
  return null;
}

function calculatePolygonAreaClientSide(
  polygon: Polygon,
  options?: GeometryOperationOptions
): number {
  const { points } = polygon;
  if (points.length < 3) return 0;
  
  let area = 0;
  for (let i = 0; i < points.length; i++) {
    const j = (i + 1) % points.length;
    area += points[i].x * points[j].y;
    area -= points[j].x * points[i].y;
  }
  
  return Math.abs(area) / 2;
}

function isPointInPolygonClientSide(
  point: Point,
  polygon: Polygon,
  options?: GeometryOperationOptions
): boolean {
  const { points } = polygon;
  if (points.length < 3) return false;
  
  let inside = false;
  for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
    const { x: xi, y: yi } = points[i];
    const { x: xj, y: yj } = points[j];
    
    const intersect = ((yi > point.y) !== (yj > point.y)) &&
      (point.x < (xj - xi) * (point.y - yi) / (yj - yi) + xi);
    
    if (intersect) {
      inside = !inside;
    }
  }
  
  return inside;
}
