
import React from 'react';
import { Button } from '@/components/ui/button';
import { DrawingMode } from '@/constants/drawingModes';
import { MousePointer, Pencil, Type, Hand, Eraser } from 'lucide-react';
import { StraightLine } from '@/components/icons/StraightLine';

interface ToolSelectorProps {
  activeTool: DrawingMode;
  onToolChange: (tool: DrawingMode) => void;
}

export const ToolSelector: React.FC<ToolSelectorProps> = ({
  activeTool,
  onToolChange,
}) => {
  const tools = [
    { id: DrawingMode.SELECT, name: 'Select', icon: <MousePointer className="h-4 w-4" /> },
    { id: DrawingMode.DRAW, name: 'Freehand', icon: <Pencil className="h-4 w-4" /> },
    { id: DrawingMode.STRAIGHT_LINE, name: 'Line', icon: <StraightLine className="h-4 w-4" /> },
    { id: DrawingMode.RECTANGLE, name: 'Rectangle', icon: "□" },
    { id: DrawingMode.CIRCLE, name: 'Circle', icon: "○" },
    { id: DrawingMode.TEXT, name: 'Text', icon: <Type className="h-4 w-4" /> },
    { id: DrawingMode.MEASURE, name: 'Measure', icon: "📏" },
    { id: DrawingMode.PAN, name: 'Pan', icon: <Hand className="h-4 w-4" /> },
    { id: DrawingMode.ERASER, name: 'Eraser', icon: <Eraser className="h-4 w-4" /> }
  ];
  
  return (
    <div className="flex flex-wrap gap-2 p-4 bg-white w-full max-w-md mx-auto">
      {tools.map((tool) => (
        <Button
          key={tool.id}
          variant={activeTool === tool.id ? 'default' : 'outline'}
          onClick={() => onToolChange(tool.id)}
          className="flex-1 min-w-[100px] h-10 text-sm font-normal justify-start px-3"
        >
          <span className="mr-2">{tool.icon}</span>
          <span>{tool.name}</span>
        </Button>
      ))}
      
      <div className="flex flex-col w-full gap-2 mt-2">
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">Color</span>
          <input
            type="color"
            className="w-8 h-8 p-0 border-0"
            defaultValue="#000000"
          />
        </div>
        
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">Width</span>
          <input
            type="range"
            min="1"
            max="20"
            defaultValue="2"
            className="flex-1"
          />
          <span className="text-sm">2px</span>
        </div>
        
        <div className="flex gap-2 mt-2">
          <Button variant="outline" className="flex-1">Undo</Button>
          <Button variant="outline" className="flex-1">Redo</Button>
          <Button variant="outline" className="flex-1">Clear</Button>
          <Button variant="outline" className="flex-1">Save</Button>
        </div>
      </div>
    </div>
  );
};
