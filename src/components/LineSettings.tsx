
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

interface LineSettingsProps {
  thickness: number;
  color: string;
  onThicknessChange: (thickness: number) => void;
  onColorChange: (color: string) => void;
}

/**
 * Line settings component for controlling line thickness and color
 * @param {LineSettingsProps} props - Component props
 * @returns {JSX.Element} Rendered component
 */
export const LineSettings: React.FC<LineSettingsProps> = ({
  thickness,
  color,
  onThicknessChange,
  onColorChange
}) => {
  // Handle thickness slider change
  const handleThicknessChange = (values: number[]) => {
    onThicknessChange(values[0]);
  };

  return (
    <div className="flex gap-6 items-center">
      <div className="flex flex-col space-y-1 min-w-[120px]">
        <Label htmlFor="line-thickness" className="text-xs">Thickness: {thickness}px</Label>
        <Slider
          id="line-thickness"
          min={1}
          max={20}
          step={1}
          value={[thickness]}
          onValueChange={handleThicknessChange}
          className="w-full"
        />
      </div>
      
      <div className="flex flex-col space-y-1">
        <Label htmlFor="line-color" className="text-xs">Color</Label>
        <div className="flex items-center gap-2">
          <Input
            id="line-color"
            type="color"
            value={color}
            onChange={(e) => onColorChange(e.target.value)}
            className="w-10 h-10 p-1 cursor-pointer"
          />
          <div 
            className="w-6 h-6 rounded border border-gray-200" 
            style={{ backgroundColor: color }}
          />
        </div>
      </div>
    </div>
  );
};
