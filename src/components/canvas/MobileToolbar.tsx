
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
  Square
} from "lucide-react";
import { DrawingMode } from "@/constants/drawingModes";

interface MobileToolbarProps {
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
  onSave: () => void;
  activeTool: DrawingMode;
  onToolChange: (tool: DrawingMode) => void;
}

export const MobileToolbar = ({
  onUndo,
  onRedo,
  onClear,
  onSave,
  activeTool,
  onToolChange
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
          >
            <MousePointer className="h-5 w-5" />
          </Button>
          <Button
            variant={activeTool === DrawingMode.DRAW ? "default" : "ghost"}
            size="icon"
            onClick={() => onToolChange(DrawingMode.DRAW)}
          >
            <Pencil className="h-5 w-5" />
          </Button>
          <Button
            variant={activeTool === DrawingMode.HAND ? "default" : "ghost"}
            size="icon"
            onClick={() => onToolChange(DrawingMode.HAND)}
          >
            <Hand className="h-5 w-5" />
          </Button>
          <Button
            variant={activeTool === DrawingMode.WALL ? "default" : "ghost"}
            size="icon"
            onClick={() => onToolChange(DrawingMode.WALL)}
          >
            <Square className="h-5 w-5" />
          </Button>
        </div>
        
        {/* Action buttons */}
        <div className="flex justify-around items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={onUndo}
            className="flex-1"
          >
            <Undo className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onRedo}
            className="flex-1"
          >
            <Redo className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClear}
            className="flex-1"
          >
            <Trash2 className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onSave}
            className="flex-1"
          >
            <Save className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};
