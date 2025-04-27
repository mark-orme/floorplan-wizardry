
import React from 'react';
import { Button } from '@/components/ui/button';
import { DrawingMode } from '@/constants/drawingModes';
import { 
  AiOutlineSelect, 
  AiOutlineEdit, 
  AiOutlineDelete 
} from 'react-icons/ai';

interface DrawingToolsProps {
  activeTool: DrawingMode;
  onSelectTool: (tool: DrawingMode) => void;
}

export const DrawingTools: React.FC<DrawingToolsProps> = ({ activeTool, onSelectTool }) => {
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
          <AiOutlineSelect size={16} />
          Select
        </Button>
        <Button
          variant={activeTool === DrawingMode.DRAW ? "default" : "outline"}
          size="sm"
          onClick={() => onSelectTool(DrawingMode.DRAW)}
          className="flex items-center gap-2"
        >
          <AiOutlineEdit size={16} />
          Draw
        </Button>
        <Button
          variant={activeTool === DrawingMode.ERASER ? "default" : "outline"}
          size="sm"
          onClick={() => onSelectTool(DrawingMode.ERASER)}
          className="flex items-center gap-2"
        >
          <AiOutlineDelete size={16} />
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
