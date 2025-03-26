
/**
 * Coordinate transformation utilities module
 * Functions for transforming between coordinate systems
 * @module geometry/coordinateTransforms
 */
import { Point } from '@/types/drawingTypes';
import { PIXELS_PER_METER } from './constants';

/**
 * Convert canvas pixel coordinates to real-world meters
 * @param {Point} point - Point in pixel coordinates
 * @returns {Point} Point in meter coordinates
 */
export const pixelsToMeters = (point: Point): Point => {
  if (!point) return { x: 0, y: 0 };
  
  return {
    x: point.x / PIXELS_PER_METER,
    y: point.y / PIXELS_PER_METER
  };
};

/**
 * Convert real-world meter coordinates to canvas pixels
 * @param {Point} point - Point in meter coordinates
 * @returns {Point} Point in pixel coordinates
 */
export const metersToPixels = (point: Point): Point => {
  if (!point) return { x: 0, y: 0 };
  
  return {
    x: point.x * PIXELS_PER_METER,
    y: point.y * PIXELS_PER_METER
  };
};

/**
 * Convert point from screen to canvas coordinates
 * Accounts for canvas offset and scaling
 * @param {Point} point - Point in screen coordinates
 * @param {HTMLCanvasElement} canvas - Canvas element
 * @param {number} zoom - Current zoom level
 * @returns {Point} Point in canvas coordinates
 */
export const screenToCanvasCoordinates = (
  point: Point,
  canvas: HTMLCanvasElement,
  zoom: number = 1
): Point => {
  if (!point || !canvas) return { x: 0, y: 0 };
  
  const rect = canvas.getBoundingClientRect();
  
  return {
    x: (point.x - rect.left) / zoom,
    y: (point.y - rect.top) / zoom
  };
};

/**
 * Convert point from canvas to screen coordinates
 * Accounts for canvas offset and scaling
 * @param {Point} point - Point in canvas coordinates
 * @param {HTMLCanvasElement} canvas - Canvas element
 * @param {number} zoom - Current zoom level
 * @returns {Point} Point in screen coordinates
 */
export const canvasToScreenCoordinates = (
  point: Point,
  canvas: HTMLCanvasElement,
  zoom: number = 1
): Point => {
  if (!point || !canvas) return { x: 0, y: 0 };
  
  const rect = canvas.getBoundingClientRect();
  
  return {
    x: point.x * zoom + rect.left,
    y: point.y * zoom + rect.top
  };
};

/**
 * Apply zoom transformation to a point
 * Zooms relative to a specified center point
 * @param {Point} point - Point to transform
 * @param {Point} center - Center point of zoom
 * @param {number} scale - Zoom scale factor
 * @returns {Point} Transformed point
 */
export const applyZoomTransform = (
  point: Point,
  center: Point,
  scale: number
): Point => {
  if (!point || !center) return { x: 0, y: 0 };
  
  return {
    x: center.x + (point.x - center.x) * scale,
    y: center.y + (point.y - center.y) * scale
  };
};
