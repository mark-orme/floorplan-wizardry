
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useState } from 'react';

export interface MeasurementGuideModalProps {
  open: boolean;
  onClose: (dontShowAgain: boolean) => void;
  onOpenChange: (open: boolean) => void;
}

export const MeasurementGuideModal: React.FC<MeasurementGuideModalProps> = ({
  open,
  onClose,
  onOpenChange
}) => {
  const [dontShowAgain, setDontShowAgain] = useState(false);

  const handleClose = () => {
    onClose(dontShowAgain);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Measurement Guide</DialogTitle>
          <DialogDescription>
            Learn how to use the measurement tools effectively.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-sm font-semibold">Distance Measurement</h3>
            <p className="text-sm text-gray-500">
              Click and drag to measure the distance between two points. The measurement will display in the preferred unit.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-semibold">Area Measurement</h3>
            <p className="text-sm text-gray-500">
              Draw a closed shape to automatically calculate the area. The result will show in square meters and square feet.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-semibold">Grid Snapping</h3>
            <p className="text-sm text-gray-500">
              Enable grid snapping for precise measurements. The grid size can be adjusted in the settings.
            </p>
          </div>
        </div>
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="dont-show-again" 
              checked={dontShowAgain} 
              onCheckedChange={(checked) => setDontShowAgain(checked as boolean)} 
            />
            <label 
              htmlFor="dont-show-again" 
              className="text-sm font-medium leading-none cursor-pointer"
            >
              Don't show this again
            </label>
          </div>
          <Button onClick={handleClose}>Got it</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default React.memo(MeasurementGuideModal);
