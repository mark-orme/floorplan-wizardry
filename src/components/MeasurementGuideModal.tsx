
/**
 * Modal component for displaying measurement guidelines
 * Provides educational information about measurement tools
 * @module MeasurementGuideModal
 */
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { Ruler, Grid } from "lucide-react";

/**
 * Props for the MeasurementGuideModal component
 */
interface MeasurementGuideModalProps {
  /** Whether the modal is open */
  open: boolean;
  /** Function to set the open state */
  onOpenChange: (open: boolean) => void;
}

/**
 * Modal that displays measurement guidelines and tips
 * @param {MeasurementGuideModalProps} props - Component props
 * @returns {JSX.Element} Rendered component
 */
export const MeasurementGuideModal = ({ open, onOpenChange }: MeasurementGuideModalProps) => {
  const [dontShowAgain, setDontShowAgain] = useState(false);
  
  // Check local storage on initial load
  useEffect(() => {
    const dontShow = localStorage.getItem('dontShowMeasurementGuide') === 'true';
    setDontShowAgain(dontShow);
  }, []);

  /**
   * Handle closing the modal with option to not show again
   */
  const handleClose = () => {
    if (dontShowAgain) {
      localStorage.setItem('dontShowMeasurementGuide', 'true');
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Ruler className="h-5 w-5" />
            Measurement Guide
          </DialogTitle>
          <DialogDescription>
            Tips for accurate floor plan measurements
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 my-4">
          <div className="p-3 border rounded-md">
            <h3 className="font-medium mb-1 flex items-center gap-2">
              <Grid className="h-4 w-4" />
              Grid System
            </h3>
            <p className="text-sm text-muted-foreground">
              Each small grid square represents 0.5 meters. Large grid lines appear every 1 meter.
            </p>
          </div>

          <div className="p-3 border rounded-md">
            <h3 className="font-medium mb-1 flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Drawing Walls
            </h3>
            <p className="text-sm text-muted-foreground">
              Use the "Line" tool to draw walls. Click to start, move to the end point, then click again.
              Hold Shift while drawing to snap to 45° and 90° angles.
            </p>
          </div>

          <div className="p-3 border rounded-md">
            <h3 className="font-medium mb-1 flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
              </svg>
              Measuring Areas
            </h3>
            <p className="text-sm text-muted-foreground">
              Use the "Polygon" tool to outline rooms. Close the shape by clicking near the starting point.
              The area will be calculated automatically.
            </p>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="dontShow"
              checked={dontShowAgain}
              onCheckedChange={(checked) => setDontShowAgain(checked as boolean)}
            />
            <Label htmlFor="dontShow" className="text-sm">Don't show again</Label>
          </div>
          <Button onClick={handleClose}>Got it</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
