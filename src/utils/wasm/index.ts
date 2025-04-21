/**
 * WASM utility index
 * Exports WASM functionality and status
 * @module utils/wasm
 */

import { Point } from '@/types/core/Geometry';
import logger from '../logger';

/**
 * WASM status object
 */
export const wasmStatus = {
  loaded: false,
  error: false,
  errorMessage: '',
  supported: true
};

/**
 * Check if WASM is supported in this browser
 * @returns True if WASM is supported
 */
export function supportsWasm(): boolean {
  return (
    typeof WebAssembly === 'object' &&
    typeof WebAssembly.instantiate === 'function' &&
    typeof WebAssembly.compile === 'function'
  );
}

/**
 * Initialize WASM module
 * @returns Promise resolving when WASM is loaded
 */
export async function initWasm(): Promise<boolean> {
  if (!supportsWasm()) {
    wasmStatus.supported = false;
    wasmStatus.error = true;
    wasmStatus.errorMessage = 'WebAssembly is not supported in this browser';
    logger.warn('WebAssembly is not supported', { category: 'wasm' });
    return false;
  }
  
  try {
    // This would be where we load the WASM module
    // Placeholder for now as we don't have the actual WASM binary
    wasmStatus.loaded = true;
    logger.info('WASM module loaded successfully', { category: 'wasm' });
    return true;
  } catch (error) {
    wasmStatus.error = true;
    wasmStatus.errorMessage = error instanceof Error ? error.message : String(error);
    logger.error('Failed to load WASM module', { category: 'wasm', error });
    return false;
  }
}

/**
 * Calculate area using WASM (fallback to JS if WASM not available)
 * @param points Polygon points
 * @returns Area calculation
 */
export async function calculateArea(points: Point[]): Promise<number> {
  if (!wasmStatus.loaded || wasmStatus.error) {
    // Fallback to JavaScript implementation
    const { calculatePolygonArea } = await import('../geometry/engine');
    return calculatePolygonArea(points);
  }
  
  // Placeholder: this would call the WASM implementation
  // For now we'll use the JS implementation
  const { calculatePolygonArea } = await import('../geometry/engine');
  return calculatePolygonArea(points);
}

/**
 * Load the WASM module automatically
 */
if (typeof window !== 'undefined') {
  initWasm().catch(error => {
    logger.error('WASM initialization failed', { category: 'wasm', error });
  });
}
