
/**
 * Utility functions to convert between our app Point type and Fabric.js Point objects
 * This helps prevent type conversion errors between similar but incompatible types
 * 
 * @module utils/fabricPointConverter
 */
import { Point as FabricPoint } from "fabric";
import type { Point } from "@/types/core/Point";

/**
 * Converts our application Point type to a Fabric.js Point
 * 
 * @param {Point} point - Our application point object with x and y properties
 * @returns {FabricPoint} A Fabric.js Point instance
 */
export const toFabricPoint = (point: Point): FabricPoint => {
  if (!point) {
    throw new Error("Cannot convert null or undefined to FabricPoint");
  }
  return new FabricPoint(point.x, point.y);
};

/**
 * Converts a Fabric.js Point to our application Point type
 * 
 * @param {FabricPoint} fabricPoint - Fabric.js Point instance
 * @returns {Point} Our application point object with x and y properties
 */
export const toAppPoint = (fabricPoint: FabricPoint): Point => {
  if (!fabricPoint) {
    throw new Error("Cannot convert null or undefined to app Point");
  }
  return { x: fabricPoint.x, y: fabricPoint.y };
};

/**
 * Safely gets coordinates from an event, handling different event types
 * 
 * @param {any} event - Mouse or pointer event
 * @returns {Point} Object with x and y coordinates
 */
export const getPointFromEvent = (event: any): Point => {
  if (!event) {
    throw new Error("Cannot extract point from null or undefined event");
  }
  
  // Handle different event types
  if (event.clientX !== undefined && event.clientY !== undefined) {
    return { x: event.clientX, y: event.clientY };
  } else if (event.e && event.e.clientX !== undefined && event.e.clientY !== undefined) {
    return { x: event.e.clientX, y: event.e.clientY };
  } else if (event.x !== undefined && event.y !== undefined) {
    return { x: event.x, y: event.y };
  }
  
  throw new Error("Could not extract point coordinates from event");
};

/**
 * Checks if the given object conforms to our Point interface
 * 
 * @param {any} obj - Object to check
 * @returns {boolean} True if the object has numeric x and y properties
 */
export const isAppPoint = (obj: any): obj is Point => {
  return obj && 
    typeof obj === 'object' && 
    typeof obj.x === 'number' && 
    typeof obj.y === 'number';
};
