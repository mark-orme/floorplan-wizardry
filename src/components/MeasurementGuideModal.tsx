
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Ruler, Grid, X } from 'lucide-react';

interface MeasurementGuideModalProps {
  open: boolean;
  onClose: (dontShowAgain: boolean) => void;
  onOpenChange: (open: boolean) => void;
}

/**
 * Modal component for displaying measurement guide information
 * @param {MeasurementGuideModalProps} props Component properties
 * @returns {JSX.Element} Rendered component
 */
export const MeasurementGuideModal: React.FC<MeasurementGuideModalProps> = ({ 
  open,
  onClose,
  onOpenChange
}) => {
  const [dontShowAgain, setDontShowAgain] = React.useState(false);
  
  const handleClose = () => {
    onClose(dontShowAgain);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Ruler className="h-5 w-5" /> 
            Floor Plan Measurement Guide
          </DialogTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-4 top-4" 
            onClick={handleClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div className="space-y-4 mt-2">
          <section>
            <h3 className="font-semibold text-lg mb-2">Drawing to Scale</h3>
            <div className="bg-muted/50 p-4 rounded-md flex items-start gap-3">
              <Grid className="h-5 w-5 mt-1 flex-shrink-0 text-primary" />
              <div>
                <p className="mb-2">Our grid system helps you maintain accurate measurements:</p>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li>Each grid square represents 0.1 meters (10 cm)</li>
                  <li>Large grid lines appear every 1 meter</li>
                  <li>Measurements are automatically displayed while drawing</li>
                </ul>
              </div>
            </div>
          </section>
          
          <section>
            <h3 className="font-semibold text-lg mb-2">Drawing Tips</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Use the straight line tool for precise wall measurements</li>
              <li>Lines automatically snap to the grid for accuracy</li>
              <li>Close shapes completely to measure room areas</li>
              <li>Use the select tool to adjust existing elements</li>
            </ul>
          </section>
          
          <section>
            <h3 className="font-semibold text-lg mb-2">Gross Internal Area (GIA)</h3>
            <p>GIA is calculated automatically based on the closed areas in your floor plan. It represents the total usable internal floor area.</p>
          </section>

          <div className="flex items-center space-x-2 mt-4">
            <Checkbox
              id="dontShowAgain"
              checked={dontShowAgain}
              onCheckedChange={(checked) => setDontShowAgain(checked === true)}
            />
            <Label htmlFor="dontShowAgain" className="text-sm text-muted-foreground">
              Don't show this guide again
            </Label>
          </div>

          <section className="pt-2">
            <Button onClick={handleClose} className="w-full">
              Got it
            </Button>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
};
