
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface GridSettingsPanelProps {
  gridSize: number;
  gridVisible: boolean;
  snapEnabled: boolean;
  showMeasurements: boolean;
  onGridSizeChange: (value: number) => void;
  onGridVisibleChange: (value: boolean) => void;
  onSnapEnabledChange: (value: boolean) => void;
  onShowMeasurementsChange: (value: boolean) => void;
}

/**
 * Grid Settings Panel component
 * Displays controls for adjusting grid settings
 */
export const GridSettingsPanel: React.FC<GridSettingsPanelProps> = ({
  gridSize,
  gridVisible,
  snapEnabled,
  showMeasurements,
  onGridSizeChange,
  onGridVisibleChange,
  onSnapEnabledChange,
  onShowMeasurementsChange
}) => {
  return (
    <div className="p-4 bg-white rounded-md shadow border border-gray-200 space-y-4">
      <div className="flex flex-col gap-2">
        <h3 className="font-medium text-sm">Grid Size: {gridSize}px</h3>
        <Slider
          value={[gridSize]}
          min={5}
          max={50}
          step={5}
          onValueChange={(values) => onGridSizeChange(values[0])}
        />
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="grid-visible" className="cursor-pointer">Show Grid</Label>
          <Switch
            id="grid-visible"
            checked={gridVisible}
            onCheckedChange={onGridVisibleChange}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="snap-enabled" className="cursor-pointer">Snap to Grid</Label>
          <Switch
            id="snap-enabled"
            checked={snapEnabled}
            onCheckedChange={onSnapEnabledChange}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="show-measurements" className="cursor-pointer">Show Measurements</Label>
          <Switch
            id="show-measurements"
            checked={showMeasurements}
            onCheckedChange={onShowMeasurementsChange}
          />
        </div>
      </div>
      
      <div className="pt-2 border-t border-gray-100 text-xs text-gray-500">
        <p>Grid settings affect drawing precision and object alignment.</p>
      </div>
    </div>
  );
};
