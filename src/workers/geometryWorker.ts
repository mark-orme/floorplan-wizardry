
/**
 * Web worker for optimized geometry calculations
 * Uses transferable objects for better performance
 */

import { Point } from '@/types/core/Geometry';
import {
  calculatePolygonArea,
  calculateDistance,
  optimizePoints,
  snapPointsToGrid,
  perpendicularDistance
} from '@/utils/geometry/engine';

// Define types for worker messages
type WorkerMessageData = {
  id: string;
  type: 'calculateArea' | 'calculateDistance' | 'optimizePoints' | 'snapToGrid';
  payload: any;
};

// Listen for messages from the main thread
self.addEventListener('message', (event: MessageEvent<WorkerMessageData>) => {
  const { id, type, payload } = event.data;
  
  try {
    let result;
    let transferables: Transferable[] = [];
    
    // Process different calculation types
    switch (type) {
      case 'calculateArea':
        result = calculatePolygonArea(payload.points);
        break;
        
      case 'calculateDistance':
        result = calculateDistance(payload.start, payload.end);
        break;
        
      case 'optimizePoints':
        const optPoints = optimizePoints(
          payload.points, 
          payload.tolerance || 1
        );
        
        if (payload.useTransferable) {
          const typedArray = pointsToTypedArray(optPoints);
          result = {
            points: typedArray,
            buffer: typedArray.buffer
          };
          transferables.push(typedArray.buffer);
        } else {
          result = { points: optPoints };
        }
        break;
        
      case 'snapToGrid':
        const snappedPoints = snapPointsToGrid(
          payload.points, 
          payload.gridSize
        );
        
        if (payload.useTransferable) {
          const typedArray = pointsToTypedArray(snappedPoints);
          result = {
            points: typedArray,
            buffer: typedArray.buffer
          };
          transferables.push(typedArray.buffer);
        } else {
          result = { points: snappedPoints };
        }
        break;
        
      default:
        throw new Error(`Unknown calculation type: ${type}`);
    }
    
    // Send result back to main thread with proper transferable format
    if (transferables.length > 0) {
      self.postMessage({
        id,
        success: true,
        result
      }, { transfer: transferables });
    } else {
      self.postMessage({
        id,
        success: true,
        result
      });
    }
  } catch (error) {
    self.postMessage({
      id,
      success: false,
      error: error instanceof Error ? error.message : String(error)
    });
  }
});

/**
 * Convert between array formats
 */
function pointsToTypedArray(points: Point[]): Float32Array {
  const result = new Float32Array(points.length * 2);
  
  for (let i = 0; i < points.length; i++) {
    result[i * 2] = points[i].x;
    result[i * 2 + 1] = points[i].y;
  }
  
  return result;
}

function typedArrayToPoints(array: Float32Array): Point[] {
  const points = [];
  
  for (let i = 0; i < array.length; i += 2) {
    points.push({
      x: array[i],
      y: array[i + 1]
    });
  }
  
  return points;
}
