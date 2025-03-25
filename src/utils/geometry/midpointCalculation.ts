
/**
 * Utilities for calculating midpoints and related geometric operations
 * @module midpointCalculation
 */
import { Point } from "@/types/drawingTypes";

/**
 * Calculate the midpoint between two points
 * 
 * @param {Point} start - The starting point
 * @param {Point} end - The ending point
 * @returns {Point} The midpoint
 */
export const calculateMidpoint = (start: Point, end: Point): Point => {
  return {
    x: start.x + (end.x - start.x) / 2,
    y: start.y + (end.y - start.y) / 2
  };
};
