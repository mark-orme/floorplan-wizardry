
/**
 * Hook for using WASM geometry operations
 * @module hooks/useWasmGeometry
 */

import { useState, useEffect, useCallback } from 'react';
import { Point } from '@/types/core/Geometry';
import { wasmStatus, initWasm, calculateArea } from '@/utils/wasm';
import logger from '@/utils/logger';

/**
 * Hook for WASM-powered geometry calculations
 * @returns An object with WASM geometry utilities
 */
export function useWasmGeometry() {
  const [initialized, setInitialized] = useState(wasmStatus.loaded);
  const [loading, setLoading] = useState(!wasmStatus.loaded);
  const [error, setError] = useState<string | null>(wasmStatus.error ? wasmStatus.errorMessage : null);

  // Initialize WASM module
  useEffect(() => {
    if (wasmStatus.loaded) {
      setInitialized(true);
      setLoading(false);
      return;
    }

    async function loadWasm() {
      try {
        setLoading(true);
        const success = await initWasm();
        setInitialized(success);
        setLoading(false);

        if (!success) {
          setError('Failed to initialize WASM module');
          logger.warn('WASM initialization failed, falling back to JS', { category: 'wasm' });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
        setLoading(false);
        logger.error('Error initializing WASM module', { category: 'wasm', error: err });
      }
    }

    loadWasm();
  }, []);

  /**
   * Calculate area of a polygon using WASM (or JS fallback)
   * @param points Polygon points
   * @returns Calculated area
   */
  const calculatePolygonArea = useCallback(async (points: Point[]): Promise<number> => {
    try {
      return await calculateArea(points);
    } catch (err) {
      logger.error('Error calculating area with WASM', { category: 'wasm', error: err });
      throw err;
    }
  }, []);

  return {
    initialized,
    loading,
    error,
    supported: wasmStatus.supported,
    calculatePolygonArea,
    wasmStatus
  };
}

export default useWasmGeometry;
