
/**
 * Floor plan adapter
 * Provides utilities for adapting between different floor plan formats
 * @module utils/floorPlanAdapter
 */

// Re-export from index module
export * from './floorPlanAdapter/index';

// Re-export drawing mode normalization
export const normalizeDrawingMode = (mode: string): string => {
  // Simple implementation to normalize drawing mode
  return mode.toLowerCase();
};
