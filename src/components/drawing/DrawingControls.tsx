
import React from 'react';

interface DrawingControlsProps {
  lineThickness: number;
  lineColor: string;
  onThicknessChange?: (thickness: number) => void;
  onColorChange?: (color: string) => void;
}

export const DrawingControls: React.FC<DrawingControlsProps> = ({
  lineThickness,
  lineColor,
  onThicknessChange,
  onColorChange
}) => {
  const handleThicknessChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onThicknessChange) {
      onThicknessChange(Number(e.target.value));
    }
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onColorChange) {
      onColorChange(e.target.value);
    }
  };

  return (
    <div className="p-2 bg-white shadow-md rounded-md">
      <div className="flex items-center space-x-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Thickness</label>
          <div className="mt-1">
            <input
              type="range"
              min="1"
              max="20"
              value={lineThickness}
              className="w-32"
              onChange={handleThicknessChange}
            />
            <span className="ml-2 text-sm">{lineThickness}px</span>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Color</label>
          <div className="mt-1 flex items-center">
            <input 
              type="color"
              value={lineColor}
              onChange={handleColorChange}
              className="w-8 h-8 rounded-full border border-gray-300"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DrawingControls;
