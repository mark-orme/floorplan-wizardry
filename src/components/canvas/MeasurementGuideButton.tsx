
import React from 'react';
import { Button } from '@/components/ui/button';
import { HiOutlineScale } from 'react-icons/hi';

interface MeasurementGuideButtonProps {
  onClick: () => void;
}

export const MeasurementGuideButton: React.FC<MeasurementGuideButtonProps> = ({ onClick }) => {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      className="absolute top-4 right-4 gap-2 bg-white shadow-sm hover:bg-gray-50 z-10 transition-all duration-200"
    >
      <HiOutlineScale className="h-4 w-4" />
      <span className="hidden sm:inline">Measurement Guide</span>
    </Button>
  );
};
