import React from "react";
// Fix the import to use our mock icons
import { 
  Calculator, 
  Eraser, 
  Hammer, 
  Home, 
  MousePointer, 
  Pencil, 
  Ruler, 
  Square, 
  Type 
} from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { DrawingMode } from "@/constants/drawingModes";

interface DynamicToolsProps {
  activeTool: DrawingMode;
  setActiveTool: (tool: DrawingMode) => void;
}

export const DynamicTools: React.FC<DynamicToolsProps> = ({
  activeTool,
  setActiveTool
}) => {
  return (
    <div className="flex flex-wrap gap-2">
      <Button 
        variant={activeTool === DrawingMode.SELECT ? "default" : "outline"}
        onClick={() => setActiveTool(DrawingMode.SELECT)}
      >
        <MousePointer className="w-4 h-4 mr-2" />
        Select
      </Button>
      
      <Button 
        variant={activeTool === DrawingMode.PENCIL ? "default" : "outline"}
        onClick={() => setActiveTool(DrawingMode.PENCIL)}
      >
        <Pencil className="w-4 h-4 mr-2" />
        Pencil
      </Button>
      
      <Button 
        variant={activeTool === DrawingMode.ERASER ? "default" : "outline"}
        onClick={() => setActiveTool(DrawingMode.ERASER)}
      >
        <Eraser className="w-4 h-4 mr-2" />
        Eraser
      </Button>
      
      <Button 
        variant={activeTool === DrawingMode.RECTANGLE ? "default" : "outline"}
        onClick={() => setActiveTool(DrawingMode.RECTANGLE)}
      >
        <Square className="w-4 h-4 mr-2" />
        Rectangle
      </Button>
      
      <Button 
        variant={activeTool === DrawingMode.TEXT ? "default" : "outline"}
        onClick={() => setActiveTool(DrawingMode.TEXT)}
      >
        <Type className="w-4 h-4 mr-2" />
        Text
      </Button>
      
      <Button 
        variant={activeTool === DrawingMode.MEASURE ? "default" : "outline"}
        onClick={() => setActiveTool(DrawingMode.MEASURE)}
      >
        <Ruler className="w-4 h-4 mr-2" />
        Measure
      </Button>
    </div>
  );
};
