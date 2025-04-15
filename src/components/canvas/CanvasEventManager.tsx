
import { useEffect, useRef } from "react";
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { DrawingMode } from "@/constants/drawingModes";
import { useStraightLineTool } from "@/hooks/straightLineTool/useStraightLineTool";
import { useCanvasKeyboardShortcuts } from "@/hooks/canvas/useCanvasKeyboardShortcuts";

/**
 * Props for the CanvasEventManager
 */
interface CanvasEventManagerProps {
  canvas: FabricCanvas;
  tool: DrawingMode;
  lineThickness: number;
  lineColor: string;
  gridLayerRef: React.MutableRefObject<FabricObject[]>;
  saveCurrentState: () => void;
  undo: () => void;
  redo: () => void;
  deleteSelectedObjects: () => void;
  onDrawingComplete?: () => void; // New callback for drawing completion
}

/**
 * Manages canvas events and interactions
 */
export const CanvasEventManager = ({
  canvas,
  tool,
  lineThickness,
  lineColor,
  gridLayerRef,
  saveCurrentState,
  undo,
  redo,
  deleteSelectedObjects,
  onDrawingComplete
}: CanvasEventManagerProps) => {
  // Track last active tool
  const lastToolRef = useRef<DrawingMode>(tool);
  
  // Track if we need to save state
  const needsSaveRef = useRef(false);
  
  // Initialize straight line tool
  useStraightLineTool({
    fabricCanvasRef: { current: canvas },
    enabled: tool === DrawingMode.STRAIGHT_LINE,
    lineColor,
    lineThickness,
    saveCurrentState
  });
  
  // Initialize keyboard shortcuts
  useCanvasKeyboardShortcuts({
    canvas,
    undo,
    redo,
    deleteSelected: deleteSelectedObjects
  });
  
  // Set up event listeners
  useEffect(() => {
    if (!canvas) return;
    
    // Clear drawing mode when tool changes
    if (lastToolRef.current !== tool) {
      // If switching from drawing tool, save state
      if (
        lastToolRef.current === DrawingMode.DRAW ||
        lastToolRef.current === DrawingMode.STRAIGHT_LINE
      ) {
        saveCurrentState();
        if (onDrawingComplete) {
          onDrawingComplete();
        }
      }
      
      lastToolRef.current = tool;
    }
    
    // Set drawing mode based on tool
    canvas.isDrawingMode = tool === DrawingMode.DRAW;
    
    // Configure free drawing brush
    if (canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.color = lineColor;
      canvas.freeDrawingBrush.width = lineThickness;
    }
    
    // Event handlers
    const handlePathCreated = () => {
      saveCurrentState();
      if (onDrawingComplete) {
        onDrawingComplete();
      }
    };
    
    const handleObjectModified = () => {
      saveCurrentState();
      needsSaveRef.current = true;
    };
    
    const handleObjectAdded = (e: any) => {
      // Don't save state for drawing tools as they already save when path is created
      if (tool !== DrawingMode.DRAW && tool !== DrawingMode.STRAIGHT_LINE) {
        saveCurrentState();
        needsSaveRef.current = true;
      }
    };
    
    const handleObjectRemoved = () => {
      saveCurrentState();
      needsSaveRef.current = true;
    };
    
    const handleMouseUp = () => {
      // If we need to save, invoke the callback
      if (needsSaveRef.current) {
        if (onDrawingComplete) {
          onDrawingComplete();
        }
        needsSaveRef.current = false;
      }
    };
    
    // Register event listeners
    canvas.on('path:created', handlePathCreated);
    canvas.on('object:modified', handleObjectModified);
    canvas.on('object:added', handleObjectAdded);
    canvas.on('object:removed', handleObjectRemoved);
    canvas.on('mouse:up', handleMouseUp);
    canvas.on('selection:cleared', handleMouseUp);
    
    return () => {
      // Remove event listeners
      canvas.off('path:created', handlePathCreated);
      canvas.off('object:modified', handleObjectModified);
      canvas.off('object:added', handleObjectAdded);
      canvas.off('object:removed', handleObjectRemoved);
      canvas.off('mouse:up', handleMouseUp);
      canvas.off('selection:cleared', handleMouseUp);
    };
  }, [canvas, tool, lineColor, lineThickness, saveCurrentState, onDrawingComplete]);
  
  // Empty render as this is just an event manager
  return null;
};
