
import React from 'react';
import { Tooltip } from '@/components/ui/tooltip';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  color,
  onChange
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <Tooltip content="Line Color">
      <div className="flex items-center">
        <input
          type="color"
          value={color}
          onChange={handleChange}
          className="w-8 h-8 cursor-pointer rounded overflow-hidden"
          style={{ border: "none" }}
          aria-label="Line Color"
        />
      </div>
    </Tooltip>
  );
};
