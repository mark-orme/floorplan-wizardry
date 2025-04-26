
/**
 * Straight line validation utilities
 * Used for validating straight line tool functionality
 * @module utils/diagnostics/straightLineValidator
 */
import { Canvas, Line, Point } from 'fabric';
import { Point as CorePoint } from '@/types/core/Point';

interface LineValidationOptions {
  minLength: number;
  maxLength: number;
  validColors: string[];
}

interface LineValidationResult {
  valid: boolean;
  issues: string[];
  metrics: {
    length: number;
    angle: number;
    color: string;
    strokeWidth: number;
  };
}

interface LineMetrics {
  length: number;
  angle: number;
}

/**
 * Validate a line against specified options
 * @param line The line to validate
 * @param options Validation options
 * @returns Validation result
 */
export const validateLine = (
  line: Line,
  options: LineValidationOptions
): LineValidationResult => {
  const issues: string[] = [];
  
  // Extract line metrics
  const metrics = getLineMetrics(line);
  const color = line.stroke?.toString() || '';
  const strokeWidth = line.strokeWidth || 1;
  
  // Check length
  if (metrics.length < options.minLength) {
    issues.push(`Line too short: ${metrics.length.toFixed(2)}px (min: ${options.minLength}px)`);
  }
  
  if (metrics.length > options.maxLength) {
    issues.push(`Line too long: ${metrics.length.toFixed(2)}px (max: ${options.maxLength}px)`);
  }
  
  // Check color
  if (options.validColors.length > 0 && !options.validColors.includes(color)) {
    issues.push(`Invalid color: ${color} (valid: ${options.validColors.join(', ')})`);
  }
  
  return {
    valid: issues.length === 0,
    issues,
    metrics: {
      length: metrics.length,
      angle: metrics.angle,
      color,
      strokeWidth
    }
  };
};

/**
 * Calculate line metrics (length and angle)
 * @param line The line to measure
 * @returns Line metrics
 */
export const getLineMetrics = (line: Line): LineMetrics => {
  // Extract coordinates
  const coords = line.calcLinePoints?.() || { x1: 0, y1: 0, x2: 0, y2: 0 };
  
  // Calculate length using Pythagorean theorem
  const dx = coords.x2 - coords.x1;
  const dy = coords.y2 - coords.y1;
  const length = Math.sqrt(dx * dx + dy * dy);
  
  // Calculate angle
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);
  
  return { length, angle };
};

/**
 * Convert Fabric Point to our internal Point type
 * @param point Fabric point
 * @returns Internal point
 */
export const fabricPointToPoint = (point: Point): CorePoint => {
  return { x: point.x, y: point.y };
};

/**
 * Find all lines on a canvas
 * @param canvas The Fabric canvas
 * @returns Array of lines found
 */
export const findAllLines = (canvas: Canvas): Line[] => {
  return canvas.getObjects().filter(obj => obj instanceof Line) as Line[];
};

/**
 * Validate all lines on a canvas
 * @param canvas The Fabric canvas
 * @param options Validation options
 * @returns Validation results for each line
 */
export const validateAllLines = (
  canvas: Canvas,
  options: LineValidationOptions
): Record<string, LineValidationResult> => {
  const lines = findAllLines(canvas);
  const results: Record<string, LineValidationResult> = {};
  
  lines.forEach((line, index) => {
    const id = line.id?.toString() || `line-${index}`;
    results[id] = validateLine(line, options);
  });
  
  return results;
};
