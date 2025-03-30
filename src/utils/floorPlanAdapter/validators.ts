
/**
 * Floor Plan Adapter Validators
 * Validation utilities for floor plan data
 * @module utils/floorPlanAdapter/validators
 */
import { Point } from '@/types/core/Point';
import { createPoint } from '@/types/core/Point';

/**
 * Validate and ensure a point object is properly formed
 * @param point The point to validate or coordinates to create a point
 * @returns A valid Point object
 */
export function validatePoint(point: Point | undefined | null): Point {
  if (!point) {
    return createPoint(0, 0);
  }
  
  // Ensure x and y are numbers
  const x = typeof point.x === 'number' ? point.x : 0;
  const y = typeof point.y === 'number' ? point.y : 0;
  
  return { x, y };
}

/**
 * Validate a metadata object's timestamps
 * @param timestamp The timestamp to validate
 * @returns A valid timestamp string
 */
export function validateTimestamp(timestamp: string | Date | undefined | null): string {
  if (!timestamp) {
    return new Date().toISOString();
  }
  
  if (typeof timestamp === 'string') {
    return timestamp;
  }
  
  if (timestamp instanceof Date) {
    return timestamp.toISOString();
  }
  
  return new Date().toISOString();
}

/**
 * Validate and normalize a color string
 * @param color The color string to validate
 * @param defaultColor Default color to use if invalid
 * @returns A valid color string
 */
export function validateColor(color: string | undefined | null, defaultColor: string = '#000000'): string {
  if (!color || typeof color !== 'string') {
    return defaultColor;
  }
  
  // Simple validation: ensure it's a non-empty string
  return color.trim() || defaultColor;
}
