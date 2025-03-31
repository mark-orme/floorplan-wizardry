
import React from 'react';
import { Button } from "@/components/ui/button";

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  presetColors?: string[];
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  color,
  onChange,
  presetColors = ['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF']
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Color</label>
        <div 
          className="w-5 h-5 rounded-full border border-gray-300" 
          style={{ backgroundColor: color }}
        />
      </div>
      <div className="flex gap-1 flex-wrap">
        {presetColors.map((presetColor) => (
          <Button
            key={presetColor}
            type="button"
            variant={presetColor === color ? "default" : "outline"}
            className="w-6 h-6 p-0 rounded-full"
            style={{ backgroundColor: presetColor }}
            onClick={() => onChange(presetColor)}
          />
        ))}
        <input
          type="color"
          value={color}
          onChange={(e) => onChange(e.target.value)}
          className="w-6 h-6 p-0 cursor-pointer"
        />
      </div>
    </div>
  );
};
