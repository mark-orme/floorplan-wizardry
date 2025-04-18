
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface MeasurementGuideDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const MeasurementGuideDialog: React.FC<MeasurementGuideDialogProps> = ({
  open,
  onOpenChange,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Measurement Guide</DialogTitle>
          <DialogDescription>
            Learn how to use measurement tools effectively
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="border-l-4 border-blue-500 pl-4">
            <h4 className="font-medium">Basic Measurements</h4>
            <p className="text-sm text-gray-600">
              Click and drag to measure distances. The measurement will appear in real-time.
            </p>
          </div>

          <div className="border-l-4 border-green-500 pl-4">
            <h4 className="font-medium">Snap to Grid</h4>
            <p className="text-sm text-gray-600">
              Hold Shift while measuring to snap to grid points for precise measurements.
            </p>
          </div>

          <div className="border-l-4 border-purple-500 pl-4">
            <h4 className="font-medium">Angle Measurements</h4>
            <p className="text-sm text-gray-600">
              Connect two lines to measure angles between them automatically.
            </p>
          </div>
        </div>

        <Button 
          className="w-full mt-4"
          onClick={() => onOpenChange(false)}
        >
          Got it
        </Button>
      </DialogContent>
    </Dialog>
  );
};
