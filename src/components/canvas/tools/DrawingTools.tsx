
import React from 'react';
import { Button } from '@/components/ui/button';
import { DrawingMode } from '@/constants/drawingModes';
import { 
  MousePointer2 as MousePointer, 
  PenLine as Pencil, 
  Eraser 
} from 'lucide-react';

interface DrawingToolsProps {
  activeTool: DrawingMode;
  onSelectTool: (tool: DrawingMode) => void;
}

const DrawingTools: React.FC<DrawingToolsProps> = ({ activeTool, onSelectTool }) => {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">Drawing Tools</h3>
      <div className="grid grid-cols-2 gap-2">
        <Button
          variant={activeTool === DrawingMode.SELECT ? "default" : "outline"}
          size="sm"
          onClick={() => onSelectTool(DrawingMode.SELECT)}
          className="flex items-center gap-2"
        >
          <MousePointer size={16} />
          Select
        </Button>
        <Button
          variant={activeTool === DrawingMode.DRAW ? "default" : "outline"}
          size="sm"
          onClick={() => onSelectTool(DrawingMode.DRAW)}
          className="flex items-center gap-2"
        >
          <Pencil size={16} />
          Draw
        </Button>
        <Button
          variant={activeTool === DrawingMode.ERASER ? "default" : "outline"}
          size="sm"
          onClick={() => onSelectTool(DrawingMode.ERASER)}
          className="flex items-center gap-2"
        >
          <Eraser size={16} />
          Eraser
        </Button>
      </div>
    </div>
  );
};

const plugin = {
  id: 'drawing-tools',
  name: 'Drawing Tools',
  description: 'Basic tools for drawing and selection',
  mode: DrawingMode.SELECT,
  version: '1.0.0'
};

export default DrawingTools;
