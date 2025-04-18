
import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  Undo, 
  Redo, 
  Trash2, 
  Save,
  Pencil,
  MousePointer,
  Hand,
  Square,
  ZoomIn,
  ZoomOut,
  RotateCw,
  RotateCcw
} from "lucide-react";
import { DrawingMode } from "@/constants/drawingModes";

interface MobileToolbarProps {
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
  onSave: () => void;
  activeTool: DrawingMode;
  onToolChange: (tool: DrawingMode) => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
}

export const MobileToolbar = ({
  onUndo,
  onRedo,
  onClear,
  onSave,
  activeTool,
  onToolChange,
  onZoomIn,
  onZoomOut
}: MobileToolbarProps) => {
  return (
    <div className="fixed bottom-4 left-0 right-0 px-4 z-50">
      <div className="bg-white rounded-lg shadow-lg p-2 flex flex-col gap-2">
        {/* Drawing tools */}
        <div className="flex justify-around items-center border-b border-gray-200 pb-2">
          <Button
            variant={activeTool === DrawingMode.SELECT ? "default" : "ghost"}
            size="icon"
            onClick={() => onToolChange(DrawingMode.SELECT)}
            aria-label="Select tool"
          >
            <MousePointer className="h-5 w-5" />
          </Button>
          <Button
            variant={activeTool === DrawingMode.DRAW ? "default" : "ghost"}
            size="icon"
            onClick={() => onToolChange(DrawingMode.DRAW)}
            aria-label="Draw tool"
          >
            <Pencil className="h-5 w-5" />
          </Button>
          <Button
            variant={activeTool === DrawingMode.HAND ? "default" : "ghost"}
            size="icon"
            onClick={() => onToolChange(DrawingMode.HAND)}
            aria-label="Hand tool"
          >
            <Hand className="h-5 w-5" />
          </Button>
          <Button
            variant={activeTool === DrawingMode.WALL ? "default" : "ghost"}
            size="icon"
            onClick={() => onToolChange(DrawingMode.WALL)}
            aria-label="Wall tool"
          >
            <Square className="h-5 w-5" />
          </Button>
        </div>
        
        {/* Pan and zoom controls */}
        <div className="flex justify-around items-center border-b border-gray-200 pb-2">
          {onZoomIn && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onZoomIn}
              className="flex-1"
              aria-label="Zoom in"
            >
              <ZoomIn className="h-5 w-5" />
            </Button>
          )}
          {onZoomOut && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onZoomOut}
              className="flex-1"
              aria-label="Zoom out"
            >
              <ZoomOut className="h-5 w-5" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={onUndo}
            className="flex-1"
            aria-label="Undo"
          >
            <RotateCcw className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onRedo}
            className="flex-1"
            aria-label="Redo"
          >
            <RotateCw className="h-5 w-5" />
          </Button>
        </div>
        
        {/* Action buttons */}
        <div className="flex justify-around items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={onUndo}
            className="flex-1"
            aria-label="Undo"
          >
            <Undo className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onRedo}
            className="flex-1"
            aria-label="Redo"
          >
            <Redo className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClear}
            className="flex-1"
            aria-label="Clear"
          >
            <Trash2 className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onSave}
            className="flex-1"
            aria-label="Save"
          >
            <Save className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};
