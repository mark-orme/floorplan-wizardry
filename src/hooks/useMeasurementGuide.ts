
import { useState, useCallback } from 'react';

/**
 * Hook for managing the measurement guide modal
 * @returns {Object} Measurement guide state and handler functions
 */
export const useMeasurementGuide = () => {
  /**
   * State for controlling measurement guide visibility
   */
  const [showMeasurementGuide, setShowMeasurementGuide] = useState(false);
  
  /**
   * Handles closing the measurement guide
   * @param {boolean} dontShowAgain - If true, stores preference in localStorage
   */
  const handleCloseMeasurementGuide = useCallback((dontShowAgain: boolean) => {
    setShowMeasurementGuide(false);
    
    if (dontShowAgain) {
      localStorage.setItem('dontShowMeasurementGuide', 'true');
    }
  }, []);
  
  /**
   * Opens the measurement guide modal
   */
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
