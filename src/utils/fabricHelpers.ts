
/**
 * Fabric.js helper utilities
 * @module fabricHelpers
 */
import { Object as FabricObject, Point as FabricPoint } from "fabric";
import { Point } from "@/types/drawingTypes";
import { 
  PIXELS_PER_METER, 
  DEFAULT_LINE_THICKNESS 
} from "@/constants/numerics";
import { snapToAngle } from "@/utils/grid/snapping";

/**
 * Convert point from pixels to meters
 * @param {Point} point - Point in pixels
 * @returns {Point} Point in meters
 */
export const pixelsToMeters = (point: Point): Point => {
  return {
    x: point.x / PIXELS_PER_METER,
    y: point.y / PIXELS_PER_METER
  };
};

/**
 * Convert point from meters to pixels
 * @param {Point} point - Point in meters
 * @returns {Point} Point in pixels
 */
export const metersToPixels = (point: Point): Point => {
  return {
    x: point.x * PIXELS_PER_METER,
    y: point.y * PIXELS_PER_METER
  };
};

/**
 * Convert Fabric.js point to our Point type
 * @param {FabricPoint} fabricPoint - Fabric.js point
 * @returns {Point} Simple point object
 */
export const fromFabricPoint = (fabricPoint: FabricPoint): Point => {
  return { x: fabricPoint.x, y: fabricPoint.y };
};

/**
 * Create Fabric.js point from our Point type
 * @param {Point} point - Simple point object
 * @returns {FabricPoint} Fabric.js point
 */
export const toFabricPoint = (point: Point): FabricPoint => {
  return new FabricPoint(point.x, point.y);
};

/**
 * Get object center as Point
 * @param {FabricObject} obj - Fabric.js object
 * @returns {Point} Center point
 */
export const getObjectCenter = (obj: FabricObject): Point => {
  return { x: obj.left! + obj.width! / 2, y: obj.top! + obj.height! / 2 };
};

/**
 * Create default object options
 * @returns {Object} Default fabric object options
 */
export const getDefaultObjectOptions = () => {
  return {
    strokeWidth: DEFAULT_LINE_THICKNESS,
    stroke: "#000000",
    fill: "transparent",
    selectable: true,
    hasControls: true,
    hasBorders: true,
    lockMovementX: false,
    lockMovementY: false,
    evented: true
  };
};

