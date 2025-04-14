
import React from "react";
import { Button } from "@/components/ui/button";
import { 
  MousePointer, 
  Pencil, 
  Square, 
  Circle, 
  LineHorizontal, 
  Eraser 
} from "lucide-react";
import { DrawingMode } from "@/constants/drawingModes";

interface DrawingToolbarProps {
  activeTool: DrawingMode;
  onToolChange: (tool: DrawingMode) => void;
}

export const DrawingToolbar: React.FC<DrawingToolbarProps> = ({
  activeTool,
  onToolChange
}) => {
  const tools = [
    { icon: <MousePointer size={16} />, tool: DrawingMode.SELECT, label: "Select" },
    { icon: <Pencil size={16} />, tool: DrawingMode.DRAW, label: "Draw" },
    { icon: <Square size={16} />, tool: DrawingMode.RECTANGLE, label: "Rectangle" },
    { icon: <Circle size={16} />, tool: DrawingMode.CIRCLE, label: "Circle" },
    { icon: <LineHorizontal size={16} />, tool: DrawingMode.STRAIGHT_LINE, label: "Line" },
    { icon: <Eraser size={16} />, tool: DrawingMode.ERASER, label: "Erase" }
  ];

  return (
    <div className="p-2 bg-white rounded shadow-md">
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
    </div>
  );
};
