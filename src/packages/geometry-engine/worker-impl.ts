
/**
 * Web worker implementation for geometry calculations
 * This file runs in a separate thread
 */
import { WorkerMessageData } from './types';
import { 
  calculatePolygonArea, 
  calculateDistance, 
  isPointInPolygon,
  perpendicularDistance
} from './core';
import {
  optimizePoints,
  snapPointsToGrid
} from './transformations';

// Listen for messages from the main thread
self.addEventListener('message', (event: MessageEvent<WorkerMessageData>) => {
  const { id, type, payload } = event.data;
  
  try {
    let result;
    
    // Process different calculation types
    switch (type) {
      case 'calculateArea':
        result = calculatePolygonArea(payload.points);
        break;
        
      case 'calculateDistance':
        result = calculateDistance(payload.start, payload.end);
        break;
        
      case 'optimizePoints':
        result = optimizePoints(payload.points, payload.tolerance || 1);
        break;
        
      case 'snapToGrid':
        result = snapPointsToGrid(payload.points, payload.gridSize);
        break;
        
      case 'isPointInPolygon':
        result = isPointInPolygon(payload.point, payload.polygon);
        break;
        
      default:
        throw new Error(`Unknown calculation type: ${type}`);
    }
    
    // Send result back to main thread
    self.postMessage({
      id,
      success: true,
      result
    });
  } catch (error) {
    self.postMessage({
      id,
      success: false,
      error: error instanceof Error ? error.message : String(error)
    });
  }
});

// Let the main thread know the worker is ready
self.postMessage({ type: 'ready' });
