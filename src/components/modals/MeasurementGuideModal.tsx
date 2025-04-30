
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export interface MeasurementGuideModalProps {
  open: boolean;
  onClose: () => void;
}

export const MeasurementGuideModal: React.FC<MeasurementGuideModalProps> = ({
  open,
  onClose
}) => {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Measurement Guide</DialogTitle>
          <DialogDescription>
            Learn how to use the measurement tools effectively
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium">Basic Measurements</h3>
            <p className="text-sm text-gray-500">
              Click and drag to create a line. The measurement will appear above the line.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium">Snap to Grid</h3>
            <p className="text-sm text-gray-500">
              Enable snap to grid for more precise measurements. Press Shift while dragging to temporarily disable snapping.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium">Keyboard Shortcuts</h3>
            <ul className="text-sm text-gray-500 list-disc pl-5">
              <li>Hold Shift: Temporarily disable snapping</li>
              <li>Press Escape: Cancel current measurement</li>
              <li>Press Delete: Remove selected measurement</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MeasurementGuideModal;
