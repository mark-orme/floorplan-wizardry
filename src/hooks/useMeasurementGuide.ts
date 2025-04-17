
import { useState, useCallback, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

export const useMeasurementGuide = () => {
  const [showMeasurementGuide, setShowMeasurementGuide] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useLocalStorage('dontShowMeasurementGuide', false);
  
  // Check if it's first visit on mount
  useEffect(() => {
    if (!dontShowAgain && !localStorage.getItem('hasSeenMeasurementGuide')) {
      setShowMeasurementGuide(true);
      localStorage.setItem('hasSeenMeasurementGuide', 'true');
    }
  }, [dontShowAgain]);

  const handleCloseMeasurementGuide = useCallback((dontShow: boolean) => {
    setShowMeasurementGuide(false);
    if (dontShow) {
      setDontShowAgain(true);
    }
  }, [setDontShowAgain]);

  const openMeasurementGuide = useCallback(() => {
    setShowMeasurementGuide(true);
  }, []);

  return {
    showMeasurementGuide,
    setShowMeasurementGuide,
    handleCloseMeasurementGuide,
    openMeasurementGuide,
    dontShowAgain
  };
};
