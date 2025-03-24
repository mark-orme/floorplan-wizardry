
import { Button } from "./ui/button";
import { 
  Pencil,
  Ruler, 
  Save, 
  Trash, 
  ZoomIn, 
  ZoomOut, 
  Undo, 
  Redo,
  Hand,
  Palette
} from "lucide-react";
import { cn } from "@/lib/utils";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import { DrawingTool } from "@/hooks/useCanvasState";
import { LineSettings } from "./LineSettings";
import { useState } from "react";

interface DrawingToolbarProps {
  tool: DrawingTool;
  onToolChange: (tool: DrawingTool) => void;
  onUndo: () => void;
  onRedo: () => void;
  onZoom: (direction: "in" | "out") => void;
  onClear: () => void;
  onSave: () => void;
  gia: number;
  lineThickness: number;
  lineColor: string;
  onLineThicknessChange: (thickness: number) => void;
  onLineColorChange: (color: string) => void;
}

/**
 * Drawing toolbar component with labeled tools and tooltips
 * @param {DrawingToolbarProps} props Component properties
 * @returns {JSX.Element} Rendered toolbar component
 */
export const DrawingToolbar = ({
  tool,
  onToolChange,
  onUndo,
  onRedo,
  onZoom,
  onClear,
  onSave,
  gia,
  lineThickness,
  lineColor,
  onLineThicknessChange,
  onLineColorChange
}: DrawingToolbarProps) => {
  const [showLineSettings, setShowLineSettings] = useState(false);

  return (
    <div className="flex flex-col gap-4 mb-4">
      <div className="flex gap-4 mb-4 flex-wrap">
        {/* Tool Selection with hover cards for explanation */}
        <div className="flex gap-2">
          <HoverCard>
            <HoverCardTrigger asChild>
              <Button
                variant={tool === "draw" ? "default" : "outline"}
                onClick={() => onToolChange("draw")}
                className="w-10 h-10 p-0 hover:scale-105 transition-transform"
                aria-label="Freehand Tool"
              >
                <Pencil className="w-4 h-4 transition-colors" />
              </Button>
            </HoverCardTrigger>
            <HoverCardContent className="p-2 text-sm shadow-md">
              <strong>Freehand Tool</strong>
              <p>Draw freely on the canvas</p>
            </HoverCardContent>
          </HoverCard>
          
          <HoverCard>
            <HoverCardTrigger asChild>
              <Button
                variant={tool === "straightLine" ? "default" : "outline"}
                onClick={() => onToolChange("straightLine")}
                className="w-10 h-10 p-0 hover:scale-105 transition-transform"
                aria-label="Straight Line Tool"
              >
                <Ruler className="w-4 h-4 transition-colors" />
              </Button>
            </HoverCardTrigger>
            <HoverCardContent className="p-2 text-sm shadow-md">
              <strong>Wall Tool</strong>
              <p>Draw straight walls with precise measurements</p>
            </HoverCardContent>
          </HoverCard>
          
          <HoverCard>
            <HoverCardTrigger asChild>
              <Button
                variant={tool === "hand" ? "default" : "outline"}
                onClick={() => onToolChange("hand")}
                className="w-10 h-10 p-0 hover:scale-105 transition-transform"
                aria-label="Hand Tool"
              >
                <Hand className="w-4 h-4 transition-colors" />
              </Button>
            </HoverCardTrigger>
            <HoverCardContent className="p-2 text-sm shadow-md">
              <strong>Hand Tool</strong>
              <p>Pan and navigate around the canvas</p>
            </HoverCardContent>
          </HoverCard>
          
          <HoverCard>
            <HoverCardTrigger asChild>
              <Button
                variant={showLineSettings ? "default" : "outline"}
                onClick={() => setShowLineSettings(!showLineSettings)}
                className="w-10 h-10 p-0 hover:scale-105 transition-transform"
                aria-label="Line Settings"
              >
                <Palette className="w-4 h-4 transition-colors" />
              </Button>
            </HoverCardTrigger>
            <HoverCardContent className="p-2 text-sm shadow-md">
              <strong>Line Settings</strong>
              <p>Change line thickness and color</p>
            </HoverCardContent>
          </HoverCard>
        </div>
        
        {/* History Controls */}
        <div className="flex gap-2">
          <HoverCard>
            <HoverCardTrigger asChild>
              <Button
                variant="outline"
                onClick={onUndo}
                className="w-10 h-10 p-0 hover:scale-105 transition-transform hover:bg-gray-100 dark:hover:bg-gray-800"
                aria-label="Undo"
              >
                <Undo className="w-4 h-4 transition-colors" />
              </Button>
            </HoverCardTrigger>
            <HoverCardContent className="p-2 text-sm shadow-md">
              <strong>Undo</strong>
              <p>Reverse the last drawing action</p>
            </HoverCardContent>
          </HoverCard>
          
          <HoverCard>
            <HoverCardTrigger asChild>
              <Button
                variant="outline"
                onClick={onRedo}
                className="w-10 h-10 p-0 hover:scale-105 transition-transform hover:bg-gray-100 dark:hover:bg-gray-800"
                aria-label="Redo"
              >
                <Redo className="w-4 h-4 transition-colors" />
              </Button>
            </HoverCardTrigger>
            <HoverCardContent className="p-2 text-sm shadow-md">
              <strong>Redo</strong>
              <p>Restore the last undone action</p>
            </HoverCardContent>
          </HoverCard>
        </div>
        
        {/* Zoom Controls */}
        <div className="flex gap-2">
          <HoverCard>
            <HoverCardTrigger asChild>
              <Button
                variant="outline"
                onClick={() => onZoom("in")}
                className="w-10 h-10 p-0 hover:scale-105 transition-transform hover:bg-gray-100 dark:hover:bg-gray-800"
                aria-label="Zoom In"
              >
                <ZoomIn className="w-4 h-4 transition-colors" />
              </Button>
            </HoverCardTrigger>
            <HoverCardContent className="p-2 text-sm shadow-md">
              <strong>Zoom In</strong>
              <p>Increase the canvas zoom level</p>
            </HoverCardContent>
          </HoverCard>
          
          <HoverCard>
            <HoverCardTrigger asChild>
              <Button
                variant="outline"
                onClick={() => onZoom("out")}
                className="w-10 h-10 p-0 hover:scale-105 transition-transform hover:bg-gray-100 dark:hover:bg-gray-800"
                aria-label="Zoom Out"
              >
                <ZoomOut className="w-4 h-4 transition-colors" />
              </Button>
            </HoverCardTrigger>
            <HoverCardContent className="p-2 text-sm shadow-md">
              <strong>Zoom Out</strong>
              <p>Decrease the canvas zoom level</p>
            </HoverCardContent>
          </HoverCard>
        </div>
        
        {/* GIA Display */}
        <div className="flex items-center ml-auto mr-4 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-md">
          <span className="text-sm font-medium">GIA: {gia.toFixed(2)} m²</span>
        </div>
        
        {/* Actions */}
        <div className="flex gap-2">
          <HoverCard>
            <HoverCardTrigger asChild>
              <Button
                variant="outline"
                onClick={onClear}
                className="w-10 h-10 p-0 hover:scale-105 transition-transform hover:bg-red-50 dark:hover:bg-red-950"
                aria-label="Clear Canvas"
              >
                <Trash className="w-4 h-4 text-red-500 transition-colors" />
              </Button>
            </HoverCardTrigger>
            <HoverCardContent className="p-2 text-sm shadow-md">
              <strong>Clear Canvas</strong>
              <p>Remove all drawings from the canvas</p>
            </HoverCardContent>
          </HoverCard>
          
          <HoverCard>
            <HoverCardTrigger asChild>
              <Button
                variant="default"
                onClick={onSave}
                className="w-10 h-10 p-0 hover:scale-105 transition-transform"
                aria-label="Save as PNG"
              >
                <Save className="w-4 h-4 transition-colors" />
              </Button>
            </HoverCardTrigger>
            <HoverCardContent className="p-2 text-sm shadow-md">
              <strong>Save</strong>
              <p>Export the floor plan as PNG and save to storage</p>
            </HoverCardContent>
          </HoverCard>
        </div>
      </div>
      
      {/* Line Settings Panel */}
      {showLineSettings && (
        <LineSettings
          thickness={lineThickness}
          color={lineColor}
          onThicknessChange={onLineThicknessChange}
          onColorChange={onLineColorChange}
        />
      )}
    </div>
  );
};

