
import React from 'react';
import { Button } from '@/components/ui/button';
import { DrawingMode } from '@/constants/drawingModes';
import { CircleSquare } from 'lucide-react';

interface ShapeToolsProps {
  activeTool: DrawingMode;
  onSelectTool: (tool: DrawingMode) => void;
}

const ShapeTools: React.FC<ShapeToolsProps> = ({ activeTool, onSelectTool }) => {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">Advanced Shapes</h3>
      <div className="grid grid-cols-2 gap-2">
        <Button
          variant={activeTool === DrawingMode.RECTANGLE ? "default" : "outline"}
          size="sm"
          onClick={() => onSelectTool(DrawingMode.RECTANGLE)}
          className="flex items-center gap-2"
        >
          <CircleSquare size={16} />
          Shapes
        </Button>
      </div>
    </div>
  );
};

// For plugin registration
const plugin = {
  id: 'shape-tools',
  name: 'Shape Tools',
  description: 'Advanced shapes and drawing tools',
  mode: DrawingMode.RECTANGLE,
  version: '1.0.0'
};

export default ShapeTools;
