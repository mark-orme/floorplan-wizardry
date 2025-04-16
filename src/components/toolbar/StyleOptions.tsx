
/**
 * Style options component
 * @module components/toolbar/StyleOptions
 */
import React from 'react';
import { Palette, Minus, Plus } from 'lucide-react';
import { ToolbarButton } from './ToolbarButton';
import { ToolbarPopover } from './ToolbarPopover';
import { ToolbarSection } from './ToolbarSection';
import { Slider } from '@/components/ui/slider';

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
  // Available colors
  const colors = [
    '#000000', // Black
    '#333333', // Dark gray
    '#666666', // Gray
    '#ffffff', // White
    '#ff0000', // Red
    '#ff8000', // Orange
    '#ffff00', // Yellow
    '#00ff00', // Green
    '#00ffff', // Cyan
    '#0000ff', // Blue
    '#8000ff', // Purple
    '#ff00ff'  // Magenta
  ];
  
  // Line thickness range
  const minThickness = 1;
  const maxThickness = 20;
  
  // Increment/decrement thickness
  const handleIncrement = () => {
    onThicknessChange(Math.min(lineThickness + 1, maxThickness));
  };
  
  const handleDecrement = () => {
    onThicknessChange(Math.max(lineThickness - 1, minThickness));
  };
  
  return (
    <ToolbarSection title="Style">
      {/* Color picker */}
      <ToolbarPopover
        trigger={
          <ToolbarButton
            icon={<Palette size={20} style={{ color: lineColor }} />}
            label="Color"
            tooltip="Change color"
            onClick={() => {}} // Add empty onClick handler
          />
        }
        side="bottom"
      >
        <div className="grid grid-cols-4 gap-1 w-36">
          {colors.map(color => (
            <button
              key={color}
              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center"
              style={{ backgroundColor: color }}
              onClick={() => onColorChange(color)}
              title={color}
            >
              {color === lineColor && (
                <div className="w-2 h-2 rounded-full bg-white border border-gray-500" />
              )}
            </button>
          ))}
        </div>
      </ToolbarPopover>
      
      {/* Line thickness */}
      <ToolbarButton
        icon={<Minus size={20} />}
        label="Decrease thickness"
        tooltip="Decrease thickness"
        onClick={handleDecrement}
        disabled={lineThickness <= minThickness}
      />
      
      <ToolbarPopover
        trigger={
          <ToolbarButton
            icon={
              <div className="relative w-6 h-6 flex items-center justify-center">
                <div
                  className="absolute bg-current rounded-full"
                  style={{
                    width: `${Math.min(100, lineThickness * 5)}%`,
                    height: `${Math.min(100, lineThickness * 5)}%`
                  }}
                />
              </div>
            }
            label={`Thickness: ${lineThickness}`}
            tooltip={`Line thickness: ${lineThickness}px`}
            onClick={() => {}} // Add empty onClick handler
          />
        }
        side="bottom"
      >
        <div className="w-36 px-2">
          <Slider
            value={[lineThickness]}
            min={minThickness}
            max={maxThickness}
            step={1}
            onValueChange={values => onThicknessChange(values[0])}
          />
          <div className="text-center mt-2 text-xs">
            {lineThickness}px
          </div>
        </div>
      </ToolbarPopover>
      
      <ToolbarButton
        icon={<Plus size={20} />}
        label="Increase thickness"
        tooltip="Increase thickness"
        onClick={handleIncrement}
        disabled={lineThickness >= maxThickness}
      />
    </ToolbarSection>
  );
};
