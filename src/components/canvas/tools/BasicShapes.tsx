import React from 'react';
import { Button } from '@/components/ui/button';
import { DrawingMode } from '@/constants/drawingModes';
import { 
  AiOutlineBorder,
  AiOutlineQuestionCircle 
} from 'react-icons/ai';

interface BasicShapesProps {
  activeTool: DrawingMode;
  onSelectTool: (tool: DrawingMode) => void;
}

const BasicShapes: React.FC<BasicShapesProps> = ({ activeTool, onSelectTool }) => {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">Basic Shapes</h3>
      <div className="grid grid-cols-2 gap-2">
        <Button
          variant={activeTool === DrawingMode.RECTANGLE ? "default" : "outline"}
          size="sm"
          onClick={() => onSelectTool(DrawingMode.RECTANGLE)}
          className="flex items-center gap-2"
        >
          <AiOutlineBorder size={16} />
          Rectangle
        </Button>
        <Button
          variant={activeTool === DrawingMode.CIRCLE ? "default" : "outline"}
          size="sm"
          onClick={() => onSelectTool(DrawingMode.CIRCLE)}
          className="flex items-center gap-2"
        >
          <AiOutlineQuestionCircle size={16} />
          Circle
        </Button>
      </div>
    </div>
  );
};

// For plugin registration
const plugin = {
  id: 'basic-shapes',
  name: 'Basic Shapes',
  description: 'Tools for drawing basic shapes',
  mode: DrawingMode.RECTANGLE,
  version: '1.0.0'
};

export default BasicShapes;
