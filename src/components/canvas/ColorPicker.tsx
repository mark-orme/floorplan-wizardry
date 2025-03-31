
import React from "react";

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  color,
  onChange
}) => {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-medium">Color:</span>
      <div className="flex items-center">
        <input
          type="color"
          value={color}
          onChange={(e) => onChange(e.target.value)}
          className="w-8 h-8 cursor-pointer"
          aria-label="Select color"
        />
      </div>
    </div>
  );
};
