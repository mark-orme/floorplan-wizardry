
/**
 * Utility functions for converting between fabric points and app points
 * @module utils/fabricPointConverter
 */
import { Point as FabricPoint } from "fabric";
import type { Point as AppPoint } from "@/types/core/Point";
import { createPoint } from "@/types/core/Point";

/**
 * Convert a fabric point to an app point
 * @param fabricPoint - Fabric point
 * @returns App point
 */
export const toAppPoint = (fabricPoint: FabricPoint | {x: number, y: number}): AppPoint => {
  return {
    x: fabricPoint.x,
    y: fabricPoint.y
  };
};

/**
 * Alias for toAppPoint for backward compatibility
 * @param fabricPoint - Fabric point
 * @returns App point
 */
export const fromFabricPoint = toAppPoint;

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
export const toFabricPoint = (appPoint: AppPoint): FabricPoint => {
  return new FabricPoint(appPoint.x, appPoint.y);
};

/**
 * Create a new fabric point
 * @param x - X coordinate
 * @param y - Y coordinate
 * @returns Fabric point
 */
export const createFabricPoint = (x: number, y: number): FabricPoint => {
  return new FabricPoint(x, y);
};
