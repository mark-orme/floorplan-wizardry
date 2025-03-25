
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { DrawingTool } from "@/hooks/useCanvasState";
import { LineSettings } from "./LineSettings";
import { 
  MousePointerSquareDashed, Pencil, Grid2X2, 
  Undo2, Redo2, ZoomIn, ZoomOut, PanelRight, Hand, Save, Trash, Eraser 
} from "lucide-react";
import { formatGIA } from "@/utils/display";

interface DrawingToolbarProps {
  tool: DrawingTool;
  onToolChange: (tool: DrawingTool) => void;
  onUndo: () => void;
  onRedo: () => void;
  onZoom: (direction: "in" | "out") => void;
  onClear: () => void;
  onSave: () => void;
  onDelete?: () => void;
  gia: number;
  lineThickness: number;
  lineColor: string;
  onLineThicknessChange: (thickness: number) => void;
  onLineColorChange: (color: string) => void;
}

/**
 * Drawing toolbar component for floor plan editor
 * @returns {JSX.Element} Rendered component
 */
export const DrawingToolbar = ({
  tool,
  onToolChange,
  onUndo,
  onRedo,
  onZoom,
  onClear,
  onSave,
  onDelete,
  gia,
  lineThickness,
  lineColor,
  onLineThicknessChange,
  onLineColorChange
}: DrawingToolbarProps): JSX.Element => {
  return (
    <div className="flex flex-col space-y-2">
      <div className="flex flex-wrap gap-1">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant={tool === "select" ? "default" : "outline"} 
                size="sm"
                onClick={() => onToolChange("select")}
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
                variant={tool === "hand" ? "default" : "outline"} 
                size="sm"
                onClick={() => onToolChange("hand")}
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
                variant={tool === "draw" ? "default" : "outline"} 
                size="sm"
                onClick={() => onToolChange("draw")}
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
                variant={tool === "straightLine" ? "default" : "outline"} 
                size="sm"
                onClick={() => onToolChange("straightLine")}
              >
                <div className="h-4 w-4 border-b-2 border-current transform rotate-45" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Draw Wall (Straight Line)</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant={tool === "room" ? "default" : "outline"} 
                size="sm"
                onClick={() => onToolChange("room")}
              >
                <Grid2X2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Draw Room (Enclosed Shape)</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <Separator orientation="vertical" className="h-8" />
        
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
              <p>Undo</p>
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
              <p>Redo</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <Separator orientation="vertical" className="h-8" />
        
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
        
        <Separator orientation="vertical" className="h-8" />
        
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
              <p>Clear All</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        {tool === "select" && onDelete && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={onDelete}
                >
                  <Eraser className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete Selected (or press Delete key)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline"
                size="sm"
                onClick={onSave}
              >
                <Save className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Save Floor Plan</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <div className="flex flex-wrap items-center space-x-2">
        <LineSettings 
          thickness={lineThickness}
          color={lineColor}
          onThicknessChange={onLineThicknessChange}
          onColorChange={onLineColorChange}
        />
        
        <div className="border border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800 px-3 py-2 rounded-md text-sm flex items-center gap-2 shadow-sm">
          <PanelRight className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <span className="text-blue-700 dark:text-blue-300">GIA: <strong className="text-blue-900 dark:text-blue-200 text-base">{formatGIA(gia)}</strong> m²</span>
        </div>
      </div>
    </div>
  );
};
