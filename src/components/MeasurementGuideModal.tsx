
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface MeasurementGuideModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const MeasurementGuideModal: React.FC<MeasurementGuideModalProps> = ({
  open,
  onOpenChange
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Measurement Guide</DialogTitle>
          <DialogDescription>
            How to use the measurement tool
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <p>Click and drag to measure distances on the canvas.</p>
          <p>Measurements are shown in the selected unit system.</p>
          <p>Press Escape to cancel the current measurement.</p>
          <p>Double-click to finish and keep the measurement on the canvas.</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MeasurementGuideModal;
