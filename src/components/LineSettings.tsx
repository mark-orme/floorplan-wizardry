
import React from 'react';

interface LineSettingsProps {
  lineColor: string;
  setLineColor: (color: string) => void;
  lineThickness: number;
  setLineThickness: (thickness: number) => void;
}

export const LineSettings: React.FC<LineSettingsProps> = ({
  lineColor,
  setLineColor,
  lineThickness,
  setLineThickness,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <label htmlFor="color-input" className="mr-2 w-20">
          Color:
        </label>
        <input
          id="color-input"
          type="color"
          value={lineColor}
          onChange={(e) => setLineColor(e.target.value)}
          className="h-8 w-8 cursor-pointer"
          aria-label="Color:"
        />
      </div>
      
      <div className="flex items-center">
        <label htmlFor="thickness-input" className="mr-2 w-20">
          Thickness:
        </label>
        <input
          id="thickness-input"
          type="range"
          min="1"
          max="10"
          value={lineThickness}
          onChange={(e) => setLineThickness(parseInt(e.target.value, 10))}
          className="w-36"
          aria-label="Thickness:"
        />
        <span className="ml-2">{lineThickness}px</span>
      </div>
    </div>
  );
};
