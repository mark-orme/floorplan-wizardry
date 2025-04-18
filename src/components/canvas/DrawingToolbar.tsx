
import React from "react";
import { Button } from "@/components/ui/button";
import { 
  MousePointer, 
  Pencil, 
  Square, 
  Circle, 
  Minus,
  Type,
  Ruler,
  Hand,
  Eraser
} from "lucide-react";
import { DrawingMode } from "@/constants/drawingModes";
import { useDrawingContext } from "@/contexts/DrawingContext";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface DrawingToolbarProps {
  onSave?: () => void;
  onClear?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
}

export const DrawingToolbar: React.FC<DrawingToolbarProps> = ({
  onSave,
  onClear,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false
}) => {
  const { 
    activeTool, 
    setActiveTool, 
    lineColor, 
    setLineColor, 
    lineThickness, 
    setLineThickness
  } = useDrawingContext();

  const tools = [
    { mode: DrawingMode.SELECT, icon: <MousePointer size={18} />, label: "Select" },
    { mode: DrawingMode.DRAW, icon: <Pencil size={18} />, label: "Freehand" },
    { mode: DrawingMode.STRAIGHT_LINE, icon: <Minus size={18} />, label: "Line" },
    { mode: DrawingMode.RECTANGLE, icon: <Square size={18} />, label: "Rectangle" },
    { mode: DrawingMode.CIRCLE, icon: <Circle size={18} />, label: "Circle" },
    { mode: DrawingMode.TEXT, icon: <Type size={18} />, label: "Text" },
    { mode: DrawingMode.MEASURE, icon: <Ruler size={18} />, label: "Measure" },
    { mode: DrawingMode.PAN, icon: <Hand size={18} />, label: "Pan" },
    { mode: DrawingMode.ERASER, icon: <Eraser size={18} />, label: "Eraser" }
  ];

  return (
    <div className="p-2 bg-white border-b flex flex-wrap items-center gap-2">
      <TooltipProvider>
        <div className="flex flex-wrap gap-1">
          {tools.map((tool) => (
            <Tooltip key={tool.mode}>
              <TooltipTrigger asChild>
                <Button
                  variant={activeTool === tool.mode ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveTool(tool.mode)}
                  className="h-9 px-2.5"
                >
                  {tool.icon}
                  <span className="ml-1 text-xs">{tool.label}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{tool.label}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </TooltipProvider>

      <Separator orientation="vertical" className="h-8 mx-1" />

      <div className="flex items-center gap-2">
        <div className="flex flex-col gap-1">
          <label htmlFor="line-color" className="text-xs text-gray-500">Color</label>
          <input
            id="line-color"
            type="color"
            value={lineColor}
            onChange={(e) => setLineColor(e.target.value)}
            className="w-8 h-8 border-0 p-0 rounded"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="line-thickness" className="text-xs text-gray-500">Width</label>
          <div className="flex items-center gap-1">
            <input
              id="line-thickness"
              type="range"
              min="1"
              max="20"
              value={lineThickness}
              onChange={(e) => setLineThickness(parseInt(e.target.value))}
              className="w-24 h-8"
            />
            <span className="text-xs w-6">{lineThickness}px</span>
          </div>
        </div>
      </div>

      <Separator orientation="vertical" className="h-8 mx-1" />

      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={onUndo}
          disabled={!canUndo}
          className="h-9"
        >
          Undo
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onRedo}
          disabled={!canRedo}
          className="h-9"
        >
          Redo
        </Button>
        {onClear && (
          <Button
            variant="outline"
            size="sm"
            onClick={onClear}
            className="h-9"
          >
            Clear
          </Button>
        )}
        {onSave && (
          <Button
            variant="outline"
            size="sm"
            onClick={onSave}
            className="h-9"
          >
            Save
          </Button>
        )}
      </div>
    </div>
  );
};

