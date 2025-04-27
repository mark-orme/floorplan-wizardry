
import React from 'react';
import { Icons } from '@/components/icons';
import { HexColorPicker } from 'react-colorful';
import { Button } from '@/components/ui/button';

interface StyleOptionsProps {
  color: string;
  onColorChange: (color: string) => void;
  thickness: number;
  onThicknessChange: (thickness: number) => void;
  minThickness?: number;
  maxThickness?: number;
}

export const StyleOptions: React.FC<StyleOptionsProps> = ({
  color,
  onColorChange,
  thickness,
  onThicknessChange,
  minThickness = 1,
  maxThickness = 10
}) => {
  const [showColorPicker, setShowColorPicker] = React.useState(false);

  return (
    <div className="flex items-center gap-4">
      <div className="relative">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setShowColorPicker(!showColorPicker)}
        >
          <Icons.palette className="h-4 w-4" />
        </Button>
        {showColorPicker && (
          <div className="absolute top-full mt-2 z-50">
            <HexColorPicker color={color} onChange={onColorChange} />
          </div>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onThicknessChange(Math.max(minThickness, thickness - 1))}
          disabled={thickness <= minThickness}
        >
          <Icons.minus className="h-4 w-4" />
        </Button>
        <span className="min-w-[2rem] text-center">{thickness}</span>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onThicknessChange(Math.min(maxThickness, thickness + 1))}
          disabled={thickness >= maxThickness}
        >
          <Icons.plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
