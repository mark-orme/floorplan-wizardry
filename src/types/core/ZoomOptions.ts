
/**
 * Zoom functionality types
 * Provides types for zoom operations and options
 * @module types/core/ZoomOptions
 */

import { Point } from './Point';

/**
 * Zoom options interface
 */
export interface ZoomOptions {
  /** Zoom level */
  level: number;
  /** Zoom center X coordinate */
  centerX?: number;
  /** Zoom center Y coordinate */
  centerY?: number;
  /** Zoom center point */
  center?: Point;
  /** Whether to skip rendering */
  skipRender?: boolean;
  /** Animation duration in ms */
  duration?: number;
  /** Animation easing function */
  easing?: (t: number) => number;
}

/**
 * Zoom level constants
 */
export const ZOOM_CONSTANTS = {
  /** Default zoom level */
  DEFAULT_ZOOM: 1,
  /** Minimum zoom level */
  MIN_ZOOM: 0.1,
  /** Maximum zoom level */
  MAX_ZOOM: 5,
  /** Zoom step for zoom in/out operations */
  ZOOM_STEP: 0.1
};

/**
 * Zoom direction enum
 */
export enum ZoomDirection {
  /** Zoom in */
  IN = 'in',
  /** Zoom out */
  OUT = 'out'
}

/**
 * Create default zoom options
 */
export function createDefaultZoomOptions(): ZoomOptions {
  return {
    level: ZOOM_CONSTANTS.DEFAULT_ZOOM,
    skipRender: false
  };
}
