
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface MeasurementGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MeasurementGuideModal: React.FC<MeasurementGuideModalProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Measurement Tool Guide</DialogTitle>
          <DialogDescription>
            Learn how to use the measurement tool effectively.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <h3 className="font-medium">Basic Usage</h3>
            <p className="text-sm text-muted-foreground">
              Click and drag to create a measurement line. Release to complete.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">Keyboard Shortcuts</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li><kbd className="px-1 rounded bg-muted">Shift</kbd> - Hold to snap to 45° angles</li>
              <li><kbd className="px-1 rounded bg-muted">G</kbd> - Toggle grid snapping</li>
              <li><kbd className="px-1 rounded bg-muted">Escape</kbd> - Cancel current measurement</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">Tips</h3>
            <p className="text-sm text-muted-foreground">
              Use grid snapping for more precise measurements. Toggle angle constraints for architectural drawings.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={onClose}>Got it</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MeasurementGuideModal;
