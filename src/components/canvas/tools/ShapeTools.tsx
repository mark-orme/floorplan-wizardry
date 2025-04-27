
import React, { useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { DrawingMode } from '@/constants/drawingModes';
import { 
  AiOutlineAppstore, 
  AiOutlineBorder, 
  AiOutlineEdit 
} from 'react-icons/ai';

interface ShapeToolsProps {
  activeTool: DrawingMode;
  onSelectTool: (tool: DrawingMode) => void;
}

const ShapeTools: React.FC<ShapeToolsProps> = ({ activeTool, onSelectTool }) => {
  const handleRectangleClick = useCallback(() => {
    onSelectTool(DrawingMode.RECTANGLE);
  }, [onSelectTool]);

  const handleCircleClick = useCallback(() => {
    onSelectTool(DrawingMode.CIRCLE);
  }, [onSelectTool]);

  const handleTextClick = useCallback(() => {
    onSelectTool(DrawingMode.TEXT);
  }, [onSelectTool]);

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-sm font-medium">Shape Tools</h3>
      <div className="flex space-x-1">
        <Button 
          variant={activeTool === DrawingMode.RECTANGLE ? "default" : "outline"}
          size="sm"
          onClick={handleRectangleClick}
          title="Rectangle"
        >
          <AiOutlineAppstore className="h-4 w-4" />
          <span className="sr-only">Rectangle</span>
        </Button>
        <Button 
          variant={activeTool === DrawingMode.CIRCLE ? "default" : "outline"}
          size="sm"
          onClick={handleCircleClick}
          title="Circle"
        >
          <AiOutlineBorder className="h-4 w-4" />
          <span className="sr-only">Circle</span>
        </Button>
        <Button 
          variant={activeTool === DrawingMode.TEXT ? "default" : "outline"}
          size="sm"
          onClick={handleTextClick}
          title="Text"
        >
          <AiOutlineEdit className="h-4 w-4" />
          <span className="sr-only">Text</span>
        </Button>
      </div>
    </div>
  );
};

export default ShapeTools;
