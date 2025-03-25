
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Ruler,
  Maximize2,
  Square,
  MousePointerClick,
  Move,
} from "lucide-react";

interface MeasurementGuideModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Modal that provides guidance on taking accurate measurements
 * in the floor plan drawing tool
 */
export const MeasurementGuideModal = ({
  open,
  onOpenChange,
}: MeasurementGuideModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Ruler className="w-5 h-5" />
            Measurement Guide
          </DialogTitle>
          <DialogDescription>
            How to create accurate floor plan measurements
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
              <MousePointerClick className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="font-medium">Click to start drawing</h3>
              <p className="text-sm text-muted-foreground">
                Click once to set your starting point, then move to create a line
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full">
              <Move className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="font-medium">Watch the measurements</h3>
              <p className="text-sm text-muted-foreground">
                As you move, a tooltip will show the exact distance in meters
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="bg-amber-100 dark:bg-amber-900 p-2 rounded-full">
              <Square className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h3 className="font-medium">Close shapes for area calculation</h3>
              <p className="text-sm text-muted-foreground">
                When creating rooms, end near your starting point to calculate area
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-full">
              <Maximize2 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="font-medium">Grid alignment</h3>
              <p className="text-sm text-muted-foreground">
                Lines snap to the grid (0.1m) for precision. Check the tooltip for exact measurements.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="dont-show-again"
              className="mr-2"
            />
            <label htmlFor="dont-show-again" className="text-xs text-muted-foreground">
              Don't show again
            </label>
          </div>
          <Button onClick={() => onOpenChange(false)}>
            Got it
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
