
/**
 * Style options component for the drawing toolbar
 * @module components/toolbar/StyleOptions
 */
import React, { useState } from 'react';
import { Palette, Plus, Minus, PaintBucket } from 'lucide-react';
import { ToolbarButton } from './ToolbarButton';
import { ToolbarSection } from './ToolbarSection';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { HexColorPicker } from 'react-colorful';

// Common color presets for quick selection
const COLOR_PRESETS = [
  '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF',
  '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080'
];

export interface StyleOptionsProps {
  /** Current line color */
  lineColor: string;
  /** Current line thickness */
  lineThickness: number;
  /** Color change handler */
  onColorChange: (color: string) => void;
  /** Thickness change handler */
  onThicknessChange: (thickness: number) => void;
}

/**
 * Style options component
 * @param props Component props
 * @returns Rendered component
 */
export const StyleOptions: React.FC<StyleOptionsProps> = ({
  lineColor,
  lineThickness,
  onColorChange,
  onThicknessChange
}) => {
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  
  // Handle thickness change
  const handleThicknessChange = (value: number[]) => {
    onThicknessChange(value[0]);
  };
  
  // Handle thickness increase
  const handleThicknessIncrease = () => {
    // Cap at 20px
    onThicknessChange(Math.min(lineThickness + 1, 20));
  };
  
  // Handle thickness decrease
  const handleThicknessDecrease = () => {
    // Min of 1px
    onThicknessChange(Math.max(lineThickness - 1, 1));
  };
  
  // Render color preset button
  const renderColorPreset = (color: string) => (
    <button
      key={color}
      className="w-5 h-5 rounded-full border border-gray-300 cursor-pointer"
      style={{ backgroundColor: color }}
      onClick={() => {
        onColorChange(color);
        setColorPickerOpen(false);
      }}
    />
  );
  
  // Color button with popover
  const colorButton = (
    <ToolbarButton
      icon={<Palette size={20} />}
      label="Color"
      tooltip="Change color"
      onClick={() => {}} // This is required by the ToolbarButton props
    />
  );
  
  return (
    <ToolbarSection title="Style Options">
      {/* Color picker */}
      <Popover open={colorPickerOpen} onOpenChange={setColorPickerOpen}>
        <PopoverTrigger asChild>
          {colorButton}
        </PopoverTrigger>
        <PopoverContent className="w-64 p-3">
          <div className="mb-3">
            <HexColorPicker color={lineColor} onChange={onColorChange} />
          </div>
          
          <div className="mb-3">
            <Input
              type="text"
              value={lineColor}
              onChange={(e) => onColorChange(e.target.value)}
              className="h-8 text-sm"
            />
          </div>
          
          <div className="flex flex-wrap gap-1">
            {COLOR_PRESETS.map(renderColorPreset)}
          </div>
        </PopoverContent>
      </Popover>
      
      {/* Current color preview */}
      <ToolbarButton
        icon={
          <div
            className="w-5 h-5 rounded-full border border-gray-300"
            style={{ backgroundColor: lineColor }}
          />
        }
        label="Current Color"
        tooltip="Current color"
        onClick={() => setColorPickerOpen(true)}
      />
      
      {/* Decrease thickness */}
      <ToolbarButton
        icon={<Minus size={20} />}
        label="Decrease Thickness"
        tooltip="Decrease thickness"
        onClick={handleThicknessDecrease}
        disabled={lineThickness <= 1}
      />
      
      {/* Thickness value */}
      <ToolbarButton
        icon={<span className="text-xs font-medium">{lineThickness}px</span>}
        label="Thickness"
        tooltip="Line thickness"
        onClick={() => {}} // This is required by the ToolbarButton props
      />
      
      {/* Increase thickness */}
      <ToolbarButton
        icon={<Plus size={20} />}
        label="Increase Thickness"
        tooltip="Increase thickness"
        onClick={handleThicknessIncrease}
        disabled={lineThickness >= 20}
      />
      
      {/* Thickness slider */}
      <div className="w-24 px-2">
        <Slider
          defaultValue={[lineThickness]}
          min={1}
          max={20}
          step={1}
          value={[lineThickness]}
          onValueChange={handleThicknessChange}
          className="h-4"
        />
      </div>
    </ToolbarSection>
  );
};
