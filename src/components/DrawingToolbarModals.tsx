
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MeasurementGuideModal } from "./MeasurementGuideModal";
import { HelpCircle } from "lucide-react";

export const DrawingToolbarModals = () => {
  const [showMeasurementGuide, setShowMeasurementGuide] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        onClick={() => setShowMeasurementGuide(true)}
      >
        <HelpCircle className="h-4 w-4" />
        <span className="sr-only">Measurement Guide</span>
      </Button>

      <MeasurementGuideModal 
        open={showMeasurementGuide} 
        onOpenChange={setShowMeasurementGuide} 
      />
    </>
  );
};
