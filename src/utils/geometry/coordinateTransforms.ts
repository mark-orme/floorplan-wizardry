
/**
 * Coordinate transformation utilities
 * Functions for converting between coordinate systems
 * @module coordinateTransforms
 */
import { Point } from '@/types/drawingTypes';
import { PIXELS_PER_METER } from '../drawing';

/**
 * Adjusts points for panning offset - ensures proper unit conversion
 * Helper for ensuring accurate point calculations when canvas is panned
 * @param {Point} point - The point to adjust (in pixels)
 * @param {Canvas} canvas - The fabric canvas
 * @returns {Point} Adjusted point (in meters)
 */
export const adjustPointForPanning = (point: Point, canvas: any): Point => {
  if (!canvas || !canvas.viewportTransform) return point;
  
  const viewportTransform = canvas.viewportTransform;
  const zoom = canvas.getZoom();
  
  // First apply viewport transform to get correct pixel coordinates
  const pixelPoint = {
    x: (point.x - viewportTransform[4]) / viewportTransform[0],
    y: (point.y - viewportTransform[5]) / viewportTransform[3]
  };
  
  // Then convert from pixels to meters accounting for zoom
  return {
    x: Number((pixelPoint.x / (PIXELS_PER_METER * zoom)).toFixed(3)),
    y: Number((pixelPoint.y / (PIXELS_PER_METER * zoom)).toFixed(3))
  };
};

/**
 * Convert pixel coordinates to meter coordinates
 * Critical for ensuring proper handling of zoom level in unit conversions
 * 
 * @param pixelPoint - Point in pixel coordinates
 * @param zoom - Current zoom level
 * @returns Point in meter coordinates
 */
export const pixelsToMeters = (pixelPoint: Point, zoom: number = 1): Point => {
  return {
    x: Number((pixelPoint.x / (PIXELS_PER_METER * zoom)).toFixed(3)),
    y: Number((pixelPoint.y / (PIXELS_PER_METER * zoom)).toFixed(3))
  };
};

/**
 * Convert meter coordinates to pixel coordinates
 * Critical for ensuring proper handling of zoom level in unit conversions
 * 
 * @param meterPoint - Point in meter coordinates
 * @param zoom - Current zoom level
 * @returns Point in pixel coordinates
 */
export const metersToPixels = (meterPoint: Point, zoom: number = 1): Point => {
  return {
    x: Number((meterPoint.x * PIXELS_PER_METER * zoom).toFixed(0)),
    y: Number((meterPoint.y * PIXELS_PER_METER * zoom).toFixed(0))
  };
};
