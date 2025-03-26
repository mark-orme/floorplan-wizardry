
import { useState, useCallback } from 'react';

/**
 * Hook for managing the measurement guide modal
 * @returns Measurement guide state and handlers
 */
export const useMeasurementGuide = () => {
  const [showMeasurementGuide, setShowMeasurementGuide] = useState(false);
  
  // Handle closing the measurement guide
  const handleCloseMeasurementGuide = useCallback((dontShowAgain: boolean) => {
    setShowMeasurementGuide(false);
    
    if (dontShowAgain) {
      localStorage.setItem('dontShowMeasurementGuide', 'true');
    }
  }, []);
  
  // Open measurement guide
  const openMeasurementGuide = useCallback(() => {
    setShowMeasurementGuide(true);
  }, []);
  
  return {
    showMeasurementGuide,
    setShowMeasurementGuide,
    handleCloseMeasurementGuide,
    openMeasurementGuide
  };
};
