
/**
 * Geometry Engine
 * Core mathematical utilities for geometric operations
 * 
 * This package provides a unified API for all geometry-related operations,
 * making it reusable across projects and easier to maintain.
 * 
 * @module geometry-engine
 */

// Re-export all core types and functions
export * from './types';
export * from './core';
export * from './transformations';
export * from './calculations';
export * from './validation';
export * from './worker';

// Export version information
export const VERSION = '1.0.0';

/**
 * Initialize the geometry engine with optional configuration
 * @param config Configuration options
 */
export function initGeometryEngine(config?: {
  useWorker?: boolean;
  precision?: number;
  logPerformance?: boolean;
}) {
  // Set default configuration
  const finalConfig = {
    useWorker: true,
    precision: 2,
    logPerformance: false,
    ...config
  };
  
  // Initialize worker if enabled
  if (finalConfig.useWorker) {
    // Import worker initialization lazily
    import('./worker').then(({ initGeometryWorker }) => {
      initGeometryWorker();
      console.log('Geometry engine worker initialized');
    }).catch(error => {
      console.error('Failed to initialize geometry worker:', error);
    });
  }
  
  return {
    version: VERSION,
    config: finalConfig
  };
}
