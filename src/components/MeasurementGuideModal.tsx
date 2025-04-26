
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface MeasurementGuideModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MeasurementGuideModal: React.FC<MeasurementGuideModalProps> = ({
  open,
  onOpenChange
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Measurement Guide</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <h3 className="font-medium">How to measure</h3>
            <p className="text-sm text-gray-500">
              Click and drag to measure distances on the canvas.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium">Units</h3>
            <p className="text-sm text-gray-500">
              Measurements are shown in both pixels and meters (based on scale).
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium">Tips</h3>
            <ul className="text-sm text-gray-500 list-disc pl-5">
              <li>Hold Shift to constrain to straight lines</li>
              <li>Double-click to end measurement</li>
              <li>Press Escape to cancel</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MeasurementGuideModal;
