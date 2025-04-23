
import React from 'react';

export interface LineSettingsProps {
  lineColor: string;
  setLineColor: (color: string) => void;
  lineThickness: number;
  setLineThickness: (thickness: number) => void;
}

export const LineSettings: React.FC<LineSettingsProps> = ({
  lineColor,
  setLineColor,
  lineThickness,
  setLineThickness
}) => {
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <label htmlFor="color-input" className="text-sm font-medium">Color:</label>
        <input
          id="color-input"
          type="color"
          value={lineColor}
          onChange={(e) => setLineColor(e.target.value)}
          className="w-8 h-8 rounded cursor-pointer"
          aria-label="Color:"
        />
      </div>
      
      <div className="flex items-center justify-between">
        <label htmlFor="thickness-input" className="text-sm font-medium">Thickness:</label>
        <input
          id="thickness-input"
          type="range"
          min="1"
          max="10"
          value={lineThickness}
          onChange={(e) => setLineThickness(parseInt(e.target.value))}
          className="w-32"
          aria-label="Thickness:"
        />
        <span className="ml-2 text-sm">{lineThickness}px</span>
      </div>
    </div>
  );
};
