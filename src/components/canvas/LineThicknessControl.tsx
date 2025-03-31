
import React from "react";
import { Slider } from "@/components/ui/slider";

interface LineThicknessControlProps {
  value: number;
  onChange: (thickness: number) => void;
}

export const LineThicknessControl: React.FC<LineThicknessControlProps> = ({
  value,
  onChange
}) => {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-medium">Thickness:</span>
      <Slider 
        value={[value]} 
        onValueChange={(values) => onChange(values[0])} 
        min={1} 
        max={20} 
        step={1}
        className="w-24"
      />
      <span className="text-xs w-4">{value}</span>
    </div>
  );
};
