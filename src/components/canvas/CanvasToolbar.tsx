
import React, { useEffect } from "react";
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
import { captureMessage, captureError } from "@/utils/sentry";
import { logToolActivation, logToolbarAction, verifyToolCanvasConnection } from "@/utils/logging/toolbar";
import * as Sentry from '@sentry/react';

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
  /** Canvas reference for tool verification */
  canvasRef?: React.MutableRefObject<any>;
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
  onToggleGrid,
  canvasRef
}) => {
  // Set up Sentry monitoring on component mount
  useEffect(() => {
    Sentry.setTag("component", "CanvasToolbar");
    Sentry.setContext("toolbarState", {
      currentTool: tool,
      lineThickness,
      lineColor,
      canUndo,
      canRedo,
      showGrid
    });
    
    // Report toolbar initialization
    captureMessage("Toolbar initialized", "toolbar-init", {
      tags: { component: "CanvasToolbar" },
      extra: { tool, lineThickness, lineColor }
    });
    
    return () => {
      // Clear component-specific tags when unmounting
      Sentry.setTag("component", null);
    };
  }, [tool, lineThickness, lineColor, canUndo, canRedo, showGrid]);
  
  // Effect to log state changes for better error tracking
  useEffect(() => {
    Sentry.setContext("toolbarState", {
      currentTool: tool,
      lineThickness,
      lineColor,
      canUndo,
      canRedo,
      showGrid
    });
  }, [tool, lineThickness, lineColor, canUndo, canRedo, showGrid]);
  
  // Handle tool change with verification and logging
  const handleToolChange = (newTool: DrawingMode) => {
    const previousTool = tool;
    
    logger.info(`Toolbar: changing tool from ${tool} to ${newTool}`, {
      previousTool: tool,
      newTool
    });
    
    // Verify the tool can be properly used with the canvas
    if (canvasRef?.current) {
      const verificationResult = verifyToolCanvasConnection(newTool, canvasRef.current);
      
      if (!verificationResult.connected) {
        // Log issues but still change the tool
        captureMessage(
          `Tool changed with connection issues: ${newTool}`,
          "tool-connection-warning", 
          {
            tags: { 
              component: "CanvasToolbar", 
              tool: newTool, 
              warning: "true" // Convert boolean to string
            },
            extra: { 
              issues: verificationResult.issues,
              previousTool: tool
            }
          }
        );
      }
    }
    
    // Call the tool change handler
    try {
      onToolChange(newTool);
      
      // Log successful tool change
      logToolActivation(newTool, previousTool, {
        lineThickness,
        lineColor,
        hasCanvas: !!canvasRef?.current
      });
      
      // For debugging - will run validation on the next render
      if (newTool === DrawingMode.STRAIGHT_LINE) {
        // Run validation after a brief delay to allow tool initialization
        setTimeout(() => {
          try {
            if (canvasRef?.current) {
              validateStraightLineDrawing(canvasRef.current, newTool);
            }
          } catch (error) {
            logger.error('Error validating straight line tool', { error });
            
            // Report validation failure
            captureError(error as Error, "straight-line-validation-error", {
              tags: { component: "CanvasToolbar", critical: "true" }, // Convert boolean to string
              extra: { previousTool, newTool }
            });
          }
        }, 100);
      }
    } catch (error) {
      // Log error if tool change fails
      logger.error(`Failed to change tool to ${newTool}`, { error });
      
      captureError(error as Error, "tool-change-error", {
        tags: { component: "CanvasToolbar", critical: "true" }, // Convert boolean to string
        extra: { previousTool, newTool }
      });
    }
  };
  
  // Enhanced handlers for toolbar actions with logging
  const handleUndo = () => {
    try {
      onUndo();
      logToolbarAction("undo", true, { canUndo });
    } catch (error) {
      logToolbarAction("undo", false, { error, canUndo });
    }
  };
  
  const handleRedo = () => {
    try {
      onRedo();
      logToolbarAction("redo", true, { canRedo });
    } catch (error) {
      logToolbarAction("redo", false, { error, canRedo });
    }
  };
  
  const handleZoomIn = () => {
    try {
      onZoom("in");
      logToolbarAction("zoom-in", true);
    } catch (error) {
      logToolbarAction("zoom-in", false, { error });
    }
  };
  
  const handleZoomOut = () => {
    try {
      onZoom("out");
      logToolbarAction("zoom-out", true);
    } catch (error) {
      logToolbarAction("zoom-out", false, { error });
    }
  };
  
  const handleClear = () => {
    try {
      onClear();
      logToolbarAction("clear", true);
    } catch (error) {
      logToolbarAction("clear", false, { error, critical: true });
    }
  };
  
  const handleSave = () => {
    try {
      onSave();
      logToolbarAction("save", true);
    } catch (error) {
      logToolbarAction("save", false, { error, critical: true });
    }
  };
  
  const handleDelete = () => {
    try {
      onDelete();
      logToolbarAction("delete", true);
    } catch (error) {
      logToolbarAction("delete", false, { error });
    }
  };
  
  const handleToggleGrid = () => {
    try {
      onToggleGrid();
      logToolbarAction("toggle-grid", true, { newState: !showGrid });
    } catch (error) {
      logToolbarAction("toggle-grid", false, { error, currentState: showGrid });
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
        onClick={handleUndo}
        disabled={!canUndo}
        aria-label="Undo"
      >
        <RefreshCw className="h-4 w-4 rotate-[225deg]" />
      </Button>
      
      <Button 
        variant="outline" 
        size="icon" 
        onClick={handleRedo}
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
        onClick={handleZoomIn}
        aria-label="Zoom in"
      >
        <ZoomIn className="h-4 w-4" />
      </Button>
      
      <Button 
        variant="outline" 
        size="icon" 
        onClick={handleZoomOut}
        aria-label="Zoom out"
      >
        <ZoomOut className="h-4 w-4" />
      </Button>
      
      <Separator orientation="vertical" className="h-8" />
      
      {/* Grid controls */}
      <Toggle 
        pressed={showGrid} 
        onPressedChange={handleToggleGrid}
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
        onClick={handleClear}
        aria-label="Clear canvas"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
      
      <Button 
        variant="outline" 
        size="icon" 
        onClick={handleSave}
        aria-label="Save canvas"
      >
        <Save className="h-4 w-4" />
      </Button>
      
      <Button 
        variant="outline" 
        size="icon" 
        onClick={handleDelete}
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

