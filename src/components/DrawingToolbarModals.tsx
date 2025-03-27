
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MeasurementGuideModal } from "./MeasurementGuideModal";
import { HelpCircle, Ruler } from "lucide-react";
import { useMeasurementGuide } from "@/hooks/useMeasurementGuide";

export const DrawingToolbarModals = () => {
  const { 
    showMeasurementGuide, 
    setShowMeasurementGuide, 
    handleCloseMeasurementGuide 
  } = useMeasurementGuide();

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 relative flex items-center justify-center"
        onClick={() => setShowMeasurementGuide(true)}
        title="Measurement Guide"
      >
        <Ruler className="h-4 w-4" />
        <span className="sr-only">Measurement Guide</span>
      </Button>

      <MeasurementGuideModal 
        open={showMeasurementGuide} 
        onOpenChange={(open) => {
          if (!open) {
            handleCloseMeasurementGuide(false);
          } else {
            setShowMeasurementGuide(true);
          }
        }} 
      />
    </>
  );
};
