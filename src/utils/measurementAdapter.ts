
/**
 * Utility for adapting between different measurement data formats
 */
import { Point } from '@/types/core/Point';

export interface MeasurementData {
  distance: number | null;
  angle: number | null;
  startPoint?: Point | null;
  endPoint?: Point | null;
  start?: Point | null;
  end?: Point | null;
  midPoint?: Point | null;
  unit?: string;
  snapped?: boolean;
  snapType?: 'grid' | 'angle' | 'both';
  pixelsPerMeter?: number;
}

/**
 * Normalize measurement data to ensure it has both start/end and startPoint/endPoint
 * This helps with backward compatibility between different code patterns
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

/**
 * Check if the measurement data is complete
 */
export function isCompleteMeasurementData(data: Partial<MeasurementData>): boolean {
  return !!(
    data && 
    ((data.startPoint || data.start) && (data.endPoint || data.end)) && 
    typeof data.distance === 'number'
  );
}

export default { normalizeMeasurementData, isCompleteMeasurementData };
