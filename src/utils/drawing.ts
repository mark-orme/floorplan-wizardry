/**
 * Drawing utilities
 * @module drawing
 */

// Re-export types from floorPlanTypes for backwards compatibility
export { FloorPlan } from '@/types/floorPlanTypes';
export type { Wall, Room, Point, Stroke, PaperSize } from '@/types/floorPlanTypes';

import { 
  PIXELS_PER_METER,
  GRID_SPACING,
  SMALL_GRID,
  LARGE_GRID,
  MAX_HISTORY_STATES,
  MAX_OBJECTS_PER_CANVAS,
  DEFAULT_LINE_THICKNESS,
  AREA_PRECISION
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
 * Define GRID_SIZE as GRID_SPACING for backward compatibility
 * Used by grid utilities for coordinate operations
 */
export const GRID_SIZE = GRID_SPACING;

/**
 * Default line color for drawing
 * @constant {string}
 */
export const DEFAULT_LINE_COLOR = "#000000"; // Default line color (black)

/**
 * Calculate GIA (Gross Internal Area) from points
 * Uses the Shoelace formula (Gauss's area formula) to calculate polygon area
 * 
 * @param {Array<{x: number, y: number}>} points - Array of points defining the polygon
 * @returns {number} Calculated area in square meters
 */
export const calculateGIA = (points: Array<{x: number, y: number}>): number => {
  if (!points || points.length < 3) return 0;
  
  // Calculate area using the Shoelace formula (Gauss's area formula)
  let area = 0;
  
  for (let i = 0; i < points.length; i++) {
    const j = (i + 1) % points.length;
    area += points[i].x * points[j].y;
    area -= points[j].x * points[i].y;
  }
  
  // Take the absolute value and divide by 2
  area = Math.abs(area) / 2;
  
  // Round to specified precision
  const roundFactor = Math.pow(10, AREA_PRECISION);
  return Math.round(area * roundFactor) / roundFactor;
};

/**
 * Re-export everything from the specialized files
 */
export * from '@/types/drawingTypes';
export * from './geometry'; // This now re-exports from all geometry modules
export * from './fabricPath'; // Use new modular path utilities
export * from './floorPlanStorage';
