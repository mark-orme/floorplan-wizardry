
/**
 * Interface representing measurement data for displaying distance and angle
 */
export interface MeasurementData {
  /**
   * Distance in pixels or meters
   */
  distance: number;
  
  /**
   * Angle in degrees
   */
  angle: number;
  
  /**
   * Whether the measurement is snapped to grid
   */
  snapped: boolean;
  
  /**
   * Unit of measurement (px, m, etc.)
   */
  unit: string;
}
