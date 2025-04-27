
import { useState, useEffect } from 'react';

interface UseGeometryWorkerOptions {
  autoInit?: boolean;
  onInitialized?: () => void;
  onError?: (error: Error) => void;
}

export const useGeometryWorker = (options: UseGeometryWorkerOptions = {}) => {
  const { 
    autoInit = true,
    onInitialized,
    onError
  } = options;
  
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Simulate worker initialization
  useEffect(() => {
    if (!autoInit) return;
    
    let isMounted = true;
    
    const initWorker = async () => {
      try {
        // Simulate initialization delay
        await new Promise(resolve => setTimeout(resolve, 100));
        
        if (isMounted) {
          setIsReady(true);
          onInitialized?.();
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to initialize geometry worker');
        if (isMounted) {
          setError(error);
          setIsReady(false);
          onError?.(error);
        }
      }
    };
    
    initWorker();
    
    return () => {
      isMounted = false;
    };
  }, [autoInit, onInitialized, onError]);
  
  // Stub function for geometry calculations
  const calculateArea = async (points: [number, number][]) => {
    if (!isReady) {
      throw new Error('Geometry worker not initialized');
    }
    
    // Simple polygon area calculation
    let area = 0;
    for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
      area += (points[j][0] + points[i][0]) * (points[j][1] - points[i][1]);
    }
    return Math.abs(area / 2);
  };
  
  return {
    isReady,
    error,
    calculateArea
  };
};
