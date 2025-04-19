
/**
 * Hook for using WebAssembly-accelerated geometry calculations
 * @module hooks/useWasmGeometry
 */

import { useState, useEffect, useCallback } from 'react';
import { 
  supportsWasm, 
  wasmStatus, 
  initWasmModules,
  getWasmFeatures
} from '@/utils/wasm';
import { 
  calculateAreaInSquareMeters,
  optimizePolygon,
  isPointInPolygon,
  calculatePerimeter,
  calculateCentroid
} from '@/utils/wasm/geometryUtils';
import { Point } from '@/types/core/Geometry';
import logger from '@/utils/logger';

/**
 * Hook for using WebAssembly-accelerated geometry calculations
 * @returns Geometry utility functions and status information
 */
export function useWasmGeometry() {
  const [initialized, setInitialized] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [features, setFeatures] = useState(getWasmFeatures());
  
  // Initialize WASM modules
  useEffect(() => {
    const init = async () => {
      if (initialized || loading || !supportsWasm()) return;
      
      setLoading(true);
      
      try {
        await initWasmModules();
        setInitialized(true);
        setFeatures(getWasmFeatures());
      } catch (err) {
        logger.error('Failed to initialize WASM modules:', err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };
    
    init();
  }, [initialized, loading]);
  
  // Calculate area in square meters
  const calculateArea = useCallback(async (points: Point[], pixelsPerMeter?: number) => {
    return calculateAreaInSquareMeters(points, pixelsPerMeter);
  }, []);
  
  // Optimize polygon by removing redundant points
  const optimizePath = useCallback(async (points: Point[], tolerance?: number) => {
    return optimizePolygon(points, tolerance);
  }, []);
  
  // Check if a point is inside a polygon
  const pointInPolygon = useCallback((point: Point, polygon: Point[]) => {
    return isPointInPolygon(point, polygon);
  }, []);
  
  // Calculate perimeter of a polygon
  const calculatePathLength = useCallback((points: Point[]) => {
    return calculatePerimeter(points);
  }, []);
  
  // Calculate center point of a polygon
  const findCenter = useCallback((points: Point[]) => {
    return calculateCentroid(points);
  }, []);
  
  return {
    // Status
    initialized,
    loading,
    error,
    features,
    isSupported: supportsWasm(),
    
    // Geometry functions
    calculateArea,
    optimizePath,
    pointInPolygon,
    calculatePathLength,
    findCenter,
  };
}
