
/**
 * Grid constants for use across the application
 */

// Base measurements
export const PIXELS_PER_METER = 100;
export const DEFAULT_GRID_SIZE = 20;
export const DEFAULT_GRID_DIVISIONS = 5;

// Grid appearance
export const DEFAULT_GRID_COLOR = '#cccccc';
export const DEFAULT_GRID_OPACITY = 0.5;
export const DEFAULT_MAJOR_GRID_COLOR = '#aaaaaa';
export const DEFAULT_MAJOR_GRID_OPACITY = 0.8;

// Add the missing grid constants that other components are trying to import
export const SMALL_GRID_SIZE = DEFAULT_GRID_SIZE;
export const LARGE_GRID_SIZE = DEFAULT_GRID_SIZE * DEFAULT_GRID_DIVISIONS;
export const SMALL_GRID_COLOR = DEFAULT_GRID_COLOR;
export const LARGE_GRID_COLOR = DEFAULT_MAJOR_GRID_COLOR;

// Snap settings
export const DEFAULT_SNAP_THRESHOLD = 10;
export const DEFAULT_ANGLE_SNAP_DEGREES = 15;

// Grid rendering
export const MAX_GRID_LINES = 1000; // Safety limit for grid rendering
export const GRID_ZOOM_THRESHOLD = 0.5; // Below this zoom level, simplify grid

// Re-export the GRID_CONSTANTS that some files are trying to import
export const GRID_CONSTANTS = {
  SMALL_GRID_SIZE,
  LARGE_GRID_SIZE,
  SMALL_GRID_COLOR,
  LARGE_GRID_COLOR,
  PIXELS_PER_METER,
  DEFAULT_GRID_SIZE,
  DEFAULT_GRID_DIVISIONS
};

/**
 * Get the appropriate grid size based on zoom level
 * @param zoomLevel Current zoom level
 * @returns Grid size in pixels
 */
export function getAdaptiveGridSize(zoomLevel: number): number {
  if (zoomLevel < 0.2) return 100;
  if (zoomLevel < 0.5) return 50;
  if (zoomLevel < 1) return 20;
  return DEFAULT_GRID_SIZE;
}

/**
 * Grid style configuration
 */
export const GRID_STYLES = {
  minor: {
    color: DEFAULT_GRID_COLOR,
    opacity: DEFAULT_GRID_OPACITY,
    width: 1
  },
  major: {
    color: DEFAULT_MAJOR_GRID_COLOR,
    opacity: DEFAULT_MAJOR_GRID_OPACITY,
    width: 1.5
  }
};
