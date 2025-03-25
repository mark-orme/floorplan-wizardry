
/**
 * Midpoint calculation utilities
 * @module midpointCalculation
 */
import { Point } from "@/types/drawingTypes";

/**
 * Calculate the midpoint between two points
 * @param {Point} p1 - First point
 * @param {Point} p2 - Second point
 * @returns {Point} The midpoint between p1 and p2
 */
export const calculateMidpoint = (p1: Point, p2: Point): Point => {
  return {
    x: (p1.x + p2.x) / 2,
    y: (p1.y + p2.y) / 2
  };
};
