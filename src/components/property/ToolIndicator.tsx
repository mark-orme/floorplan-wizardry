
import React from 'react';
import { DrawingMode } from '@/constants/drawingModes';
import { Badge } from '@/components/ui/badge';
import { 
  AiOutlineSelect, 
  AiOutlineEdit, 
  AiOutlineArrowRight, 
  AiOutlineSquare, 
  AiOutlineCircle, 
  AiOutlineHolding, 
  AiOutlineDelete, 
  AiOutlineHome 
} from 'react-icons/ai';

interface ToolIndicatorProps {
  activeTool: DrawingMode;
}

export const ToolIndicator: React.FC<ToolIndicatorProps> = ({
  activeTool
}) => {
  let icon = <AiOutlineSelect className="h-3.5 w-3.5" />;
  let label = 'Select';
  
  switch (activeTool) {
    case DrawingMode.SELECT:
      icon = <AiOutlineSelect className="h-3.5 w-3.5" />;
      label = 'Select';
      break;
    case DrawingMode.DRAW:
      icon = <AiOutlineEdit className="h-3.5 w-3.5" />;
      label = 'Draw';
      break;
    case DrawingMode.STRAIGHT_LINE:
    case DrawingMode.LINE:
      icon = <AiOutlineArrowRight className="h-3.5 w-3.5" />;
      label = 'Line';
      break;
    case DrawingMode.RECTANGLE:
      icon = <AiOutlineSquare className="h-3.5 w-3.5" />;
      label = 'Rectangle';
      break;
    case DrawingMode.CIRCLE:
      icon = <AiOutlineCircle className="h-3.5 w-3.5" />;
      label = 'Circle';
      break;
    case DrawingMode.HAND:
    case DrawingMode.PAN:
      icon = <AiOutlineHolding className="h-3.5 w-3.5" />;
      label = 'Pan';
      break;
    case DrawingMode.ERASER:
      icon = <AiOutlineDelete className="h-3.5 w-3.5" />;
      label = 'Eraser';
      break;
    case DrawingMode.WALL:
    case DrawingMode.ROOM:
      icon = <AiOutlineHome className="h-3.5 w-3.5" />;
      label = activeTool === DrawingMode.WALL ? 'Wall' : 'Room';
      break;
  }
  
  return (
    <Badge variant="outline" className="absolute top-4 right-20 z-10 bg-white/90 flex items-center gap-1.5">
      {icon}
      <span>{label}</span>
    </Badge>
  );
};
