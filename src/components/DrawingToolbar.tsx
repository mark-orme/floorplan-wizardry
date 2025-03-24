
import { Button } from "./ui/button";
import { 
  Pencil,
  Square, 
  Ruler, 
  Save, 
  Trash, 
  ZoomIn, 
  ZoomOut, 
  Undo, 
  Redo 
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DrawingToolbarProps {
  tool: "draw" | "room" | "straightLine";
  onToolChange: (tool: "draw" | "room" | "straightLine") => void;
  onUndo: () => void;
  onRedo: () => void;
  onZoom: (direction: "in" | "out") => void;
  onClear: () => void;
  onSave: () => void;
  gia: number;
}

export const DrawingToolbar = ({
  tool,
  onToolChange,
  onUndo,
  onRedo,
  onZoom,
  onClear,
  onSave,
  gia,
}: DrawingToolbarProps) => {
  return (
    <div className="flex gap-4 mb-4 flex-wrap">
      {/* Tool Selection */}
      <div className="flex gap-2">
        <Button
          variant={tool === "draw" ? "default" : "outline"}
          onClick={() => onToolChange("draw")}
          className="w-10 h-10 p-0 hover:scale-105 transition-transform"
          title="Freehand Tool"
        >
          <Pencil className="w-4 h-4 transition-colors" />
        </Button>
        <Button
          variant={tool === "straightLine" ? "default" : "outline"}
          onClick={() => onToolChange("straightLine")}
          className="w-10 h-10 p-0 hover:scale-105 transition-transform"
          title="Straight Line Tool"
        >
          <Ruler className="w-4 h-4 transition-colors" />
        </Button>
        <Button
          variant={tool === "room" ? "default" : "outline"}
          onClick={() => onToolChange("room")}
          className="w-10 h-10 p-0 hover:scale-105 transition-transform"
          title="Room Tool"
        >
          <Square className="w-4 h-4 transition-colors" />
        </Button>
      </div>
      
      {/* History Controls */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={onUndo}
          className="w-10 h-10 p-0 hover:scale-105 transition-transform hover:bg-gray-100 dark:hover:bg-gray-800"
          title="Undo"
        >
          <Undo className="w-4 h-4 transition-colors" />
        </Button>
        <Button
          variant="outline"
          onClick={onRedo}
          className="w-10 h-10 p-0 hover:scale-105 transition-transform hover:bg-gray-100 dark:hover:bg-gray-800"
          title="Redo"
        >
          <Redo className="w-4 h-4 transition-colors" />
        </Button>
      </div>
      
      {/* Zoom Controls */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={() => onZoom("in")}
          className="w-10 h-10 p-0 hover:scale-105 transition-transform hover:bg-gray-100 dark:hover:bg-gray-800"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4 transition-colors" />
        </Button>
        <Button
          variant="outline"
          onClick={() => onZoom("out")}
          className="w-10 h-10 p-0 hover:scale-105 transition-transform hover:bg-gray-100 dark:hover:bg-gray-800"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4 transition-colors" />
        </Button>
      </div>
      
      {/* GIA Display */}
      <div className="flex items-center ml-auto mr-4 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-md">
        <span className="text-sm font-medium">GIA: {gia.toFixed(2)} m²</span>
      </div>
      
      {/* Actions */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={onClear}
          className="w-10 h-10 p-0 hover:scale-105 transition-transform hover:bg-red-50 dark:hover:bg-red-950"
          title="Clear Canvas"
        >
          <Trash className="w-4 h-4 text-red-500 transition-colors" />
        </Button>
        <Button
          variant="default"
          onClick={onSave}
          className="w-10 h-10 p-0 hover:scale-105 transition-transform"
          title="Save as PNG"
        >
          <Save className="w-4 h-4 transition-colors" />
        </Button>
      </div>
    </div>
  );
};
