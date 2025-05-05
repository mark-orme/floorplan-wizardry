/**
 * Utility for adapting between different measurement data formats
 */
import { MeasurementData } from '@/types/fabric-unified';
import { Point } from '@/types/core/Point';

/**
 * Legacy measurement data type with start/end instead of startPoint/endPoint
 */
export interface LegacyMeasurementData {
  distance: number;
  start: Point | null;
  end: Point | null;
  midPoint?: Point | null;
  angle?: number;
  unit?: 'px' | 'm' | 'cm' | 'mm';
  snapped?: boolean;
  pixelsPerMeter?: number;
}

/**
 * Check if measurement data is in legacy format
 * @param data The measurement data to check
 * @returns True if the data is in legacy format
 */
export function isLegacyMeasurementData(data: any): data is LegacyMeasurementData {
  return data && ('start' in data || 'end' in data);
}

/**
 * Convert legacy measurement data to current format
 * @param data The legacy measurement data
 * @returns Converted measurement data
 */
export function convertLegacyMeasurementData(data: LegacyMeasurementData): MeasurementData {
  return {
    distance: data.distance,
    startPoint: data.start,
    endPoint: data.end,
    midPoint: data.midPoint || null,
    angle: data.angle || 0,
    unit: data.unit || 'px',
    snapped: data.snapped,
    pixelsPerMeter: data.pixelsPerMeter || 100,
    // Keep legacy properties for backward compatibility
    start: data.start,
    end: data.end
  };
}

/**
 * Convert current measurement data to legacy format
 * @param data The current measurement data
 * @returns Legacy format measurement data
 */
export function convertToLegacyMeasurementData(data: MeasurementData): LegacyMeasurementData {
  return {
    distance: data.distance,
    start: data.startPoint || data.start,
    end: data.endPoint || data.end,
    midPoint: data.midPoint,
    angle: data.angle,
    unit: data.unit,
    snapped: data.snapped,
    pixelsPerMeter: data.pixelsPerMeter
  };
}

/**
 * Get a measurement data object that works with both legacy and current code
 * @param data The measurement data (either format)
 * @returns Measurement data with all properties populated
 */
export function getAdaptedMeasurementData(data: MeasurementData | LegacyMeasurementData | null): MeasurementData | null {
  if (!data) return null;
  
  if (isLegacyMeasurementData(data)) {
    return convertLegacyMeasurementData(data);
  }
  
  // If current data is missing legacy properties, add them
  if (!('start' in data) || !('end' in data)) {
    return {
      ...data,
      start: data.startPoint, 
      end: data.endPoint
    };
  }
  
  return data;
}
