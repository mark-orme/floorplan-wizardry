
import React from 'react';
import { 
  AiOutlineBgColors as PaletteIcon,
  AiOutlinePlus as PlusIcon,
  AiOutlineMinus as MinusIcon 
} from 'react-icons/ai';
import { HexColorPicker } from 'react-colorful';
import { Button } from '@/components/ui/button';

export interface StyleOptionsProps {
  color?: string;
  lineColor?: string; // Added this prop
  onColorChange?: (color: string) => void;
  thickness?: number;
  lineThickness?: number; // Added this prop
  onThicknessChange?: (thickness: number) => void;
  minThickness?: number;
  maxThickness?: number;
}

export const StyleOptions: React.FC<StyleOptionsProps> = ({
  color,
  lineColor,
  onColorChange,
  thickness,
  lineThickness,
  onThicknessChange,
  minThickness = 1,
  maxThickness = 10
}) => {
  const [showColorPicker, setShowColorPicker] = React.useState(false);
  
  // Use the first available color prop
  const actualColor = color || lineColor || '#000000';
  // Use the first available thickness prop
  const actualThickness = thickness || lineThickness || 2;

  return (
    <div className="flex items-center gap-4">
      <div className="relative">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setShowColorPicker(!showColorPicker)}
        >
          <PaletteIcon className="h-4 w-4" />
        </Button>
        {showColorPicker && (
          <div className="absolute top-full mt-2 z-50">
            <HexColorPicker color={actualColor} onChange={onColorChange} />
          </div>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onThicknessChange?.(Math.max(minThickness, actualThickness - 1))}
          disabled={actualThickness <= minThickness}
        >
          <MinusIcon className="h-4 w-4" />
        </Button>
        <span className="min-w-[2rem] text-center">{actualThickness}</span>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onThicknessChange?.(Math.min(maxThickness, actualThickness + 1))}
          disabled={actualThickness >= maxThickness}
        >
          <PlusIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
