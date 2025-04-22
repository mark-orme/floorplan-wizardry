
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { CalibrationCanvas } from './CalibrationCanvas';
import { PressureCalibrationGraph } from './PressureCalibrationGraph';
import { DEFAULT_STYLUS_PROFILE } from '@/types/core/StylusProfile';

export interface PencilCalibrationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PencilCalibrationDialog({
  open,
  onOpenChange
}: PencilCalibrationDialogProps) {
  const [pressurePoints, setPressurePoints] = useState<Array<{pressure: number, thickness: number}>>([]);
  const [useTilt, setUseTilt] = useState(false);
  const [calibrationStep, setCalibrationStep] = useState<'start' | 'draw' | 'adjust'>('start');

  const handlePressureSample = (pressure: number, thickness: number) => {
    setPressurePoints(prev => [...prev, { pressure, thickness }]);
  };

  const handleSaveProfile = () => {
    const profile = {
      ...DEFAULT_STYLUS_PROFILE,
      pressureCurve: pressurePoints.map(p => p.thickness),
      lastCalibrated: new Date()
    };
    
    // Save profile and close dialog
    onOpenChange(false);
  };

  const handleReset = () => {
    setPressurePoints([]);
    setCalibrationStep('start');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Pencil Calibration</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {calibrationStep === 'start' && (
            <div className="space-y-4">
              <p>Calibrate your pencil pressure sensitivity for better drawing experience.</p>
              <Button onClick={() => setCalibrationStep('draw')}>Start Calibration</Button>
            </div>
          )}

          {calibrationStep === 'draw' && (
            <CalibrationCanvas onPressureSample={handlePressureSample} />
          )}

          {pressurePoints.length > 0 && (
            <>
              <PressureCalibrationGraph
                pressurePoints={pressurePoints}
                onPointsUpdated={setPressurePoints}
              />

              <div className="flex items-center space-x-2">
                <Switch
                  id="use-tilt"
                  checked={useTilt}
                  onCheckedChange={setUseTilt}
                />
                <Label htmlFor="use-tilt">Use tilt for line width</Label>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={handleReset}>
                  Reset
                </Button>
                <Button onClick={handleSaveProfile}>
                  Save Profile
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
