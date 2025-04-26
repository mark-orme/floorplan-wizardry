
import { Point } from '@/types/core/Point';

/**
 * Measurement data for line tools
 */
export interface MeasurementData {
  distance: number;
  angle: number;
  snapped: boolean;
  unit: string;
  startPoint?: Point;
  endPoint?: Point;
  snapType?: 'grid' | 'angle' | 'both';
}
