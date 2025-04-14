import React from "react";
import { Button } from "@/components/ui/button";
import { DrawingMode } from "@/constants/drawingModes";
import { 
  Pencil, 
  MousePointer, 
  Square, 
  Type, 
  Eraser, 
  Hand, 
  ZoomIn, 
  ZoomOut, 
  RefreshCw, 
  Save, 
  Trash2, 
  Grid,
  Minus
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Toggle } from "@/components/ui/toggle";
import { LineThicknessControl } from "./LineThicknessControl";
import { ColorPicker } from "./ColorPicker";
import { ZoomDirection } from "@/types/drawingTypes";
import logger from "@/utils/logger";
import { validateStraightLineDrawing } from "@/utils/diagnostics/drawingToolValidator";
import { captureMessage } from "@/utils/sentry";

/**
 * Props for Canvas Toolbar component
 */
export interface CanvasToolbarProps {
  /** Current drawing tool */
  tool: DrawingMode;
  /** Function to handle tool change */
  onToolChange: (tool: DrawingMode) => void;
  /** Function to handle undo operation */
  onUndo: () => void;
  /** Function to handle redo operation */
  onRedo: () => void;
  /** Function to handle zoom operation */
  onZoom: (direction: ZoomDirection) => void;
  /** Function to clear canvas */
  onClear: () => void;
  /** Function to save canvas */
  onSave: () => void;
  /** Function to delete selected objects */
  onDelete: () => void;
  /** Current line thickness */
  lineThickness: number;
  /** Function to handle line thickness change */
  onLineThicknessChange: (thickness: number) => void;
  /** Current line color */
  lineColor: string;
  /** Function to handle line color change */
  onLineColorChange: (color: string) => void;
  /** Current GIA value */
  gia?: number;
  /** Whether undo is available */
  canUndo: boolean;
  /** Whether redo is available */
  canRedo: boolean;
  /** Whether grid is visible */
  showGrid: boolean;
  /** Function to toggle grid visibility */
  onToggleGrid: () => void;
}

/**
 * Canvas Toolbar Component
 * Provides tools for drawing and manipulating canvas objects
 */
