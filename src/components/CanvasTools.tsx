
import React from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { DrawingMode } from '@/constants/drawingModes';
import { Button } from '@/components/ui/button';
import { 
  Pencil, 
  Square, 
  Circle, 
  Undo, 
  Redo, 
  MousePointer, 
  Trash
} from 'lucide-react';
import { StraightLine } from '@/components/icons/StraightLine';

interface CanvasToolsProps {
  tool: DrawingMode;
  setTool: (tool: DrawingMode) => void;
  lineColor: string;
  setLineColor: (color: string) => void;
  lineThickness: number;
  setLineThickness: (thickness: number) => void;
  canvas: FabricCanvas;
  undo: () => void;
  redo: () => void;
}

export const CanvasTools: React.FC<CanvasToolsProps> = ({
  tool,
  setTool,
  lineColor,
  setLineColor,
  lineThickness,
  setLineThickness,
  canvas,
  undo,
  redo
}) => {
  const handleToolClick = (newTool: DrawingMode) => {
    setTool(newTool);
    
    // Configure canvas based on tool
    if (newTool === DrawingMode.DRAW) {
      canvas.isDrawingMode = true;
      canvas.selection = false;
    } else if (newTool === DrawingMode.STRAIGHT_LINE) {
      canvas.isDrawingMode = false;
      canvas.selection = false;
    } else {
      canvas.isDrawingMode = false;
      canvas.selection = newTool === DrawingMode.SELECT;
    }
    
    // Update free drawing brush if in drawing mode
    if (canvas.isDrawingMode && canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.color = lineColor;
      canvas.freeDrawingBrush.width = lineThickness;
    }
  };
  
  const handleClear = () => {
    if (!canvas) return;
    
    // Save current state to undo stack before clearing
    
    // Clear all objects
    canvas.clear();
    canvas.backgroundColor = '#ffffff';
    canvas.renderAll();
  };
  
  return (
    <div className="flex flex-wrap gap-2 p-2 bg-white rounded-lg shadow">
      <Button 
        variant={tool === DrawingMode.SELECT ? 'default' : 'outline'} 
        size="sm" 
        onClick={() => handleToolClick(DrawingMode.SELECT)}
      >
        <MousePointer className="h-4 w-4 mr-1" />
        Select
      </Button>
      
      <Button 
        variant={tool === DrawingMode.DRAW ? 'default' : 'outline'} 
        size="sm" 
        onClick={() => handleToolClick(DrawingMode.DRAW)}
      >
        <Pencil className="h-4 w-4 mr-1" />
        Draw
      </Button>
      
      <Button 
        variant={tool === DrawingMode.STRAIGHT_LINE ? 'default' : 'outline'} 
        size="sm" 
        onClick={() => handleToolClick(DrawingMode.STRAIGHT_LINE)}
      >
        <StraightLine className="h-4 w-4 mr-1" />
        Line
      </Button>
      
      <Button 
        variant={tool === DrawingMode.RECT ? 'default' : 'outline'} 
        size="sm" 
        onClick={() => handleToolClick(DrawingMode.RECT)}
      >
        <Square className="h-4 w-4 mr-1" />
        Rectangle
      </Button>
      
      <Button 
        variant={tool === DrawingMode.CIRCLE ? 'default' : 'outline'} 
        size="sm" 
        onClick={() => handleToolClick(DrawingMode.CIRCLE)}
      >
        <Circle className="h-4 w-4 mr-1" />
        Circle
      </Button>
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={undo}
      >
        <Undo className="h-4 w-4" />
      </Button>
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={redo}
      >
        <Redo className="h-4 w-4" />
      </Button>
      
      <Button 
        variant="destructive" 
        size="sm" 
        onClick={handleClear}
      >
        <Trash className="h-4 w-4 mr-1" />
        Clear
      </Button>
      
      <div className="flex items-center gap-2 ml-auto">
        <label className="text-sm">Color:</label>
        <input 
          type="color" 
          value={lineColor} 
          onChange={(e) => setLineColor(e.target.value)} 
          className="w-8 h-8 rounded cursor-pointer"
        />
        
        <label className="text-sm ml-2">Thickness:</label>
        <input 
          type="range" 
          min="1" 
          max="10" 
          value={lineThickness} 
          onChange={(e) => setLineThickness(parseInt(e.target.value))} 
          className="w-20"
        />
      </div>
    </div>
  );
};
