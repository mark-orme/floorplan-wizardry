
/**
 * Coordinate transformation utilities
 * Functions for converting between coordinate systems
 * @module coordinateTransforms
 */
import { Canvas as FabricCanvas } from "fabric";
import { Point } from '@/types/drawingTypes';
import { PIXELS_PER_METER } from '../drawing';
import logger from '../logger';

/**
 * Viewport transform type for Fabric.js canvas
 * @typedef {number[]} ViewportTransform
 */
type ViewportTransform = [number, number, number, number, number, number];

/**
 * Canvas with viewport transform property
 * @interface CanvasWithViewport
 * @extends FabricCanvas
 */
interface CanvasWithViewport extends FabricCanvas {
  viewportTransform: ViewportTransform;
  getZoom: () => number;
}

/**
 * Adjusts points for panning offset - ensures proper unit conversion
 * Helper for ensuring accurate point calculations when canvas is panned
 * 
 * @param {Point} point - The point to adjust (in pixels)
 * @param {FabricCanvas} canvas - The fabric canvas
 * @returns {Point} Adjusted point (in meters)
 */
export const adjustPointForPanning = (point: Point, canvas: FabricCanvas): Point => {
  if (!canvas || !(canvas as CanvasWithViewport).viewportTransform) {
    logger.warn("Cannot adjust point for panning: invalid canvas or missing viewportTransform");
    return point;
  }
  
  const canvasWithViewport = canvas as CanvasWithViewport;
  const viewportTransform = canvasWithViewport.viewportTransform;
  const zoom = canvasWithViewport.getZoom();
  
  // First apply viewport transform to get correct pixel coordinates
  const pixelPoint = {
    x: (point.x - viewportTransform[4]) / viewportTransform[0],
    y: (point.y - viewportTransform[5]) / viewportTransform[3]
  };
  
  // Then convert from pixels to meters accounting for zoom
  const result = {
    x: Number((pixelPoint.x / (PIXELS_PER_METER * zoom)).toFixed(3)),
    y: Number((pixelPoint.y / (PIXELS_PER_METER * zoom)).toFixed(3))
  };
  
  logger.debug(
    `Point adjustment: (${point.x.toFixed(1)}, ${point.y.toFixed(1)}) px → ` +
    `(${result.x.toFixed(3)}, ${result.y.toFixed(3)}) m @ zoom ${zoom.toFixed(2)}`
  );
  
  return result;
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

/**
 * Converts a point from screen coordinates to canvas coordinates
 * Takes into account panning and zooming
 * 
 * @param screenPoint - Point in screen coordinates (e.g., from mouse event)
 * @param canvas - The Fabric.js canvas
 * @returns Point in canvas coordinates
 */
export const screenToCanvasCoordinates = (screenPoint: Point, canvas: FabricCanvas): Point => {
  if (!canvas || !(canvas as CanvasWithViewport).viewportTransform) {
    logger.warn("Cannot convert screen to canvas coordinates: invalid canvas");
    return screenPoint;
  }
  
  const canvasElement = canvas.getElement() as HTMLCanvasElement;
  const rect = canvasElement.getBoundingClientRect();
  const canvasWithViewport = canvas as CanvasWithViewport;
  const zoom = canvasWithViewport.getZoom();
  
  return {
    x: (screenPoint.x - rect.left) / zoom,
    y: (screenPoint.y - rect.top) / zoom
  };
};
