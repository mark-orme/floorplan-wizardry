
/**
 * Interface for measurement data displayed during drawing
 */
export interface MeasurementData {
  /** Distance measurement */
  distance: number | null;
  
  /** Angle measurement in degrees */
  angle: number | null;
  
  /** Measurement unit */
  unit: 'px' | 'm' | 'cm' | 'mm';
  
  /** Whether the point was snapped to a grid or guide */
  snapped?: boolean;
}
