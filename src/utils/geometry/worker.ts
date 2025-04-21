
/**
 * Geometry worker utility
 * @module utils/geometry/worker
 */

import { Point } from '@/types/core/Geometry';
import { 
  calculatePolygonArea,
  calculateDistance,
  optimizePoints,
  snapPointsToGrid,
  perpendicularDistance
} from './engine';

// Define a worker function to handle geometry operations
// This will be called by the main thread
self.onmessage = (event) => {
  const { operation, data } = event.data;
  
  try {
    let result;
    
    switch (operation) {
      case 'calculateArea':
        result = calculatePolygonArea(data.points);
        break;
        
      case 'calculateDistance':
        result = calculateDistance(data.point1, data.point2);
        break;
        
      case 'optimizePoints':
        result = optimizePoints(data.points, data.tolerance);
        break;
        
      case 'snapToGrid':
        result = snapPointsToGrid(data.points, data.gridSize);
        break;
        
      default:
        throw new Error(`Unknown geometry operation: ${operation}`);
    }
    
    self.postMessage({
      success: true,
      result,
      operation,
      id: data.id
    });
    
  } catch (error) {
    self.postMessage({
      success: false,
      error: error instanceof Error ? error.message : String(error),
      operation,
      id: data.id
    });
  }
};

// Export a dummy function so this can be imported as a module
export default {};
