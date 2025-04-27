import React from 'react';
import { AiOutlineBgColors } from 'react-icons/ai';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ToolbarItem } from './ToolbarItem';

export interface ColorPickerProps {
  /** Current color */
  color: string;
  /** Color change handler */
  onChange: (color: string) => void;
  /** Predefined colors */
  presetColors?: string[];
}

/**
 * Canvas color picker component
 * @param props Component props
 * @returns Rendered component
 */
export const ColorPicker: React.FC<ColorPickerProps> = ({
  color,
  onChange,
  presetColors = [
    '#000000', // Black
    '#ffffff', // White
    '#ff0000', // Red
    '#00ff00', // Green
    '#0000ff', // Blue
    '#ffff00', // Yellow
    '#ff00ff', // Magenta
    '#00ffff', // Cyan
    '#ff8000', // Orange
    '#8000ff', // Purple
    '#808080', // Gray
    '#4d4d4d'  // Dark gray
  ]
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="relative">
          <ToolbarItem
            icon={<AiOutlineBgColors size={16} />}
            label="Color"
          />
          <div
            className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-4 h-2 rounded-sm border border-gray-300"
            style={{ backgroundColor: color }}
          />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-2">
        <div className="grid grid-cols-6 gap-1">
          {presetColors.map(presetColor => (
            <button
              key={presetColor}
              className="w-8 h-8 rounded border border-gray-300 flex items-center justify-center"
              style={{ backgroundColor: presetColor }}
              onClick={() => onChange(presetColor)}
              title={presetColor}
            >
              {presetColor === color && (
                <div className="w-2 h-2 rounded-full bg-white border border-black" />
              )}
            </button>
          ))}
        </div>
        
        <div className="mt-2 flex items-center space-x-2">
          <input
            type="color"
            value={color}
            onChange={e => onChange(e.target.value)}
            className="w-8 h-8"
          />
          <input
            type="text"
            value={color}
            onChange={e => onChange(e.target.value)}
            className="flex-1 p-1 text-xs border rounded"
            pattern="^#[0-9A-Fa-f]{6}$"
          />
        </div>
      </PopoverContent>
    </Popover>
  );
};
