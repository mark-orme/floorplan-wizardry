
/**
 * Utility functions for converting between fabric points and app points
 * @module utils/fabricPointConverter
 */
import { Point } from "fabric/fabric-impl";
import type { Point as AppPoint } from "@/types/core/Point";

/**
 * Convert a fabric point to an app point
 * @param fabricPoint - Fabric point
 * @returns App point
 */
export const toAppPoint = (fabricPoint: Point): AppPoint => {
  return {
    x: fabricPoint.x,
    y: fabricPoint.y
  };
};

/**
 * Get a point from a mouse event
 * @param event - Mouse event
 * @param canvas - Fabric canvas
 * @returns App point
 */
export const getPointFromEvent = (event: MouseEvent, canvas: any): AppPoint => {
  const pointer = canvas.getPointer(event);
  return {
    x: pointer.x,
    y: pointer.y
  };
};

/**
 * Check if a value is an app point
 * @param value - Value to check
 * @returns Whether the value is an app point
 */
export const isAppPoint = (value: any): value is AppPoint => {
  return (
    value !== null &&
    typeof value === 'object' &&
    'x' in value &&
    'y' in value &&
    typeof value.x === 'number' &&
    typeof value.y === 'number'
  );
};

/**
 * Convert app point to fabric point
 * @param appPoint - App point
 * @returns Fabric point
 */
export const toFabricPoint = (appPoint: AppPoint): Point => {
  return new Point(appPoint.x, appPoint.y);
};
