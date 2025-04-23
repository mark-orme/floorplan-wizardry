
import { useState } from "react";
import React from 'react';
import { Button } from "@/components/ui/button";
import { MeasurementGuideModal } from "./MeasurementGuideModal";
import { Ruler } from "lucide-react";
import { useMeasurementGuide } from "@/hooks/useMeasurementGuide";
import { isIOSPlatform } from "@/utils/fabric/events";

export const DrawingToolbarModals = () => {
  const { 
    showMeasurementGuide, 
    setShowMeasurementGuide, 
    handleCloseMeasurementGuide 
  } = useMeasurementGuide();
  
  // Check if on iOS
  const isIOS = isIOSPlatform();

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className={`relative h-8 w-8 p-0 flex items-center justify-center ${isIOS ? 'touch-none' : ''}`}
        onClick={() => setShowMeasurementGuide(true)}
        title="Measurement Guide"
        aria-label="Measurement Guide"
        style={{ touchAction: isIOS ? 'none' : 'auto' }}
      >
        <Ruler className="h-4 w-4" />
        <span className="sr-only">Measurement Guide</span>
      </Button>

      <MeasurementGuideModal 
        open={showMeasurementGuide} 
        onClose={() => handleCloseMeasurementGuide(false)}
        onOpenChange={setShowMeasurementGuide}
      />
    </>
  );
};

