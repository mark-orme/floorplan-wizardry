
import { useCallback, useState } from 'react';
import { Point } from '@/types/core/Point';
import { calculateDistance, calculateAngle } from '@/utils/geometry/lineOperations';

/**
 * Hook for handling measurement updates for line tools
 */
export const useMeasurementUpdates = () => {
  // Measurement data
  const [measurementData, setMeasurementData] = useState({
    distance: null as number | null,
    angle: 0,
    unit: 'm',
    snapped: false,
    snapType: undefined as 'grid' | 'angle' | 'both' | undefined
  });
  
  /**
   * Update measurement data based on points and snapping state
   */
  const updateMeasurementData = useCallback((
    start: Point,
    current: Point,
    snapEnabled: boolean,
    anglesEnabled: boolean,
    customSnapPoint?: Point
  ) => {
    if (!start) return;
    
    // Use the custom snap point if provided, otherwise use current
    const endPoint = customSnapPoint || current;
    
    // Calculate measurements
    const distance = calculateDistance(start, endPoint);
    const angle = calculateAngle(start, endPoint);
    
    // Determine snap type
    let isSnapped = false;
    let snapType: 'grid' | 'angle' | 'both' | undefined = undefined;
    
    if (customSnapPoint) {
      // If we have a custom snap point, we know it's snapped
      isSnapped = true;
      
      // Determine snap type based on enabled features
      if (snapEnabled && anglesEnabled) {
        snapType = 'both';
      } else if (snapEnabled) {
        snapType = 'grid';
      } else if (anglesEnabled) {
        snapType = 'angle';
      }
    }
    
    // Update measurement data
    setMeasurementData({
      distance,
      angle,
      unit: 'm',
      snapped: isSnapped,
      snapType
    });
  }, []);
  
  return {
    measurementData,
    setMeasurementData,
    updateMeasurementData
  };
};
