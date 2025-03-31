
/**
 * Zoom options interface
 * Contains configuration for zoom operations
 */
export interface ZoomOptions {
  /** Zoom level to set */
  level: number;
  /** X coordinate of zoom center */
  centerX?: number;
  /** Y coordinate of zoom center */
  centerY?: number;
  /** Whether to skip rendering after zoom */
  skipRender?: boolean;
}

/**
 * Zoom direction type
 * Defines the direction of zoom operations
 */
export type ZoomDirection = 'in' | 'out';

/**
 * Zoom constraint constants
 */
export const ZOOM_CONSTRAINTS = {
  /** Minimum zoom level */
  MIN: 0.1,
  /** Maximum zoom level */
  MAX: 10,
  /** Default zoom level */
  DEFAULT: 1,
  /** Zoom step for incremental zooming */
  STEP: 0.1
};
