
import React, { useEffect, useRef } from "react";
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { DrawingMode } from "@/constants/drawingModes";
import { toast } from "sonner";
import { captureMessage, captureError } from "@/utils/sentry";
import logger from "@/utils/logger";
import { 
  useKeyboardEvents, 
  useObjectEvents, 
  useBrushSettings 
} from "@/hooks/canvas-events";

/**
 * Props for CanvasEventManager component
 */
interface CanvasEventManagerProps {
  canvas: FabricCanvas | null;
  tool: DrawingMode;
  lineThickness: number;
  lineColor: string;
  gridLayerRef: React.MutableRefObject<FabricObject[]>;
  saveCurrentState: () => void;
  undo: () => void;
  redo: () => void;
  deleteSelectedObjects: () => void;
}

/**
 * Canvas event manager component
 * Manages canvas events and tool-specific settings
 */
export const CanvasEventManager: React.FC<CanvasEventManagerProps> = ({
  canvas,
  tool,
  lineThickness,
  lineColor,
  gridLayerRef,
  saveCurrentState,
  undo,
  redo,
  deleteSelectedObjects
}) => {
  // Ref for the canvas
  const canvasRef = useRef<FabricCanvas | null>(canvas);
  
  // Update canvas ref when canvas changes
  useEffect(() => {
    canvasRef.current = canvas;
  }, [canvas]);
  
  // Initialize object events (history tracking)
  useObjectEvents({
    fabricCanvasRef: canvasRef,
    tool,
    saveCurrentState
  });
  
  // Initialize keyboard events
  useKeyboardEvents({
    fabricCanvasRef: canvasRef,
    tool,
    handleUndo: undo,
    handleRedo: redo,
    deleteSelectedObjects
  });
  
  // Initialize brush settings
  useBrushSettings({
    fabricCanvasRef: canvasRef,
    tool,
    lineColor,
    lineThickness
  });
  
  // Effect to handle tool changes (cursor, selection, etc.)
  useEffect(() => {
    if (!canvas) {
      logger.warn("Canvas not available for tool change");
      return;
    }
    
    logger.info("Applying tool settings to canvas", { tool, lineThickness, lineColor });
    
    try {
      // Apply tool-specific settings
      switch (tool) {
        case DrawingMode.SELECT:
          canvas.selection = true;
          canvas.defaultCursor = 'default';
          canvas.hoverCursor = 'move';
          logger.info("Select tool activated", { selection: true });
          break;
          
        case DrawingMode.DRAW:
          canvas.isDrawingMode = true;
          if (canvas.freeDrawingBrush) {
            canvas.freeDrawingBrush.width = lineThickness;
            canvas.freeDrawingBrush.color = lineColor;
            logger.info("Draw tool activated", { 
              isDrawingMode: true, 
              brushWidth: lineThickness, 
              brushColor: lineColor 
            });
          } else {
            logger.error("Drawing brush not available");
          }
          canvas.defaultCursor = 'crosshair';
          break;
          
        case DrawingMode.HAND:
          canvas.defaultCursor = 'grab';
          canvas.hoverCursor = 'grab';
          canvas.selection = false;
          logger.info("Hand tool activated");
          break;
          
        case DrawingMode.STRAIGHT_LINE:
          canvas.defaultCursor = 'crosshair';
          canvas.hoverCursor = 'crosshair';
          canvas.selection = false;
          logger.info("Straight line tool activated");
          break;
          
        case DrawingMode.ERASER:
          canvas.defaultCursor = 'cell';
          canvas.hoverCursor = 'cell';
          canvas.selection = true;
          logger.info("Eraser tool activated");
          break;
          
        default:
          canvas.selection = true;
          logger.info("Default tool settings applied");
          break;
      }
      
      // Ensure grid stays at the bottom
      if (gridLayerRef.current.length > 0) {
        gridLayerRef.current.forEach(obj => {
          if (canvas.contains(obj)) {
            canvas.sendObjectToBack(obj);
          }
        });
        logger.info("Grid moved to back", { gridObjectCount: gridLayerRef.current.length });
      } else {
        logger.warn("No grid objects found");
      }
      
      canvas.renderAll();
      
      captureMessage(
        "Tool applied to canvas", 
        "tool-applied", 
        {
          tags: { component: "CanvasEventManager", action: "toolChange" },
          extra: { tool, lineThickness, lineColor }
        }
      );
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      logger.error("Failed to apply tool settings", { 
        error: errorMsg, 
        tool, 
        lineThickness, 
        lineColor 
      });
      captureError(
        error as Error, 
        "apply-tool-settings-error", 
        {
          tags: { component: "CanvasEventManager" },
          extra: { tool, lineThickness, lineColor }
        }
      );
      toast.error(`Failed to apply tool settings: ${errorMsg}`);
    }
  }, [tool, lineThickness, lineColor, canvas, gridLayerRef]);
  
  // Effect to save initial state
  useEffect(() => {
    if (!canvas) return;
    
    // Save initial state once when canvas is first available
    const timer = setTimeout(() => {
      saveCurrentState();
    }, 500);
    
    return () => clearTimeout(timer);
  }, [canvas, saveCurrentState]);
  
  return null; // This component doesn't render anything
};
