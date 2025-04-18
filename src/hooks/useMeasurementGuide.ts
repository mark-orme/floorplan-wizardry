
import { useState, useCallback, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { toast } from 'sonner';

export const useMeasurementGuide = () => {
  const [showMeasurementGuide, setShowMeasurementGuide] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useLocalStorage('dontShowMeasurementGuide', false);
  const [hasShownInitialGuide, setHasShownInitialGuide] = useLocalStorage('hasShownInitialGuide', false);

  // Enhanced first visit check
  useEffect(() => {
    if (!dontShowAgain && !hasShownInitialGuide) {
      setShowMeasurementGuide(true);
      setHasShownInitialGuide(true);
      toast.info("Welcome! Check out the measurement guide to get started.");
    }
  }, [dontShowAgain, hasShownInitialGuide, setHasShownInitialGuide]);

  const handleCloseMeasurementGuide = useCallback((dontShow: boolean) => {
    setShowMeasurementGuide(false);
    if (dontShow) {
      setDontShowAgain(true);
    }
  }, [setDontShowAgain]);

  const openMeasurementGuide = useCallback(() => {
    setShowMeasurementGuide(true);
  }, []);

  const resetGuidePreferences = useCallback(() => {
    setDontShowAgain(false);
    setHasShownInitialGuide(false);
  }, [setDontShowAgain, setHasShownInitialGuide]);

  return {
    showMeasurementGuide,
    setShowMeasurementGuide,
    handleCloseMeasurementGuide,
    openMeasurementGuide,
    dontShowAgain,
    resetGuidePreferences
  };
};
