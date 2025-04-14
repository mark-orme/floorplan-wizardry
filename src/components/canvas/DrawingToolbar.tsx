
import React from "react";
import { Button } from "@/components/ui/button";
import { 
  MousePointer, 
  Pencil, 
  Square, 
  Circle, 
  Minus, // Changed from LineHorizontal to Minus
  Eraser 
} from "lucide-react";
import { DrawingMode } from "@/constants/drawingModes";

interface DrawingToolbarProps {
  activeTool: DrawingMode;
  onToolChange: (tool: DrawingMode) => void;
  lineColor?: string;
  lineThickness?: number;
  onLineColorChange?: (color: string) => void;
  onLineThicknessChange?: (thickness: number) => void;
}

export const DrawingToolbar: React.FC<DrawingToolbarProps> = ({
  activeTool,
  onToolChange,
  lineColor = "#000000",
  lineThickness = 2,
  onLineColorChange,
  onLineThicknessChange
}) => {
  const tools = [
    { icon: <MousePointer size={16} />, tool: DrawingMode.SELECT, label: "Select" },
    { icon: <Pencil size={16} />, tool: DrawingMode.DRAW, label: "Draw" },
    { icon: <Square size={16} />, tool: DrawingMode.RECTANGLE, label: "Rectangle" },
    { icon: <Circle size={16} />, tool: DrawingMode.CIRCLE, label: "Circle" },
    { icon: <Minus size={16} />, tool: DrawingMode.STRAIGHT_LINE, label: "Line" },
    { icon: <Eraser size={16} />, tool: DrawingMode.ERASER, label: "Erase" }
  ];

  return (
    <div className="p-2 bg-white rounded shadow-md">
      <div className="flex flex-col gap-2">
        <div className="flex gap-1">
          {tools.map(({ icon, tool, label }) => (
            <Button
              key={tool}
              variant={activeTool === tool ? "default" : "outline"}
              size="sm"
              onClick={() => onToolChange(tool)}
              title={label}
            >
              {icon}
            </Button>
          ))}
        </div>
        
        {/* Add color and thickness controls */}
        {onLineColorChange && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600">Color:</span>
            <input 
              type="color" 
              value={lineColor} 
              onChange={(e) => onLineColorChange(e.target.value)}
              className="w-8 h-6 border-none"
            />
          </div>
        )}
        
        {onLineThicknessChange && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600">Thickness:</span>
            <input
              type="range"
              min="1"
              max="10"
              value={lineThickness}
              onChange={(e) => onLineThicknessChange(parseInt(e.target.value, 10))}
              className="w-24"
            />
            <span className="text-xs">{lineThickness}px</span>
          </div>
        )}
      </div>
    </div>
  );
};