export const CanvasToolbar: React.FC<CanvasToolbarProps> = ({
  tool,
  onToolChange,
  onUndo,
  onRedo,
  onZoom,
  onClear,
  onSave,
  onDelete,
  lineThickness,
  onLineThicknessChange,
  lineColor,
  onLineColorChange,
  gia,
  canUndo,
  canRedo,
  showGrid,
  onToggleGrid
}) => {
  // Handle tool change with verification and logging
  const handleToolChange = (newTool: DrawingMode) => {
    logger.info(`Toolbar: changing tool from ${tool} to ${newTool}`, {
      previousTool: tool,
      newTool
    });
    
    // Call the tool change handler
    onToolChange(newTool);
    
    // For debugging - will run validation on the next render
    if (newTool === DrawingMode.STRAIGHT_LINE) {
      // Log the change
      captureMessage('Straight line tool selected from toolbar', 'straight-line-tool-selected', {
        tags: { component: 'CanvasToolbar' },
        extra: { previousTool: tool, lineThickness, lineColor }
      });
      
      // Run validation after a brief delay to allow tool initialization
      setTimeout(() => {
        // This is just for debugging purposes
        try {
          if (typeof window !== 'undefined' && (window as any).fabricCanvas) {
            // Use the canvas overload with the correct parameters
            validateStraightLineDrawing((window as any).fabricCanvas, newTool);
          }
        } catch (error) {
          logger.error('Error validating straight line tool', { error });
        }
      }, 100);
    }
  };
  
  return (
    <div className="bg-white border-b border-gray-200 p-2 flex items-center gap-2 shadow-sm z-10">
      {/* Tool selection group */}
      <div className="flex gap-1">
        <Toggle 
          pressed={tool === DrawingMode.SELECT} 
          onPressedChange={() => handleToolChange(DrawingMode.SELECT)}
          aria-label="Select tool"
          size="sm"
        >
          <MousePointer className="h-4 w-4" />
        </Toggle>
        
        <Toggle 
          pressed={tool === DrawingMode.DRAW} 
          onPressedChange={() => handleToolChange(DrawingMode.DRAW)}
          aria-label="Draw tool"
          size="sm"
        >
          <Pencil className="h-4 w-4" />
        </Toggle>
        
        <Toggle 
          pressed={tool === DrawingMode.STRAIGHT_LINE} 
          onPressedChange={() => handleToolChange(DrawingMode.STRAIGHT_LINE)}
          aria-label="Straight line tool"
          size="sm"
          data-test-id="straight-line-tool"
        >
          <Minus className="h-4 w-4" />
        </Toggle>
        
        <Toggle 
          pressed={tool === DrawingMode.RECTANGLE} 
          onPressedChange={() => handleToolChange(DrawingMode.RECTANGLE)}
          aria-label="Rectangle tool"
          size="sm"
        >
          <Square className="h-4 w-4" />
        </Toggle>
        
        <Toggle 
          pressed={tool === DrawingMode.TEXT} 
          onPressedChange={() => handleToolChange(DrawingMode.TEXT)}
          aria-label="Text tool"
          size="sm"
        >
          <Type className="h-4 w-4" />
        </Toggle>
        
        <Toggle 
          pressed={tool === DrawingMode.ERASER} 
          onPressedChange={() => handleToolChange(DrawingMode.ERASER)}
          aria-label="Eraser tool"
          size="sm"
        >
          <Eraser className="h-4 w-4" />
        </Toggle>
        
        <Toggle 
          pressed={tool === DrawingMode.HAND} 
          onPressedChange={() => handleToolChange(DrawingMode.HAND)}
          aria-label="Hand tool"
          size="sm"
        >
          <Hand className="h-4 w-4" />
        </Toggle>
      </div>
      
      <Separator orientation="vertical" className="h-8" />
      
      {/* Style controls */}
      <LineThicknessControl 
        thickness={lineThickness} 
        onChange={onLineThicknessChange} 
      />
      
      <ColorPicker 
        color={lineColor} 
        onChange={onLineColorChange} 
      />
      
      <Separator orientation="vertical" className="h-8" />
      
      {/* History controls */}
      <Button 
        variant="outline" 
        size="icon" 
        onClick={onUndo}
        disabled={!canUndo}
        aria-label="Undo"
      >
        <RefreshCw className="h-4 w-4 rotate-[225deg]" />
      </Button>
      
      <Button 
        variant="outline" 
        size="icon" 
        onClick={onRedo}
        disabled={!canRedo}
        aria-label="Redo"
      >
        <RefreshCw className="h-4 w-4 rotate-[135deg]" />
      </Button>
      
      <Separator orientation="vertical" className="h-8" />
      
      {/* Zoom controls */}
      <Button 
        variant="outline" 
        size="icon" 
        onClick={() => onZoom("in")}
        aria-label="Zoom in"
      >
        <ZoomIn className="h-4 w-4" />
      </Button>
      
      <Button 
        variant="outline" 
        size="icon" 
        onClick={() => onZoom("out")}
        aria-label="Zoom out"
      >
        <ZoomOut className="h-4 w-4" />
      </Button>
      
      <Separator orientation="vertical" className="h-8" />
      
      {/* Grid controls */}
      <Toggle 
        pressed={showGrid} 
        onPressedChange={onToggleGrid}
        aria-label="Toggle grid"
        size="sm"
      >
        <Grid className="h-4 w-4" />
      </Toggle>
      
      <Separator orientation="vertical" className="h-8" />
      
      {/* Action controls */}
      <Button 
        variant="outline" 
        size="icon" 
        onClick={onClear}
        aria-label="Clear canvas"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
      
      <Button 
        variant="outline" 
        size="icon" 
        onClick={onSave}
        aria-label="Save canvas"
      >
        <Save className="h-4 w-4" />
      </Button>
      
      <Button 
        variant="outline" 
        size="icon" 
        onClick={onDelete}
        aria-label="Delete selected"
      >
        <Trash2 className="h-4 w-4 text-red-500" />
      </Button>
      
      {gia !== undefined && (
        <div className="ml-auto text-sm">
          <span className="font-medium">GIA:</span> {gia.toFixed(2)} m²
        </div>
      )}
    </div>
  );
};
