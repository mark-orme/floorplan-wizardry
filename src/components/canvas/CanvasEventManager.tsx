
import React, { useEffect, useRef, useState } from "react";
import { Canvas as FabricCanvas, Object as FabricObject, Line, PencilBrush } from "fabric";
import { DrawingMode } from "@/constants/drawingModes";
import { toast } from "sonner";
import { captureMessage, captureError } from "@/utils/sentry";
import logger from "@/utils/logger";
import { 
  useKeyboardEvents, 
  useObjectEvents, 
  useBrushSettings 
} from "@/hooks/canvas-events";
import { useStraightLineTool } from "@/hooks/useStraightLineTool";

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
  const initialStateRef = useRef(false);
  
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
  
  // Initialize straight line tool
  const { cancelDrawing } = useStraightLineTool({
    fabricCanvasRef: canvasRef,
    tool,
    lineColor,
    lineThickness,
    saveCurrentState
  });
  
  // Effect to handle tool changes (cursor, selection, etc.)
  useEffect(() => {
    if (!canvas) {
      logger.warn("Canvas not available for tool change");
      return;
    }
    
    logger.info("Applying tool settings to canvas", { tool, lineThickness, lineColor });
    
    try {
      // Disable drawing mode by default
      canvas.isDrawingMode = false;
      
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
            // Initialize the freeDrawingBrush if it doesn't exist
            canvas.freeDrawingBrush = new PencilBrush(canvas);
            canvas.freeDrawingBrush.width = lineThickness;
            canvas.freeDrawingBrush.color = lineColor;
            logger.info("Created new drawing brush", {
              brushWidth: lineThickness,
              brushColor: lineColor
            });
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
      
      // Check if grid needs to be created
      if (gridLayerRef.current.length === 0) {
        logger.info("No grid detected, attempting to create grid");
        const gridObjects = createBasicGrid(canvas);
        gridLayerRef.current = gridObjects;
        logger.info(`Created grid with ${gridObjects.length} objects`);
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
      
      captureMessage("Tool applied to canvas", "tool-applied");
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      logger.error("Failed to apply tool settings", { 
        error: errorMsg, 
        tool, 
        lineThickness, 
        lineColor 
      });
      captureError(error as Error, "apply-tool-settings-error");
      toast.error(`Failed to apply tool settings: ${errorMsg}`);
    }
  }, [tool, lineThickness, lineColor, canvas, gridLayerRef]);
  
  // Effect to handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cancel line drawing on escape
      if (e.key === 'Escape' && tool === DrawingMode.STRAIGHT_LINE) {
        cancelDrawing();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [tool, cancelDrawing]);
  
  // Effect to save initial state - using a ref to ensure it only runs once
  useEffect(() => {
    if (!canvas || initialStateRef.current) return;
    
    // Create grid if not already created
    if (gridLayerRef.current.length === 0) {
      const gridObjects = createBasicGrid(canvas);
      gridLayerRef.current = gridObjects;
      logger.info(`Created initial grid with ${gridObjects.length} objects`);
    }
    
    // Save initial state once when canvas is first available
    const timer = setTimeout(() => {
      saveCurrentState();
      initialStateRef.current = true;
    }, 500);
    
    return () => clearTimeout(timer);
  }, [canvas, saveCurrentState, gridLayerRef]);
  
  // Function to create basic grid
  const createBasicGrid = (canvas: FabricCanvas) => {
    try {
      const gridSize = 20;
      const gridObjects: FabricObject[] = [];
      const width = canvas.width || 800;
      const height = canvas.height || 600;
      
      // Create horizontal grid lines
      for (let i = 0; i <= height; i += gridSize) {
        const line = new Line([0, i, width, i], {
          stroke: "#e0e0e0",
          selectable: false,
          evented: false,
          objectType: "grid"
        } as any);
        canvas.add(line);
        gridObjects.push(line);
      }
      
      // Create vertical grid lines
      for (let i = 0; i <= width; i += gridSize) {
        const line = new Line([i, 0, i, height], {
          stroke: "#e0e0e0",
          selectable: false,
          evented: false,
          objectType: "grid"
        } as any);
        canvas.add(line);
        gridObjects.push(line);
      }
      
      return gridObjects;
    } catch (error) {
      logger.error("Failed to create basic grid", error);
      return [];
    }
  };
  
  return null; // This component doesn't render anything
};
