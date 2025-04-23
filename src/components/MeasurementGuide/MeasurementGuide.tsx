
import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { 
  Ruler, 
  Grid, 
  Square, 
  Move 
} from "lucide-react";

interface MeasurementGuideProps {
  onClose: () => void;
}

export const MeasurementGuide: React.FC<MeasurementGuideProps> = ({ onClose }) => {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            Floor Plan Measurement Guide
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <section className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Grid className="h-5 w-5" />
              Grid System
            </h3>
            <div className="pl-7 space-y-2">
              <p>• Each small grid square represents 0.1 meters (10 cm)</p>
              <p>• Bold grid lines appear every 1 meter</p>
              <p>• Use the grid for precise measurements</p>
            </div>
          </section>

          <section className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Ruler className="h-5 w-5" />
              Drawing Tools
            </h3>
            <div className="pl-7 space-y-2">
              <p>• Lines snap to grid points for accuracy</p>
              <p>• Hold Shift for perfect horizontal/vertical lines</p>
              <p>• Double-click to end a continuous line</p>
            </div>
          </section>

          <section className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Square className="h-5 w-5" />
              Room Measurements
            </h3>
            <div className="pl-7 space-y-2">
              <p>• Close shapes to measure room area</p>
              <p>• Areas are calculated in square meters</p>
              <p>• Click inside a room to see its dimensions</p>
            </div>
          </section>

          <section className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Move className="h-5 w-5" />
              Navigation
            </h3>
            <div className="pl-7 space-y-2">
              <p>• Drag to pan around the canvas</p>
              <p>• Mouse wheel or pinch to zoom</p>
              <p>• Right-click or long press to access context menu</p>
            </div>
          </section>
        </div>

        <DialogFooter>
          <Button onClick={onClose} className="w-full sm:w-auto">
            Got it
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
