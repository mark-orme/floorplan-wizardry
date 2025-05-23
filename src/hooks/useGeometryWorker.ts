
import { useState, useEffect, useCallback } from 'react';
import { Point } from '@/types/core/Point';

// Define worker message types
interface WorkerRequest {
  type: string;
  payload: any;
}

interface WorkerResponse {
  type: string;
  payload: any;
}

export const useGeometryWorker = () => {
  const [worker, setWorker] = useState<Worker | null>(null);
  const [isReady, setIsReady] = useState(false);
  
  // Initialize worker
  useEffect(() => {
    // For now, we'll simulate a worker since we can't create a real one in the test environment
    const simulatedWorker = {
      postMessage: (message: WorkerRequest) => {
        // Process the message in the main thread
        setTimeout(() => {
          handleWorkerMessage({ data: processMessage(message) });
        }, 0);
      },
      onmessage: null as ((event: { data: WorkerResponse }) => void) | null,
      terminate: () => {}
    };
    
    // Set up message handler
    const handleWorkerMessage = (event: { data: WorkerResponse }) => {
      if (simulatedWorker.onmessage) {
        simulatedWorker.onmessage(event);
      }
    };
    
    // Simulate worker processing
    const processMessage = (message: WorkerRequest): WorkerResponse => {
      switch (message.type) {
        case 'initialize':
          return { type: 'initialized', payload: { success: true } };
        case 'calculateDistance':
          const { point1, point2 } = message.payload;
          if (!point1 || !point2) return { type: 'error', payload: 'Invalid points' };
          
          const dx = (point2.x || 0) - (point1.x || 0);
          const dy = (point2.y || 0) - (point1.y || 0);
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          return { type: 'distanceResult', payload: { distance } };
        default:
          return { type: 'error', payload: 'Unknown message type' };
      }
    };
    
    // Set worker
    setWorker(simulatedWorker as any);
    
    // Mark as ready after a short delay
    const timeout = setTimeout(() => {
      setIsReady(true);
    }, 100);
    
    // Clean up
    return () => {
      clearTimeout(timeout);
      if (simulatedWorker) {
        simulatedWorker.terminate();
      }
    };
  }, []);
  
  // Calculate distance between two points
  const calculateDistance = useCallback((point1: Point | null, point2: Point | null): Promise<number> => {
    return new Promise((resolve, reject) => {
      if (!worker || !isReady) {
        reject(new Error('Worker not ready'));
        return;
      }
      
      if (!point1 || !point2) {
        resolve(0);
        return;
      }
      
      // Set up one-time message handler
      const handleMessage = (event: { data: WorkerResponse }) => {
        if (event.data.type === 'distanceResult') {
          resolve(event.data.payload.distance);
          worker.onmessage = null;
        } else if (event.data.type === 'error') {
          reject(new Error(event.data.payload));
          worker.onmessage = null;
        }
      };
      
      worker.onmessage = handleMessage;
      
      // Send message to worker
      worker.postMessage({
        type: 'calculateDistance',
        payload: { point1, point2 }
      });
    });
  }, [worker, isReady]);
  
  return {
    isReady,
    worker,
    calculateDistance
  };
};

export default useGeometryWorker;
