
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

interface LineThicknessSliderProps {
  /** Current line thickness */
  thickness: number;
  /** Min thickness value */
  min?: number;
  /** Max thickness value */
  max?: number;
  /** Step size for the slider */
  step?: number;
  /** Change handler */
  onChange: (value: number) => void;
}

/**
 * Line thickness slider component
 * Used to control the thickness of drawing tools
 */
export const LineThicknessSlider: React.FC<LineThicknessSliderProps> = ({
  thickness,
  min = 1,
  max = 20,
  step = 1,
  onChange
}) => {
  // Handle slider value change
  const handleChange = (values: number[]) => {
    if (values.length > 0) {
      onChange(values[0]);
    }
  };

  return (
    <div className="flex flex-col space-y-1 min-w-[120px]">
      <div className="flex items-center justify-between">
        <Label htmlFor="thickness" className="text-xs">Line Width</Label>
        <span className="text-xs font-medium">{thickness}px</span>
      </div>
      <Slider
        id="thickness"
        value={[thickness]}
        min={min}
        max={max}
        step={step}
        onValueChange={handleChange}
        aria-label="Line thickness"
      />
    </div>
  );
};
