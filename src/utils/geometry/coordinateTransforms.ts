
/**
 * Coordinate transformation utilities
 * @module utils/geometry/coordinateTransforms
 */
import { Point } from '@/types/geometryTypes';
import { PIXELS_PER_METER, GRID_SPACING } from '@/constants/numerics';

/**
 * Convert pixels to meters
 * @param pixels Value in pixels
 * @returns Value in meters
 */
export const pixelsToMeters = (pixels: number): number => {
  return pixels / PIXELS_PER_METER;
};

/**
 * Convert meters to pixels
 * @param meters Value in meters
 * @returns Value in pixels
 */
export const metersToPixels = (meters: number): number => {
  return meters * PIXELS_PER_METER;
};

/**
 * Convert a point from pixel coordinates to meter coordinates
 * @param point Point in pixel coordinates
 * @returns Point in meter coordinates
 */
export const pixelPointToMeterPoint = (point: Point): Point => {
  return {
    x: pixelsToMeters(point.x),
    y: pixelsToMeters(point.y)
  };
};

/**
 * Convert a point from meter coordinates to pixel coordinates
 * @param point Point in meter coordinates
 * @returns Point in pixel coordinates
 */
export const meterPointToPixelPoint = (point: Point): Point => {
  return {
    x: metersToPixels(point.x),
    y: metersToPixels(point.y)
  };
};

/**
 * Convert pixels to grid units
 * @param pixels Value in pixels
 * @returns Value in grid units
 */
export const pixelsToGridUnits = (pixels: number): number => {
  // Ensure GRID_SPACING is treated as a number
  const gridSpacing = typeof GRID_SPACING === 'number' ? GRID_SPACING : 10;
  return pixels / gridSpacing;
};

/**
 * Convert grid units to pixels
 * @param gridUnits Value in grid units
 * @returns Value in pixels
 */
export const gridUnitsToPixels = (gridUnits: number): number => {
  // Ensure GRID_SPACING is treated as a number
  const gridSpacing = typeof GRID_SPACING === 'number' ? GRID_SPACING : 10;
  return gridUnits * gridSpacing;
};

/**
 * Convert a point from pixel coordinates to grid units
 * @param point Point in pixel coordinates
 * @returns Point in grid units
 */
export const pixelPointToGridPoint = (point: Point): Point => {
  return {
    x: pixelsToGridUnits(point.x),
    y: pixelsToGridUnits(point.y)
  };
};

/**
 * Convert a point from grid units to pixel coordinates
 * @param point Point in grid units
 * @returns Point in pixel coordinates
 */
export const gridPointToPixelPoint = (point: Point): Point => {
  return {
    x: gridUnitsToPixels(point.x),
    y: gridUnitsToPixels(point.y)
  };
};
