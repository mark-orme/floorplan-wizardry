
import { useEffect, useState, useCallback } from 'react';
import { Point } from '@/types/core/Geometry';
import { 
  initGeometryWorker, 
  terminateGeometryWorker,
  calculateArea,
  calculateDistance,
  simplifyPath,
  snapToGrid
} from '../workers/geometryWorkerClient';

export function useGeometryWorker() {
  const [isReady, setIsReady] = useState(false);
  
  // Initialize worker
  useEffect(() => {
    let mounted = true;
    
    initGeometryWorker()
      .then(() => {
        if (mounted) {
          setIsReady(true);
        }
      })
      .catch(err => {
        console.error('Failed to initialize geometry worker:', err);
      });
    
    // Clean up worker when hook is unmounted
    return () => {
      mounted = false;
      terminateGeometryWorker();
    };
  }, []);
  
  // Wrapped worker methods with isReady check
  const calculatePolygonArea = useCallback(async (points: Point[]): Promise<number> => {
    if (!isReady) {
      await initGeometryWorker();
    }
    return calculateArea(points);
  }, [isReady]);
  
  const calculatePointDistance = useCallback(async (start: Point, end: Point): Promise<number> => {
    if (!isReady) {
      await initGeometryWorker();
    }
    return calculateDistance(start, end);
  }, [isReady]);
  
  const optimizePath = useCallback(async (points: Point[], tolerance: number): Promise<Point[]> => {
    if (!isReady) {
      await initGeometryWorker();
    }
    return simplifyPath(points, tolerance);
  }, [isReady]);
  
  const snapPointsToGrid = useCallback(async (points: Point[], gridSize: number): Promise<Point[]> => {
    if (!isReady) {
      await initGeometryWorker();
    }
    return snapToGrid(points, gridSize);
  }, [isReady]);
  
  return {
    isReady,
    calculatePolygonArea,
    calculatePointDistance,
    optimizePath,
    snapPointsToGrid
  };
}
