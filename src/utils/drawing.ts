
/**
 * Drawing utilities main module
 * Re-exports functionality from specialized drawing utility files
 * Provides constants for grid and drawing settings
 * @module drawing
 */

// Grid and drawing constants
export const PIXELS_PER_METER = 100; // 100 pixels = 1 meter
export const SMALL_GRID = PIXELS_PER_METER / 10; // 0.1m
export const LARGE_GRID = PIXELS_PER_METER; // 1m

// Memory management constants
export const MAX_HISTORY_STATES = 50; // Maximum undo/redo history states
export const MAX_OBJECTS_PER_CANVAS = 1000; // Safety limit for number of objects

// Re-export everything from the specialized files
export * from './drawingTypes';
export * from './geometry';
export * from './fabricPathUtils';
export * from './floorPlanStorage';
