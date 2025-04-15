
import React from "react";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { DrawingMode } from "@/constants/drawingModes";
import { LineSettings } from "./LineSettings";
import { Wall } from "@/components/icons/Wall";
import { 
  MousePointerSquareDashed, Pencil, 
  Undo2, Redo2, ZoomIn, ZoomOut, PanelRight, Hand, Save, Trash, Eraser, Ruler,
  MoveHorizontal, Minus 
} from "lucide-react";
import { formatGIA } from "@/utils/display";
import { logToolActivation, logToolbarAction } from "@/utils/logging/toolbarLogger";
import * as Sentry from '@sentry/react';
import { captureMessage } from "@/utils/sentry";

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
  React.useEffect(() => {
    Sentry.setTag("component", "DrawingToolbar");
    Sentry.setContext("toolbarState", {
      currentTool: tool,
      lineThickness,
      lineColor,
      wallThickness,
      wallColor,
      showGrid,
      snapToGrid,
      isDrawing,
      isDirty
    });
    
    captureMessage("DrawingToolbar initialized", "toolbar-init", {
      tags: { component: "DrawingToolbar" },
      extra: { 
        tool, 
        lineThickness, 
        lineColor,
        wallThickness,
        wallColor
      }
    });
    
    return () => {
      Sentry.setTag("component", null);
    };
  }, [
    tool, 
    lineThickness, 
    lineColor, 
    wallThickness, 
    wallColor, 
    showGrid, 
    snapToGrid, 
    isDrawing, 
    isDirty
  ]);
  
  const handleToolChange = (newTool: DrawingMode) => {
    const previousTool = tool;
    
    try {
      onToolChange(newTool);
      
      logToolActivation(newTool, previousTool, {
        lineThickness,
        lineColor,
        wallThickness,
        wallColor
      });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      
      Sentry.captureException(error, {
        tags: { component: "DrawingToolbar", action: "toolChange" },
        extra: { 
          previousTool, 
          newTool,
          error: errorMsg
        }
      });
      
      console.error(`Failed to change tool to ${newTool}:`, error);
    }
  };
  
  const handleUndo = () => {
    try {
      onUndo();
      logToolbarAction("undo", true, { tool });
    } catch (error) {
      logToolbarAction("undo", false, { tool, error });
    }
  };
  
  const handleRedo = () => {
    try {
      onRedo();
      logToolbarAction("redo", true, { tool });
    } catch (error) {
      logToolbarAction("redo", false, { tool, error });
    }
  };
  
  const handleClear = () => {
    try {
      onClear();
      logToolbarAction("clear", true, { tool });
    } catch (error) {
      logToolbarAction("clear", false, { tool, error, critical: true });
    }
  };
  
  const handleZoomIn = () => {
    try {
      onZoom("in");
      logToolbarAction("zoom-in", true, { tool });
    } catch (error) {
      logToolbarAction("zoom-in", false, { tool, error });
    }
  };
  
  const handleZoomOut = () => {
    try {
      onZoom("out");
      logToolbarAction("zoom-out", true, { tool });
    } catch (error) {
      logToolbarAction("zoom-out", false, { tool, error });
    }
  };
  
  const handleSave = () => {
    try {
      onSave();
      logToolbarAction("save", true, { tool, isDirty });
    } catch (error) {
      logToolbarAction("save", false, { tool, error, isDirty, critical: true });
    }
  };
  
  const handleDelete = () => {
    if (onDelete) {
      try {
        onDelete();
        logToolbarAction("delete", true, { tool });
      } catch (error) {
        logToolbarAction("delete", false, { tool, error });
      }
    }
  };
  
  const handleToggleSnap = () => {
    if (onToggleSnap) {
      try {
        onToggleSnap();
        logToolbarAction("toggle-snap", true, { newState: !snapToGrid });
      } catch (error) {
        logToolbarAction("toggle-snap", false, { error, currentState: snapToGrid });
      }
    }
  };

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex flex-wrap gap-1">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant={tool === DrawingMode.SELECT ? "default" : "outline"} 
                size="sm"
                onClick={() => handleToolChange(DrawingMode.SELECT)}
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
                onClick={() => handleToolChange(DrawingMode.HAND)}
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
                onClick={() => handleToolChange(DrawingMode.DRAW)}
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
                onClick={() => handleToolChange(DrawingMode.WALL)}
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
                onClick={() => handleToolChange(DrawingMode.STRAIGHT_LINE)}
                data-test-id="straight-line-button"
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
                onClick={() => handleToolChange(DrawingMode.WALL)}
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
                onClick={() => handleToolChange(DrawingMode.ERASER)}
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
                onClick={handleUndo}
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
                onClick={handleRedo}
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
                onClick={handleClear}
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
                onClick={handleZoomIn}
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
                onClick={handleZoomOut}
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
                  onClick={handleToggleSnap}
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
