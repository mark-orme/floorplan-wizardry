
/**
 * Drawing utilities main module
 * Re-exports functionality from specialized drawing utility files
 * Provides constants for grid and drawing settings
 * @module drawing
 */

import { 
  PIXELS_PER_METER,
  GRID_SPACING,
  SMALL_GRID,
  LARGE_GRID,
  MAX_HISTORY_STATES,
  MAX_OBJECTS_PER_CANVAS,
  DEFAULT_LINE_THICKNESS
} from '@/constants/numerics';

// Re-export constants for backward compatibility
export {
  PIXELS_PER_METER,
  GRID_SPACING,
  SMALL_GRID,
  LARGE_GRID,
  MAX_HISTORY_STATES,
  MAX_OBJECTS_PER_CANVAS,
  DEFAULT_LINE_THICKNESS
};

/**
 * Drawing constants
 */
export const DEFAULT_LINE_COLOR = "#000000"; // Default line color (black)

/**
 * Re-export everything from the specialized files
 */
export * from '@/types/drawingTypes';
export * from './geometry'; // This now re-exports from all geometry modules
export * from './fabricPathUtils';
export * from './floorPlanStorage';
