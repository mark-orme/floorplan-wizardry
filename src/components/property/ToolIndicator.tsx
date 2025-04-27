
import React from 'react';
import { DrawingMode } from '@/constants/drawingModes';
import { 
  AiOutlineSelect, 
  AiOutlineEdit, 
  AiOutlineMinus, 
  AiOutlineHome, 
  AiOutlineDelete, 
  AiOutlineHdd 
} from 'react-icons/ai';

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
      case DrawingMode.ERASER: return 'Eraser';
      case DrawingMode.HAND: return 'Pan';
      default: return 'Unknown';
    }
  };

  const getToolIcon = () => {
    switch(activeTool) {
      case DrawingMode.SELECT: return <AiOutlineSelect className="h-4 w-4" />;
      case DrawingMode.DRAW: return <AiOutlineEdit className="h-4 w-4" />;
      case DrawingMode.STRAIGHT_LINE: return <AiOutlineMinus className="h-4 w-4" />;
      case DrawingMode.WALL: return <AiOutlineHome className="h-4 w-4" />;
      case DrawingMode.ERASER: return <AiOutlineDelete className="h-4 w-4" />;
      case DrawingMode.HAND: return <AiOutlineHdd className="h-4 w-4" />; // Replaced AiOutlineHand with AiOutlineHdd
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
