import React from 'react';
import { Button } from '@/components/ui/button';
import { DrawingMode } from '@/constants/drawingModes';
import { AiOutlineBuild } from 'react-icons/ai';

interface WallBuilderProps {
  activeTool: DrawingMode;
  onSelectTool: (tool: DrawingMode) => void;
}

const WallBuilder: React.FC<WallBuilderProps> = ({ activeTool, onSelectTool }) => {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">Wall Builder</h3>
      <div className="grid grid-cols-1 gap-2">
        <Button
          variant={activeTool === DrawingMode.WALL ? "default" : "outline"}
          size="sm"
          onClick={() => onSelectTool(DrawingMode.WALL)}
          className="flex items-center gap-2"
        >
          <AiOutlineBuild size={16} />
          Wall Tool
        </Button>
      </div>
    </div>
  );
};

const plugin = {
  id: 'wall-builder',
  name: 'Wall Builder',
  description: 'Tools for creating and editing walls',
  mode: DrawingMode.WALL,
  version: '1.0.0'
};

export default WallBuilder;
