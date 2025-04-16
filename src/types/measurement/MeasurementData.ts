
/**
 * Measurement data interface
 * Represents measurements for lines and geometric shapes
 */
export interface MeasurementData {
  /** Distance in pixels or specified unit */
  distance: number | null;
  
  /** Angle in degrees */
  angle: number | null;
  
  /** Whether the point is snapped to a reference */
  snapped?: boolean;
  
  /** Measurement unit (px, cm, m, etc.) */
  unit: string;
}
