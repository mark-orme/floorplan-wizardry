
import React from 'react';
import { DrawingMode } from '@/constants/drawingModes';
import { Badge } from '@/components/ui/badge';
import { 
  MousePointer, 
  Pencil, 
  ArrowRight, 
  Square, 
  Circle, 
  Hand, 
  Eraser, 
  Home 
} from 'lucide-react';

interface ToolIndicatorProps {
  activeTool: DrawingMode;
}

export const ToolIndicator: React.FC<ToolIndicatorProps> = ({
  activeTool
}) => {
  let icon = <MousePointer className="h-3.5 w-3.5" />;
  let label = 'Select';
  
  switch (activeTool) {
    case DrawingMode.SELECT:
      icon = <MousePointer className="h-3.5 w-3.5" />;
      label = 'Select';
      break;
    case DrawingMode.DRAW:
      icon = <Pencil className="h-3.5 w-3.5" />;
      label = 'Draw';
      break;
    case DrawingMode.STRAIGHT_LINE:
    case DrawingMode.LINE:
      icon = <ArrowRight className="h-3.5 w-3.5" />;
      label = 'Line';
      break;
    case DrawingMode.RECTANGLE:
      icon = <Square className="h-3.5 w-3.5" />;
      label = 'Rectangle';
      break;
    case DrawingMode.CIRCLE:
      icon = <Circle className="h-3.5 w-3.5" />;
      label = 'Circle';
      break;
    case DrawingMode.HAND:
    case DrawingMode.PAN:
      icon = <Hand className="h-3.5 w-3.5" />;
      label = 'Pan';
      break;
    case DrawingMode.ERASER:
      icon = <Eraser className="h-3.5 w-3.5" />;
      label = 'Eraser';
      break;
    case DrawingMode.WALL:
    case DrawingMode.ROOM:
      icon = <Home className="h-3.5 w-3.5" />;
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
