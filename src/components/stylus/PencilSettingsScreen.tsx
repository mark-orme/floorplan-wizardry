import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalibrationCanvas } from './CalibrationCanvas';

interface PencilCalibrationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PencilCalibrationDialog: React.FC<PencilCalibrationDialogProps> = ({ 
  open, 
  onOpenChange
}) => {
  const [pressureSensitivity, setPressureSensitivity] = React.useState(0.5);
  const [tiltSensitivity, setTiltSensitivity] = React.useState(0.5);
  
  const handleSave = () => {
    console.log('Saved pencil settings:', { pressureSensitivity, tiltSensitivity });
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Pencil Settings</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="pressure">
          <TabsList className="w-full">
            <TabsTrigger value="pressure">Pressure Sensitivity</TabsTrigger>
            <TabsTrigger value="tilt">Tilt Sensitivity</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pressure" className="space-y-4 my-4">
            <div>
              <label className="block text-sm font-medium mb-2">Pressure Sensitivity</label>
              <Slider
                value={[pressureSensitivity]}
                onValueChange={(values) => setPressureSensitivity(values[0])}
                max={1}
                step={0.01}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Low</span>
                <span>High</span>
              </div>
            </div>
            
            <div className="border rounded-md p-4">
              <h4 className="font-medium mb-2 text-sm">Test Pressure Sensitivity</h4>
              <CalibrationCanvas />
            </div>
          </TabsContent>
          
          <TabsContent value="tilt" className="space-y-4 my-4">
            <div>
              <label className="block text-sm font-medium mb-2">Tilt Sensitivity</label>
              <Slider
                value={[tiltSensitivity]}
                onValueChange={(values) => setTiltSensitivity(values[0])}
                max={1}
                step={0.01}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Low</span>
                <span>High</span>
              </div>
            </div>
            
            <div className="border rounded-md p-4">
              <h4 className="font-medium mb-2 text-sm">Test Tilt Sensitivity</h4>
              <CalibrationCanvas />
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave}>Save Settings</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export const PencilSettingsScreen = () => {
  const [sensitivity, setSensitivity] = React.useState(50);
  const [pressure, setPressure] = React.useState(50);
  
  const handleSensitivityChange = (newValue: number | undefined) => {
    setSensitivity(newValue ?? 50); // Use nullish coalescing to provide a default value
  };
  
  const handlePressureChange = (newValue: number | undefined) => {
    setPressure(newValue ?? 50); // Use nullish coalescing to provide a default value
  };
  
  return (
    <div>
      <h1>Pencil Settings</h1>
      <div>
        <label className="block text-sm font-medium mb-2">Sensitivity</label>
        <Slider
          value={[sensitivity]}
          onValueChange={(values) => handleSensitivityChange(values[0])}
          max={100}
          step={1}
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Low</span>
          <span>High</span>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">Pressure</label>
        <Slider
          value={[pressure]}
          onValueChange={(values) => handlePressureChange(values[0])}
          max={100}
          step={1}
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Low</span>
          <span>High</span>
        </div>
      </div>
    </div>
  );
};
