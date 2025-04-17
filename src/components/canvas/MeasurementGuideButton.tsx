
import React from "react";
import { Button } from "@/components/ui/button";
import { Ruler } from "lucide-react";
import { trackUserInteraction, InteractionCategory } from "@/utils/sentry/userInteractions";

interface MeasurementGuideButtonProps {
  onClick: () => void;
}

export const MeasurementGuideButton: React.FC<MeasurementGuideButtonProps> = ({ onClick }) => {
  const handleClick = () => {
    trackUserInteraction('open_measurement_guide', InteractionCategory.TOOL);
    onClick();
  };

  return (
    <div className="flex justify-end w-full mb-2">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleClick}
        className="flex items-center gap-1 transition-all bg-white/90 hover:bg-blue-50 hover:border-blue-200 shadow-sm"
      >
        <Ruler className="h-4 w-4" />
        <span>Measurement Guide</span>
      </Button>
    </div>
  );
};
