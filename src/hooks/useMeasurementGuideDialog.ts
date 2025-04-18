
import { useState, useCallback } from 'react';

export const useMeasurementGuideDialog = () => {
  const [isOpen, setIsOpen] = useState(false);

  const openMeasurementGuide = useCallback(() => {
    setIsOpen(true);
  }, []);

  const handleOpenChange = useCallback((open: boolean) => {
    setIsOpen(open);
  }, []);

  return {
    isOpen,
    openMeasurementGuide,
    handleOpenChange
  };
};
