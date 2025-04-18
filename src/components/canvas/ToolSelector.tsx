
import React from 'react';
import { Button } from '@/components/ui/button';
import { DrawingMode } from '@/constants/drawingModes';
import { MousePointer, Pencil, Type, Hand, Eraser } from 'lucide-react';
import { StraightLine } from '@/components/icons/StraightLine';

interface ToolSelectorProps {
  activeTool: DrawingMode;
  onToolChange: (tool: DrawingMode) => void;
  orientation?: 'horizontal' | 'vertical';
  compact?: boolean;
  lineColor?: string;
  lineThickness?: number;
  onLineColorChange?: (color: string) => void;
  onLineThicknessChange?: (thickness: number) => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onClear?: () => void;
  onSave?: () => void;
}

export const ToolSelector: React.FC<ToolSelectorProps> = ({
  activeTool,
  onToolChange,
  orientation = 'vertical',
  compact = false,
  lineColor = '#000000',
  lineThickness = 2,
  onLineColorChange,
  onLineThicknessChange,
  onUndo,
  onRedo,
  onClear,
  onSave
}) => {
  const tools = [
    { id: DrawingMode.SELECT, name: 'Select', icon: <MousePointer className="h-4 w-4" /> },
    { id: DrawingMode.DRAW, name: 'Freehand', icon: <Pencil className="h-4 w-4" /> },
    { id: DrawingMode.STRAIGHT_LINE, name: 'Line', icon: <StraightLine className="h-4 w-4" size={16} /> },
    { id: DrawingMode.RECTANGLE, name: 'Rectangle', icon: "□" },
    { id: DrawingMode.CIRCLE, name: 'Circle', icon: "○" },
    { id: DrawingMode.TEXT, name: 'Text', icon: <Type className="h-4 w-4" /> },
    { id: DrawingMode.MEASURE, name: 'Measure', icon: "📏" },
    { id: DrawingMode.PAN, name: 'Pan', icon: <Hand className="h-4 w-4" /> },
    { id: DrawingMode.ERASER, name: 'Eraser', icon: <Eraser className="h-4 w-4" /> }
  ];
  
  // If in compact/horizontal mode (for mobile), render a simplified version
  if (compact && orientation === 'horizontal') {
    return (
      <div className="flex flex-col gap-2 w-full max-w-md mx-auto px-2">
        <div className="flex flex-wrap gap-1">
          {tools.map((tool) => (
            <Button
              key={tool.id}
              size="sm"
              variant={activeTool === tool.id ? 'default' : 'outline'}
              onClick={() => onToolChange(tool.id)}
              className="flex-1 min-w-[80px] h-10"
              title={tool.name}
            >
              <span className="mr-1">{tool.icon}</span>
              {tool.name}
            </Button>
          ))}
        </div>
        
        <div className="flex flex-col w-full gap-2">
          <div className="flex items-center gap-2">
            <span className="text-sm w-16">Color:</span>
            <input
              type="color"
              className="w-8 h-8 p-0 border-0"
              value={lineColor}
              onChange={(e) => onLineColorChange?.(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm w-16">Width:</span>
            <input
              type="range"
              min="1"
              max="20"
              value={lineThickness}
              onChange={(e) => onLineThicknessChange?.(parseInt(e.target.value))}
              className="flex-1"
            />
            <span className="text-sm w-10">{lineThickness}px</span>
          </div>
          
          <div className="flex gap-2 mt-2">
            <Button variant="outline" className="flex-1" onClick={onUndo}>Undo</Button>
            <Button variant="outline" className="flex-1" onClick={onRedo}>Redo</Button>
            <Button variant="outline" className="flex-1" onClick={onClear}>Clear</Button>
            <Button variant="outline" className="flex-1" onClick={onSave}>Save</Button>
          </div>
        </div>
      </div>
    );
  }
  
  // Standard full version with all tools and controls
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
            value={lineColor}
            onChange={(e) => onLineColorChange?.(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">Width</span>
          <input
            type="range"
            min="1"
            max="20"
            value={lineThickness}
            onChange={(e) => onLineThicknessChange?.(parseInt(e.target.value))}
            className="flex-1"
          />
          <span className="text-sm">{lineThickness}px</span>
        </div>
        
        <div className="flex gap-2 mt-2">
          <Button variant="outline" className="flex-1" onClick={onUndo}>Undo</Button>
          <Button variant="outline" className="flex-1" onClick={onRedo}>Redo</Button>
          <Button variant="outline" className="flex-1" onClick={onClear}>Clear</Button>
          <Button variant="outline" className="flex-1" onClick={onSave}>Save</Button>
        </div>
      </div>
    </div>
  );
};
