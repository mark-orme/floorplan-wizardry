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
import { TiltCalibrationGraph } from './TiltCalibrationGraph';
import { DEFAULT_STYLUS_PROFILE } from '@/types/core/StylusProfile';
import { stylusProfileService } from '@/services/StylusProfileService';
import { initPointProcessor, processPoints } from '@/utils/wasm/pointProcessor';

export interface PencilCalibrationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PencilCalibrationDialog({
  open,
  onOpenChange
}: PencilCalibrationDialogProps) {
  const [pressurePoints, setPressurePoints] = useState<Array<{pressure: number, thickness: number}>>([]);
  const [tiltPoints, setTiltPoints] = useState<Array<{tilt: number, effect: number}>>([]);
  const [useTilt, setUseTilt] = useState(false);
  const [calibrationStep, setCalibrationStep] = useState<'start' | 'draw' | 'adjust'>('start');

  const handlePressureSample = (pressure: number, thickness: number) => {
    setPressurePoints(prev => [...prev, { pressure, thickness }]);
  };

  const handleTiltSample = (tiltX: number, tiltY: number) => {
    if (!useTilt) return;
    const tiltAngle = Math.atan2(tiltY, tiltX) * (180 / Math.PI);
    const tiltMagnitude = Math.sqrt(tiltX * tiltX + tiltY * tiltY);
    setTiltPoints(prev => [...prev, { tilt: tiltAngle, effect: tiltMagnitude }]);
  };

  const handleSaveProfile = async () => {
    await initPointProcessor();
    const processedPressurePoints = processPoints(
      pressurePoints.map(p => ({ x: p.pressure, y: p.thickness }))
    );

    const profile = {
      ...DEFAULT_STYLUS_PROFILE,
      pressureCurve: processedPressurePoints.map(p => p.y),
      tiltCurve: useTilt ? tiltPoints.map(p => p.effect) : undefined,
      lastCalibrated: new Date()
    };
    
    await stylusProfileService.saveProfile(profile);
    onOpenChange(false);
  };

  const handleReset = () => {
    setPressurePoints([]);
    setTiltPoints([]);
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
              <p>Calibrate your pencil pressure and tilt sensitivity for better drawing experience.</p>
              <Button onClick={() => setCalibrationStep('draw')}>Start Calibration</Button>
            </div>
          )}

          {calibrationStep === 'draw' && (
            <CalibrationCanvas 
              onPressureSample={handlePressureSample}
              onTiltSample={handleTiltSample}
            />
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

              {useTilt && (
                <TiltCalibrationGraph
                  tiltPoints={tiltPoints}
                  onPointsUpdated={setTiltPoints}
                />
              )}

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
