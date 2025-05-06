import React from 'react';
import { DrawingMode } from '@/constants/drawingModes';
import { useDrawingContext } from '@/contexts/DrawingContext';

export const CanvasToolbar = () => {
  const {
    activeTool = DrawingMode.SELECT, // Provide a default value
    setActiveTool = () => {}, // Provide a default function
    lineColor,
    setLineColor,
    lineThickness,
    setLineThickness,
    showGrid,
    setShowGrid
  } = useDrawingContext();
  
  return (
    <div className="flex items-center space-x-4 p-4 bg-gray-100 border-b border-gray-200">
      {/* Tool Selection */}
      <select
        value={activeTool}
        onChange={(e) => setActiveTool(e.target.value as DrawingMode)}
        className="p-2 border rounded"
      >
        <option value={DrawingMode.SELECT}>Select</option>
        <option value={DrawingMode.DRAW}>Draw</option>
        {/* Add more tools as needed */}
      </select>
      
      {/* Line Color */}
      <div>
        <label htmlFor="lineColor" className="mr-2">Line Color:</label>
        <input
          type="color"
          id="lineColor"
          value={lineColor}
          onChange={(e) => setLineColor(e.target.value)}
        />
      </div>
      
      {/* Line Thickness */}
      <div>
        <label htmlFor="lineThickness" className="mr-2">Line Thickness:</label>
        <input
          type="number"
          id="lineThickness"
          value={lineThickness}
          onChange={(e) => setLineThickness(parseInt(e.target.value))}
          className="w-16 p-2 border rounded"
        />
      </div>
      
      {/* Show Grid Toggle */}
      <div>
        <label htmlFor="showGrid" className="mr-2">Show Grid:</label>
        <input
          type="checkbox"
          id="showGrid"
          checked={showGrid}
          onChange={(e) => setShowGrid(e.target.checked)}
        />
      </div>
    </div>
  );
};
