
/**
 * Zoom-related type definitions
 * @module zoomTypes
 */

/**
 * Zoom direction options
 */
export type ZoomDirection = 'in' | 'out';

/**
 * Zoom constraints
 */
export const ZOOM_CONSTRAINTS = {
  MIN: 0.1,
  MAX: 10,
  DEFAULT: 1
};

/**
 * Zoom multipliers for zooming in and out
 */
export const ZOOM_MULTIPLIERS = {
  IN: 1.2,
  OUT: 0.8
};

/**
 * Zoom options configuration
 */
export interface ZoomOptions {
  /** Direction to zoom */
  direction: ZoomDirection;
  /** Zoom factor */
  factor?: number;
  /** Zoom center point */
  point?: { x: number; y: number };
}
