
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface MeasurementGuideModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Modal component for measurement guide instructions
 */
const MeasurementGuideModal: React.FC<MeasurementGuideModalProps> = ({
  open,
  onOpenChange
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Using the Measurement Tool</DialogTitle>
          <DialogDescription>
            Learn how to measure distances on your floor plan.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="flex flex-col gap-2">
            <h3 className="font-medium">Getting Started</h3>
            <p className="text-sm text-gray-600">
              Click and drag to create a measurement line. The distance and angle will be displayed.
            </p>
          </div>
          
          <div className="flex flex-col gap-2">
            <h3 className="font-medium">Snapping Features</h3>
            <p className="text-sm text-gray-600">
              Hold Shift to snap to common angles (0°, 45°, 90°).
              Toggle grid snapping using the grid button.
            </p>
          </div>
          
          <div className="flex flex-col gap-2">
            <h3 className="font-medium">Units</h3>
            <p className="text-sm text-gray-600">
              Measurements are shown in pixels by default. You can change units in settings.
            </p>
          </div>
        </div>
        
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Got it</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MeasurementGuideModal;
