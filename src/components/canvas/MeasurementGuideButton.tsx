
import React from 'react';
import { Button } from "@/components/ui/button";
import { Ruler } from "lucide-react";

interface MeasurementGuideButtonProps {
  onClick: () => void;
}

export const MeasurementGuideButton: React.FC<MeasurementGuideButtonProps> = ({ onClick }) => {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      className="absolute top-4 right-4 gap-2 bg-white shadow-sm hover:bg-gray-50"
    >
      <Ruler className="h-4 w-4" />
      <span>Measurement Guide</span>
    </Button>
  );
};
