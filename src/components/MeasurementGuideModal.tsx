
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";

interface MeasurementGuideModalProps {
  open: boolean;
  onClose: (dontShowAgain: boolean) => void;
  onOpenChange: (open: boolean) => void;
}

export const MeasurementGuideModal = ({
  open,
  onClose,
  onOpenChange
}: MeasurementGuideModalProps) => {
  const [dontShowAgain, setDontShowAgain] = useState(false);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Drawing Guide</DialogTitle>
          <DialogDescription>
            Learn how to use the drawing tools effectively
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <section>
            <h3 className="font-semibold text-lg mb-2">Canvas Controls</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Click and drag to move around the canvas</li>
              <li>Use mouse wheel or pinch gestures to zoom in/out</li>
              <li>Double-click objects to edit them</li>
            </ul>
          </section>

          <section>
            <h3 className="font-semibold text-lg mb-2">Drawing Tips</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Use grid snapping for precise measurements</li>
              <li>Hold Shift for straight lines</li>
              <li>Press Escape to cancel current action</li>
            </ul>
          </section>
        </div>

        <DialogFooter className="gap-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="dontShow"
              checked={dontShowAgain}
              onCheckedChange={(checked) => setDontShowAgain(checked as boolean)}
            />
            <label
              htmlFor="dontShow"
              className="text-sm text-muted-foreground cursor-pointer"
            >
              Don't show again
            </label>
          </div>
          <Button onClick={() => onClose(dontShowAgain)}>Got it</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
