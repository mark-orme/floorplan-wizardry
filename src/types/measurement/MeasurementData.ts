
/**
 * Comprehensive measurement data interface for line tools and other components
 */

import { Point } from '../core/Point';

/**
 * MeasurementData interface with all possible properties to ensure compatibility
 * across different components that use measurement data
 */
export interface MeasurementData {
  // Basic measurements
  distance: number | null;
  angle: number | null;
  
  // Both naming conventions for points
  startPoint?: Point | null;
  endPoint?: Point | null;
  start?: Point | null;
  end?: Point | null;
  
  // Additional properties
  midPoint?: Point | null;
  unit?: string;
  snapped?: boolean;
  snapType?: 'grid' | 'angle' | 'both';
  pixelsPerMeter?: number;
}

/**
 * Create an empty measurement data object
 */
export function createEmptyMeasurementData(): MeasurementData {
  return {
    distance: null,
    angle: null,
    unit: 'px'
  };
}

/**
 * Create a full measurement data object with all properties
 */
export function createMeasurementData(
  startPoint: Point,
  endPoint: Point,
  distance: number,
  angle: number,
  options: Partial<MeasurementData> = {}
): MeasurementData {
  return {
    distance,
    angle,
    startPoint,
    endPoint,
    start: startPoint,  // Include both naming conventions
    end: endPoint,      // Include both naming conventions
    midPoint: options.midPoint || getMidPoint(startPoint, endPoint),
    unit: options.unit || 'px',
    snapped: options.snapped || false,
    snapType: options.snapType,
    pixelsPerMeter: options.pixelsPerMeter || 100
  };
}

/**
 * Get the midpoint between two points
 */
function getMidPoint(point1: Point, point2: Point): Point {
  return {
    x: (point1.x + point2.x) / 2,
    y: (point1.y + point2.y) / 2
  };
}

/**
 * Normalize measurement data to ensure it has both naming conventions
 */
export function normalizeMeasurementData(data: Partial<MeasurementData>): MeasurementData {
  const result: MeasurementData = {
    distance: data.distance ?? null,
    angle: data.angle ?? null,
    unit: data.unit ?? 'px',
    snapped: data.snapped ?? false
  };
  
  // Ensure both naming conventions are available
  if (data.startPoint) {
    result.startPoint = data.startPoint;
    result.start = data.startPoint;
  } else if (data.start) {
    result.start = data.start;
    result.startPoint = data.start;
  }
  
  if (data.endPoint) {
    result.endPoint = data.endPoint;
    result.end = data.endPoint;
  } else if (data.end) {
    result.end = data.end;
    result.endPoint = data.end;
  }
  
  // Copy any other properties
  if (data.midPoint) result.midPoint = data.midPoint;
  if (data.pixelsPerMeter) result.pixelsPerMeter = data.pixelsPerMeter;
  if (data.snapType) result.snapType = data.snapType;
  
  return result;
}
