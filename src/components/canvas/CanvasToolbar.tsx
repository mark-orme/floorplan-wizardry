
import React from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { DrawingMode } from "@/constants/drawingModes";
import { 
  MousePointerSquareDashed, Pencil, Grid2X2, Undo2, Redo2, 
  ZoomIn, ZoomOut, Hand, Trash, Eraser, Ruler 
} from "lucide-react";
import { formatGIA } from "@/utils/display";

interface CanvasToolbarProps {
  tool: DrawingMode;
  onToolChange: (tool: DrawingMode) => void;
  onUndo: () => void;
  onRedo: () => void;
  onZoom: (direction: "in" | "out") => void;
  onClear: () => void;
  onDelete?: () => void;
  gia: number;
  lineThickness: number;
  lineColor: string;
  showGrid: boolean;
  onToggleGrid: () => void;
}

/**
 * Canvas toolbar component
 * Provides drawing tools and controls for the canvas
 * @returns {JSX.Element} Rendered component
 */
export const CanvasToolbar = ({
  tool,
  onToolChange,
  onUndo,
  onRedo,
  onZoom,
  onClear,
  onDelete,
  gia,
  lineThickness,
  lineColor,
  showGrid,
  onToggleGrid
}: CanvasToolbarProps): JSX.Element => {
  return (
    <div className="flex flex-col space-y-2 p-2 bg-muted/20 border rounded-md shadow-sm">
      <div className="flex flex-wrap gap-1">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant={tool === DrawingMode.SELECT ? "default" : "outline"} 
                size="sm"
                onClick={() => onToolChange(DrawingMode.SELECT)}
              >
                <MousePointerSquareDashed className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Select (Click to select objects, Delete key to remove)</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant={tool === DrawingMode.HAND ? "default" : "outline"} 
                size="sm"
                onClick={() => onToolChange(DrawingMode.HAND)}
              >
                <Hand className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Hand (Pan)</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant={tool === DrawingMode.DRAW ? "default" : "outline"} 
                size="sm"
                onClick={() => onToolChange(DrawingMode.DRAW)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Freehand Draw</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant={tool === DrawingMode.STRAIGHT_LINE ? "default" : "outline"} 
                size="sm"
                onClick={() => onToolChange(DrawingMode.STRAIGHT_LINE)}
              >
                <Ruler className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Draw Wall (Straight Line) with Measurement</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant={tool === DrawingMode.ROOM ? "default" : "outline"} 
                size="sm"
                onClick={() => onToolChange(DrawingMode.ROOM)}
              >
                <Grid2X2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Room</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant={tool === DrawingMode.ERASER ? "default" : "outline"} 
                size="sm"
                onClick={() => onToolChange(DrawingMode.ERASER)}
              >
                <Eraser className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Eraser</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <Separator orientation="vertical" className="h-8 mx-1" />
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="sm"
                onClick={onUndo}
              >
                <Undo2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Undo (Ctrl+Z)</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="sm"
                onClick={onRedo}
              >
                <Redo2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Redo (Ctrl+Shift+Z)</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="sm"
                onClick={onClear}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Clear Canvas</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <Separator orientation="vertical" className="h-8 mx-1" />
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onZoom("in")}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Zoom In</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onZoom("out")}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Zoom Out</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span className="text-muted-foreground">GIA: <strong>{formatGIA(gia)}</strong> m²</span>
        
        <Button 
          variant={showGrid ? "default" : "outline"}
          size="sm"
          onClick={onToggleGrid}
        >
          <Grid2X2 className="h-4 w-4 mr-1" />
          {showGrid ? "Hide Grid" : "Show Grid"}
        </Button>
      </div>
    </div>
  );
};
