
import React from 'react';

interface DrawingControlsProps {
  lineThickness: number;
  lineColor: string;
}

export const DrawingControls: React.FC<DrawingControlsProps> = ({
  lineThickness,
  lineColor
}) => {
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
              readOnly
            />
            <span className="ml-2 text-sm">{lineThickness}px</span>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Color</label>
          <div className="mt-1 flex items-center">
            <div 
              className="w-8 h-8 rounded-full border border-gray-300" 
              style={{ backgroundColor: lineColor }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
