
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Tooltip } from '@/components/ui/tooltip';

interface LineThicknessSliderProps {
  currentValue: number;
  onValueChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

export const LineThicknessSlider: React.FC<LineThicknessSliderProps> = ({
  currentValue,
  onValueChange,
  min = 1,
  max = 10,
  step = 1
}) => {
  const handleValueChange = (values: number[]) => {
    if (values.length > 0) {
      onValueChange(values[0]);
    }
  };

  return (
    <Tooltip content="Line Thickness">
      <div className="flex items-center space-x-2 w-24">
        <Slider
          value={[currentValue]}
          min={min}
          max={max}
          step={step}
          onValueChange={handleValueChange}
          aria-label="Line Thickness"
        />
      </div>
    </Tooltip>
  );
};
