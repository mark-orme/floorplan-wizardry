
/**
 * Geometry Engine Worker
 * Performs heavy computations off the main thread
 */
import { 
  simplifyPolyline 
} from './simplification';
import {
  Point,
  LineSegment,
  WorkerMessageData,
  WorkerResponseData
} from './types';

// Handle messages from the main thread
self.onmessage = (e: MessageEvent<WorkerMessageData>) => {
  try {
    const { operation, data, id } = e.data;
    let result;
    
    switch (operation) {
      case 'simplifyPolyline':
        result = simplifyPolyline(
          data.points as Point[], 
          data.tolerance as number
        );
        break;
        
      // Add other operations as needed
        
      default:
        throw new Error(`Unknown operation: ${operation}`);
    }
    
    // Send results back to main thread
    const response: WorkerResponseData = {
      id,
      status: 'success',
      result
    };
    
    self.postMessage(response);
  } catch (error) {
    // Send error back to main thread
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    const response: WorkerResponseData = {
      id: e.data.id,
      status: 'error',
      error: errorMessage
    };
    
    self.postMessage(response);
  }
};

// Export nothing - this is a worker script
export {};
