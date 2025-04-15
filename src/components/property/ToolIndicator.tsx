
import React from 'react';
import { DrawingMode } from '@/constants/drawingModes';

interface ToolIndicatorProps {
  activeTool: DrawingMode;
}

export const ToolIndicator: React.FC<ToolIndicatorProps> = ({ activeTool }) => {
  return (
    <div className="absolute top-4 left-4 bg-white/90 p-2 rounded shadow-md z-10">
      <div className="text-sm font-medium">Active Tool: {activeTool}</div>
    </div>
  );
};
