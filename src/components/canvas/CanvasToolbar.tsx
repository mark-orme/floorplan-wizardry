
/**
 * Canvas Toolbar Component
 * Provides drawing tools and controls for the canvas
 * @module components/canvas/CanvasToolbar
 */
import React from "react";
import { Button } from "@/components/ui/button";
import { 
  Undo, 
  Redo, 
  Trash, 
  Save, 
  ZoomIn, 
  ZoomOut,
  MousePointer,
  Pencil,
  Square,
  Circle,
  Scissors,
  Grid  
} from "lucide-react";
import { DrawingMode } from "@/constants/drawingModes";
import { LineThicknessControl } from "./LineThicknessControl";
import { ColorPicker } from "./ColorPicker";

/**
 * Props for CanvasToolbar component
 */
export interface CanvasToolbarProps {
  /** Current drawing tool */
  tool: DrawingMode;
  /** Current line thickness */
  lineThickness: number;
  /** Current line color */
  lineColor: string;
  /** Gross internal area */
  gia?: number;
  /** Whether undo is available */
  canUndo: boolean;
  /** Whether redo is available */
  canRedo: boolean;
  /** Whether to show grid */
  showGrid: boolean;
  /** Tool change handler */
  onToolChange: (tool: DrawingMode) => void;
  /** Undo handler */
  onUndo: () => void;
  /** Redo handler */
  onRedo: () => void;
  /** Zoom handler */
  onZoom: (direction: "in" | "out") => void;
  /** Clear canvas handler */
  onClear: () => void;
  /** Save canvas handler */
  onSave: () => void;
  /** Delete selected objects handler */
  onDelete: () => void;
  /** Line thickness change handler */
  onLineThicknessChange: (thickness: number) => void;
  /** Line color change handler */
  onLineColorChange: (color: string) => void;
  /** Toggle grid visibility handler */
  onToggleGrid: () => void;
}

/**
 * Canvas Toolbar Component
 * Provides drawing tools and controls for the canvas
 */
export const CanvasToolbar: React.FC<CanvasToolbarProps> = ({
  tool,
  lineThickness,
  lineColor,
  gia,
  canUndo,
  canRedo,
  showGrid,
  onToolChange,
  onUndo,
  onRedo,
  onZoom,
  onClear,
  onSave,
  onDelete,
  onLineThicknessChange,
  onLineColorChange,
  onToggleGrid
}) => {
  return (
    <div className="flex items-center p-2 gap-2 border-b border-gray-200 bg-gray-50">
      {/* Drawing tools */}
      <div className="flex items-center gap-1 border-r pr-2">
        <Button
          variant={tool === DrawingMode.SELECT ? "default" : "outline"}
          size="icon"
          onClick={() => onToolChange(DrawingMode.SELECT)}
          title="Select Tool"
        >
          <MousePointer className="h-4 w-4" />
        </Button>
        
        <Button
          variant={tool === DrawingMode.DRAW ? "default" : "outline"}
          size="icon"
          onClick={() => onToolChange(DrawingMode.DRAW)}
          title="Draw Tool"
        >
          <Pencil className="h-4 w-4" />
        </Button>
        
        <Button
          variant={tool === DrawingMode.RECTANGLE ? "default" : "outline"}
          size="icon"
          onClick={() => onToolChange(DrawingMode.RECTANGLE)}
          title="Rectangle Tool"
        >
          <Square className="h-4 w-4" />
        </Button>
        
        <Button
          variant={tool === DrawingMode.CIRCLE ? "default" : "outline"}
          size="icon"
          onClick={() => onToolChange(DrawingMode.CIRCLE)}
          title="Circle Tool"
        >
          <Circle className="h-4 w-4" />
        </Button>
        
        <Button
          variant={tool === DrawingMode.ERASER ? "default" : "outline"}
          size="icon"
          onClick={() => onToolChange(DrawingMode.ERASER)}
          title="Eraser Tool"
        >
          <Scissors className="h-4 w-4" />
        </Button>
      </div>
      
      {/* History operations */}
      <div className="flex items-center gap-1 border-r pr-2">
        <Button
          variant="outline"
          size="icon"
          onClick={onUndo}
          disabled={!canUndo}
          title="Undo"
        >
          <Undo className="h-4 w-4" />
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          onClick={onRedo}
          disabled={!canRedo}
          title="Redo"
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Canvas operations */}
      <div className="flex items-center gap-1 border-r pr-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onZoom("in")}
          title="Zoom In"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          onClick={() => onZoom("out")}
          title="Zoom Out"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        
        <Button
          variant={showGrid ? "default" : "outline"}
          size="icon"
          onClick={onToggleGrid}
          title={showGrid ? "Hide Grid" : "Show Grid"}
        >
          <Grid className="h-4 w-4" />
        </Button>
      </div>
      
      {/* File operations */}
      <div className="flex items-center gap-1 border-r pr-2">
        <Button
          variant="outline"
          size="icon"
          onClick={onClear}
          title="Clear Canvas"
        >
          <Trash className="h-4 w-4" />
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          onClick={onSave}
          title="Save Canvas"
        >
          <Save className="h-4 w-4" />
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          onClick={onDelete}
          title="Delete Selected"
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Line properties */}
      <div className="flex items-center gap-2">
        <LineThicknessControl
          value={lineThickness}
          onChange={onLineThicknessChange}
        />
        
        <ColorPicker
          color={lineColor}
          onChange={onLineColorChange}
        />
      </div>
      
      {/* GIA display */}
      {gia !== undefined && (
        <div className="ml-auto text-sm">
          <span className="font-semibold">GIA:</span> {gia} m²
        </div>
      )}
    </div>
  );
};
