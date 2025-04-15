
import React from "react";
import { DrawingMode } from "@/constants/drawingModes";
import { 
  MousePointer, 
  Pencil, 
  Square, 
  Circle, 
  Undo2, 
  Redo2, 
  Trash, 
  ZoomIn, 
  ZoomOut, 
  Grid,
  Download,
  Wifi,
  WifiOff
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";

/**
 * Props for ToolbarContainer
 */
interface ToolbarContainerProps {
  tool: DrawingMode;
  setTool: (tool: DrawingMode) => void;
  onUndo: () => void;
  onRedo: () => void;
  onZoom: (direction: "in" | "out") => void;
  onClear: () => void;
  onDelete: () => void;
  onToggleGrid: () => void;
  onLineThicknessChange: (thickness: number) => void;
  onLineColorChange: (color: string) => void;
  gia: number;
  lineThickness: number;
  lineColor: string;
  showGrid: boolean;
  canUndo: boolean;
  canRedo: boolean;
  isOffline?: boolean; // Add offline indicator prop
}

/**
 * Container for drawing toolbar
 */
export const ToolbarContainer: React.FC<ToolbarContainerProps> = ({
  tool,
  setTool,
  onUndo,
  onRedo,
  onZoom,
  onClear,
  onDelete,
  gia,
  lineThickness,
  lineColor,
  showGrid,
  onToggleGrid,
  onLineThicknessChange,
  onLineColorChange,
  canUndo,
  canRedo,
  isOffline = false
}) => {
  return (
    <TooltipProvider>
      <div className="flex items-center justify-between bg-background border rounded-md p-2 shadow-sm">
        <div className="flex items-center space-x-1">
          {/* Drawing tools */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={tool === DrawingMode.SELECT ? "default" : "outline"}
                size="icon"
                onClick={() => setTool(DrawingMode.SELECT)}
              >
                <MousePointer className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Select (S)</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={tool === DrawingMode.DRAW ? "default" : "outline"}
                size="icon"
                onClick={() => setTool(DrawingMode.DRAW)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Draw (D)</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={tool === DrawingMode.STRAIGHT_LINE ? "default" : "outline"}
                size="icon"
                onClick={() => setTool(DrawingMode.STRAIGHT_LINE)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 19l14-14"/>
                </svg>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Straight Line (L)</p>
            </TooltipContent>
          </Tooltip>
          
          <Separator orientation="vertical" className="h-6 mx-1" />
          
          {/* Undo/Redo */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={onUndo}
                disabled={!canUndo}
              >
                <Undo2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Undo (Ctrl+Z)</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={onRedo}
                disabled={!canRedo}
              >
                <Redo2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Redo (Ctrl+Shift+Z)</p>
            </TooltipContent>
          </Tooltip>
          
          <Separator orientation="vertical" className="h-6 mx-1" />
          
          {/* Zoom */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={() => onZoom("in")}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Zoom In</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={() => onZoom("out")}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Zoom Out</p>
            </TooltipContent>
          </Tooltip>
        </div>
        
        <div className="flex items-center space-x-1">
          {/* Style controls */}
          <div className="flex items-center mr-2">
            <label htmlFor="lineThickness" className="text-xs mr-1">Width:</label>
            <input
              id="lineThickness"
              type="number"
              min="1"
              max="20"
              value={lineThickness}
              onChange={(e) => onLineThicknessChange(Number(e.target.value))}
              className="w-12 h-8 px-2 border rounded text-xs"
            />
            
            <label htmlFor="lineColor" className="text-xs mx-1">Color:</label>
            <input
              id="lineColor"
              type="color"
              value={lineColor}
              onChange={(e) => onLineColorChange(e.target.value)}
              className="w-8 h-8 border rounded cursor-pointer"
            />
          </div>
          
          <Separator orientation="vertical" className="h-6 mx-1" />
          
          {/* Grid toggle */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={showGrid ? "default" : "outline"}
                size="icon"
                onClick={onToggleGrid}
              >
                <Grid className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Toggle Grid</p>
            </TooltipContent>
          </Tooltip>
          
          {/* Delete/Clear */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={onDelete}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Delete Selected (Del)</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                onClick={onClear}
                size="sm"
                className="text-xs"
              >
                Clear All
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Clear Canvas</p>
            </TooltipContent>
          </Tooltip>
          
          {/* Online/Offline indicator */}
          {isOffline ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="ml-2 text-yellow-600 flex items-center">
                  <WifiOff className="h-4 w-4 mr-1" />
                  <span className="text-xs">Offline</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Working offline - Your drawings are saved locally</p>
              </TooltipContent>
            </Tooltip>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="ml-2 text-green-600 flex items-center">
                  <Wifi className="h-4 w-4 mr-1" />
                  <span className="text-xs">Online</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Connected - Auto-saving enabled</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
};
