
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

// Snap settings
export const DEFAULT_SNAP_THRESHOLD = 10;
export const DEFAULT_ANGLE_SNAP_DEGREES = 15;

// Grid rendering
export const MAX_GRID_LINES = 1000; // Safety limit for grid rendering
export const GRID_ZOOM_THRESHOLD = 0.5; // Below this zoom level, simplify grid

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
