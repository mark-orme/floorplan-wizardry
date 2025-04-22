
import { Point } from '@/types/core/Point';

export const useMeasurementCalculation = () => {
  /**
   * Calculate distance and angle between two points
   */
  const calculateMeasurements = (startPoint: Point, endPoint: Point) => {
    // Calculate distance using Pythagorean theorem
    const dx = endPoint.x - startPoint.x;
    const dy = endPoint.y - startPoint.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Calculate angle in degrees
    let angle = Math.atan2(dy, dx) * (180 / Math.PI);
    if (angle < 0) angle += 360; // Convert to 0-360 range
    
    return { distance, angle };
  };

  // Alias for backward compatibility
  const calculateMeasurement = calculateMeasurements;
  
  return {
    calculateMeasurements,
    calculateMeasurement
  };
};
