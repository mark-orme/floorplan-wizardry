
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
import { Ruler, MousePointer2, Grid, Maximize2 } from 'lucide-react';

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
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Ruler className="h-5 w-5" />
            Measurement Guide
          </DialogTitle>
          <DialogDescription>
            Learn how to use the measurement tools effectively
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <MousePointer2 className="h-4 w-4" />
              Distance Measurement
            </h3>
            <div className="pl-6">
              <p className="text-sm text-gray-500">
                • Click and drag to measure the distance between two points<br />
                • Double-click to finish a measurement<br />
                • Press ESC to cancel the current measurement<br />
                • Hold SHIFT while dragging to snap to 45° angles
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <Maximize2 className="h-4 w-4" />
              Area Measurement
            </h3>
            <div className="pl-6">
              <p className="text-sm text-gray-500">
                • Click to start drawing a shape<br />
                • Continue clicking to add points to your shape<br />
                • Double-click to close the shape and calculate area<br />
                • Areas are shown in both square meters and square feet<br />
                • Press BACKSPACE to remove the last point
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <Grid className="h-4 w-4" />
              Grid and Snapping
            </h3>
            <div className="pl-6">
              <p className="text-sm text-gray-500">
                • Enable grid snapping for precise measurements<br />
                • Hold SHIFT to temporarily disable snapping<br />
                • Adjust grid size in settings for different scales<br />
                • Use arrow keys for fine adjustments<br />
                • Press G to toggle grid visibility
              </p>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-md">
            <p className="text-sm text-blue-700">
              <strong>Pro Tip:</strong> For the most accurate measurements, zoom in and use the grid snapping feature. All measurements are automatically saved with your drawing.
            </p>
          </div>

          <div className="bg-yellow-50 p-4 rounded-md">
            <p className="text-sm text-yellow-700">
              <strong>Note:</strong> You can access this guide anytime by clicking the measurement guide button in the toolbar.
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
