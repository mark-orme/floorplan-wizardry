import React from 'react';
import { Icons } from '@/components/icons';
import { DrawingMode } from '@/constants/drawingModes';

interface ToolIndicatorProps {
  activeTool: DrawingMode;
}

export const ToolIndicator: React.FC<ToolIndicatorProps> = ({ activeTool }) => {
  const getToolName = () => {
    switch(activeTool) {
      case DrawingMode.SELECT: return 'Select';
      case DrawingMode.DRAW: return 'Draw';
      case DrawingMode.STRAIGHT_LINE: return 'Line';
      case DrawingMode.WALL: return 'Wall';
      case DrawingMode.ERASER: return 'Eraser';
      case DrawingMode.HAND: return 'Pan';
      default: return 'Unknown';
    }
  };

  const getToolIcon = () => {
    switch(activeTool) {
      case DrawingMode.SELECT: return <Icons.mousePointer className="h-4 w-4" />;
      case DrawingMode.DRAW: return <Icons.pencil className="h-4 w-4" />;
      case DrawingMode.STRAIGHT_LINE: return <Icons.penLine className="h-4 w-4" />;
      case DrawingMode.WALL: return <Icons.home className="h-4 w-4" />;
      case DrawingMode.ERASER: return <Icons.eraser className="h-4 w-4" />;
      case DrawingMode.HAND: return <Icons.hand className="h-4 w-4" />;
      default: return null;
    }
  };

  return (
    <div className="absolute top-4 left-4 bg-white/80 px-3 py-2 rounded-md shadow-md z-10">
      <div className="flex items-center gap-2">
        {getToolIcon()}
        <span className="font-medium">{getToolName()}</span>
      </div>
    </div>
  );
};
