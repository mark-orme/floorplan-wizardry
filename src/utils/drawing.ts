
/**
 * Drawing utilities main module
 * Re-exports functionality from specialized drawing utility files
 * Provides constants for grid and drawing settings
 * @module drawing
 */

/**
 * Unit conversion constants
 */
export const PIXELS_PER_METER = 100; // 100 pixels = 1 meter (exact conversion)
export const GRID_SIZE = 0.1; // Grid size in meters (0.1m = 10cm)

/**
 * Grid display constants 
 */
export const SMALL_GRID = PIXELS_PER_METER * GRID_SIZE; // 0.1m (10px)
export const LARGE_GRID = PIXELS_PER_METER; // 1m (100px)

/**
 * Performance and memory management constants
 */
export const MAX_HISTORY_STATES = 50; // Maximum undo/redo history states
export const MAX_OBJECTS_PER_CANVAS = 1000; // Safety limit for number of objects

/**
 * Drawing constants
 */
export const DEFAULT_LINE_THICKNESS = 2; // Default line thickness in pixels
export const DEFAULT_LINE_COLOR = "#000000"; // Default line color (black)

/**
 * Re-export everything from the specialized files
 */
export * from './drawingTypes';
export * from './geometry'; // This now re-exports from all geometry modules
export * from './fabricPathUtils';
export * from './floorPlanStorage';
