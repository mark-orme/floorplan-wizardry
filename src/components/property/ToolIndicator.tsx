
import React from 'react';
import { DrawingMode } from '@/constants/drawingModes';
import { Icons } from '@/constants/iconMappings';

interface ToolIndicatorProps {
  activeTool: DrawingMode;
}

export const ToolIndicator: React.FC<ToolIndicatorProps> = ({
  activeTool
}) => {
  const getToolName = () => {
    switch(activeTool) {
      case DrawingMode.SELECT: return 'Select';
      case DrawingMode.DRAW: return 'Draw';
      case DrawingMode.STRAIGHT_LINE: return 'Line';
      case DrawingMode.WALL: return 'Wall';
      case DrawingMode.ROOM: return 'Room';
      case DrawingMode.ERASER: return 'Eraser';
      case DrawingMode.HAND: return 'Pan';
      default: return 'Unknown';
    }
  };

  const getToolIcon = () => {
    switch(activeTool) {
      case DrawingMode.SELECT: return <Icons.select className="h-4 w-4" />;
      case DrawingMode.DRAW: return <Icons.edit className="h-4 w-4" />;
      case DrawingMode.STRAIGHT_LINE: return <Icons.minus className="h-4 w-4" />;
      case DrawingMode.WALL: return <Icons.home className="h-4 w-4" />;
      case DrawingMode.ERASER: return <Icons.delete className="h-4 w-4" />;
      case DrawingMode.HAND: return <Icons.holder className="h-4 w-4" />;
      default: return <Icons.warning className="h-4 w-4" />;
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
