
/**
 * Web worker for geometry calculations
 */
import { Point } from './types';
import { simplifyPolyline } from './simplification';
import { calculateDistance, perpendicularDistance } from './core';
import { snapToGrid } from './snapping';

// Set up worker context
const ctx: Worker = self as any;

// Handle worker messages
ctx.addEventListener('message', (e: MessageEvent) => {
  const { type, points, options } = e.data;
  
  try {
    let result;
    
    switch (type) {
      case 'simplify':
        result = simplifyPolyline(points, options?.epsilon || 2);
        break;
        
      case 'snap':
        result = points.map(point => snapToGrid(point, options?.gridSize || 10));
        break;
        
      case 'calculate':
        result = calculateDistances(points);
        break;
        
      default:
        throw new Error(`Unknown operation type: ${type}`);
    }
    
    // Send results back to main thread
    ctx.postMessage({
      type,
      result
    });
  } catch (error) {
    // Send error back to main thread
    ctx.postMessage({
      type,
      error: error instanceof Error ? error.message : String(error),
      result: null
    });
  }
});

/**
 * Calculate various distances for a set of points
 * @param points Array of points
 * @returns Object with various distance calculations
 */
function calculateDistances(points: Point[]) {
  if (points.length < 2) {
    return {
      totalLength: 0,
      segmentLengths: []
    };
  }
  
  const segmentLengths: number[] = [];
  let totalLength = 0;
  
  for (let i = 0; i < points.length - 1; i++) {
    const distance = calculateDistance(points[i], points[i + 1]);
    segmentLengths.push(distance);
    totalLength += distance;
  }
  
  return {
    totalLength,
    segmentLengths
  };
}

// Notify that the worker is ready
ctx.postMessage({ type: 'ready' });
