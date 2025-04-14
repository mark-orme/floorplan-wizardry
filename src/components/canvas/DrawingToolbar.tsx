import React from "react";
import { Button } from "@/components/ui/button";
import { 
  MousePointer, 
  Pencil, 
  Square, 
  Circle, 
  Minus,
  Eraser
} from "lucide-react";
import { Wall } from "@/components/icons/Wall";
import { DrawingMode } from "@/constants/drawingModes";

interface DrawingToolbarProps {
  activeTool: DrawingMode;
  onToolChange: (tool: DrawingMode) => void;
  lineColor?: string;
  lineThickness?: number;
  wallColor?: string;
  wallThickness?: number;
  onLineColorChange?: (color: string) => void;
  onLineThicknessChange?: (thickness: number) => void;
  onWallColorChange?: (color: string) => void;
  onWallThicknessChange?: (thickness: number) => void;
}

export const DrawingToolbar: React.FC<DrawingToolbarProps> = ({
  activeTool,
  onToolChange,
  lineColor = "#000000",
  lineThickness = 2,
  wallColor = "#333333",
  wallThickness = 4,
  onLineColorChange,
  onLineThicknessChange,
  onWallColorChange,
  onWallThicknessChange
}) => {
  const tools = [
    { icon: <MousePointer size={16} />, tool: DrawingMode.SELECT, label: "Select" },
    { icon: <Pencil size={16} />, tool: DrawingMode.DRAW, label: "Draw" },
    { icon: <Wall size={16} />, tool: DrawingMode.WALL, label: "Wall" },
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
        
        {activeTool === DrawingMode.WALL ? (
          <>
            {onWallColorChange && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600">Wall Color:</span>
                <input 
                  type="color" 
                  value={wallColor} 
                  onChange={(e) => onWallColorChange(e.target.value)}
                  className="w-8 h-6 border-none"
                />
              </div>
            )}
            
            {onWallThicknessChange && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600">Wall Thickness:</span>
                <input
                  type="range"
                  min="2"
                  max="20"
                  value={wallThickness}
                  onChange={(e) => onWallThicknessChange(parseInt(e.target.value, 10))}
                  className="w-24"
                />
                <span className="text-xs">{wallThickness}px</span>
              </div>
            )}
          </>
        ) : (
          <>
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
          </>
        )}
      </div>
    </div>
  );
};
