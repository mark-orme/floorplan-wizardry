
/**
 * Line diagnostics utilities
 * @module hooks/straightLineTool/lineDiagnostics
 */
import { Line } from 'fabric';
import { Point } from '@/types/core/Point';

/**
 * Check if a line has valid coordinates
 * @param line Line to check
 * @returns Whether the line has valid coordinates
 */
export function hasValidCoordinates(line: Line | null): boolean {
  if (!line) return false;
  
  // Check if coordinates are numbers and not NaN
  return (
    typeof line.x1 === 'number' &&
    typeof line.y1 === 'number' &&
    typeof line.x2 === 'number' &&
    typeof line.y2 === 'number' &&
    !isNaN(line.x1) &&
    !isNaN(line.y1) &&
    !isNaN(line.x2) &&
    !isNaN(line.y2)
  );
}

/**
 * Calculate line length
 * @param start Start point
 * @param end End point
 * @returns Line length
 */
export function calculateLineLength(start: Point, end: Point): number {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Calculate line angle in degrees
 * @param start Start point
 * @param end End point
 * @returns Line angle in degrees
 */
export function calculateLineAngle(start: Point, end: Point): number {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  
  return Math.atan2(dy, dx) * (180 / Math.PI);
}

/**
 * Check if line is too short to be useful
 * @param start Start point
 * @param end End point
 * @param minLength Minimum useful length
 * @returns Whether the line is too short
 */
export function isLineTooShort(
  start: Point,
  end: Point,
  minLength: number = 5
): boolean {
  return calculateLineLength(start, end) < minLength;
}
