
import { Point } from "@/types/core/Point";
import { createPoint } from "../pointHelpers";

// Validations for point data
export const isValidPoint = (point: any): boolean => {
  if (!point || typeof point !== 'object') return false;
  if (typeof point.x !== 'number' || typeof point.y !== 'number') return false;
  return true;
};

// Create default point if invalid
export const ensureValidPoint = (point: any): Point => {
  if (isValidPoint(point)) return point;
  return createPoint(0, 0);
};

// Additional validation functions can be added here as needed
