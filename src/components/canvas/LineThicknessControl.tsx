
import React from 'react';
import { Slider } from "@/components/ui/slider";

interface LineThicknessControlProps {
  thickness: number;
  onChange: (thickness: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

export const LineThicknessControl: React.FC<LineThicknessControlProps> = ({
  thickness,
  onChange,
  min = 1,
  max = 10,
  step = 1
}) => {
  const handleChange = (value: number[]) => {
    onChange(value[0]);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Line Thickness</label>
        <span className="text-sm text-muted-foreground">{thickness}px</span>
      </div>
      <Slider
        value={[thickness]}
        min={min}
        max={max}
        step={step}
        onValueChange={handleChange}
        className="w-full"
      />
    </div>
  );
};
