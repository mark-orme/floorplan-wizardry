import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { DrawingMode } from "@/constants/drawingModes";
import { LineSettings } from "./LineSettings";
import { Wall } from "@/components/icons/Wall"; // Import our custom Wall icon
import { 
  MousePointerSquareDashed, Pencil, 
  Undo2, Redo2, ZoomIn, ZoomOut, PanelRight, Hand, Save, Trash, Eraser, Ruler,
  MoveHorizontal, Minus 
} from "lucide-react";
import { formatGIA } from "@/utils/display";

interface DrawingToolbarProps {
  tool: DrawingMode;
  onToolChange: (tool: DrawingMode) => void;
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
  onZoom: (direction: "in" | "out") => void;
  onSave: () => void;
  onDelete?: () => void;
  gia: number;
  lineThickness: number;
  lineColor: string;
  onLineThicknessChange: (thickness: number) => void;
  onLineColorChange: (color: string) => void;
  wallThickness?: number;
  wallColor?: string;
  onWallThicknessChange?: (thickness: number) => void;
  onWallColorChange?: (color: string) => void;
  showGrid?: boolean;
  onToggleGrid?: () => void;
  snapToGrid?: boolean;
  onToggleSnap?: () => void;
  isDrawing?: boolean;
  isDirty?: boolean;
  showControls?: boolean;
  disabled?: boolean;
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
  onClear,
  onZoom,
  onSave,
  onDelete,
  gia,
  lineThickness,
  lineColor,
  onLineThicknessChange,
  onLineColorChange,
  wallThickness = 4,
  wallColor = "#333333",
  onWallThicknessChange,
  onWallColorChange,
  showGrid,
  onToggleGrid,
  snapToGrid,
  onToggleSnap,
  isDrawing = false,
  isDirty = false,
  showControls = true,
  disabled = false
}: DrawingToolbarProps): JSX.Element => {
  return (
    <div className="flex flex-col space-y-2">
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
                variant={tool === DrawingMode.WALL ? "default" : "outline"} 
                size="sm"
                onClick={() => onToolChange(DrawingMode.WALL)}
              >
                <Wall className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Wall Drawing Tool</p>
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
                <Minus className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Draw Straight Line with Measurement (in meters)</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant={tool === DrawingMode.WALL ? "default" : "outline"} 
                size="sm"
                onClick={() => onToolChange(DrawingMode.WALL)}
              >
                <Ruler className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Draw Wall with Measurement</p>
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
        
        {onToggleSnap && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant={snapToGrid ? "default" : "outline"} 
                  size="sm"
                  onClick={onToggleSnap}
                >
                  <MoveHorizontal className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{snapToGrid ? "Snap to Grid: On" : "Snap to Grid: Off"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      
      <div className="flex flex-wrap items-center space-x-2">
        {tool === DrawingMode.WALL && onWallColorChange && onWallThicknessChange ? (
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600">Wall:</span>
            <input 
              type="color" 
              value={wallColor} 
              onChange={(e) => onWallColorChange(e.target.value)}
              className="w-8 h-6 border-none"
            />
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
        ) : (
          <LineSettings 
            thickness={lineThickness}
            color={lineColor}
            onThicknessChange={onLineThicknessChange}
            onColorChange={onLineColorChange}
          />
        )}
        
        <div className="border border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800 px-3 py-2 rounded-md text-sm flex items-center gap-2 shadow-sm">
          <PanelRight className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <span className="text-blue-700 dark:text-blue-300">GIA: <strong className="text-blue-900 dark:text-blue-200 text-base">{formatGIA(gia)}</strong> m²</span>
        </div>
      </div>
    </div>
  );
};
