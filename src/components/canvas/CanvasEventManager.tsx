
import React, { useEffect } from "react";
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { DrawingMode } from "@/constants/drawingModes";
import { toast } from "sonner";

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
  // Effect to set up canvas event listeners
  useEffect(() => {
    if (!canvas) return;
    
    // Save initial state
    saveCurrentState();
    
    // Set up history tracking
    const handleObjectModified = () => {
      saveCurrentState();
      console.log("Object modified, saving state");
    };
    
    const handleObjectAdded = () => {
      saveCurrentState();
      console.log("Object added, saving state");
    };
    
    // Add event listeners
    canvas.on('object:modified', handleObjectModified);
    canvas.on('object:added', handleObjectAdded);
    
    // Handle keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // Undo: Ctrl+Z
      if (e.ctrlKey && e.key === 'z') {
        e.preventDefault();
        undo();
      }
      
      // Redo: Ctrl+Shift+Z or Ctrl+Y
      if ((e.ctrlKey && e.shiftKey && e.key === 'z') || (e.ctrlKey && e.key === 'y')) {
        e.preventDefault();
        redo();
      }
      
      // Delete: Delete key when in select mode
      if (e.key === 'Delete' && tool === DrawingMode.SELECT) {
        e.preventDefault();
        deleteSelectedObjects();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      canvas.off('object:modified', handleObjectModified);
      canvas.off('object:added', handleObjectAdded);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [canvas, tool, saveCurrentState, undo, redo, deleteSelectedObjects]);
  
  // Effect to handle tool changes
  useEffect(() => {
    if (!canvas) return;
    
    // Reset canvas modes
    canvas.isDrawingMode = false;
    canvas.selection = false;
    
    // Apply tool-specific settings
    switch (tool) {
      case DrawingMode.SELECT:
        canvas.selection = true;
        canvas.defaultCursor = 'default';
        canvas.hoverCursor = 'move';
        toast.info("Select tool: Click objects to select them");
        break;
        
      case DrawingMode.DRAW:
        canvas.isDrawingMode = true;
        if (canvas.freeDrawingBrush) {
          canvas.freeDrawingBrush.width = lineThickness;
          canvas.freeDrawingBrush.color = lineColor;
        }
        canvas.defaultCursor = 'crosshair';
        toast.info("Draw tool: Click and drag to draw freehand");
        break;
        
      case DrawingMode.HAND:
        canvas.defaultCursor = 'grab';
        canvas.hoverCursor = 'grab';
        canvas.selection = false;
        toast.info("Hand tool: Click and drag to pan the canvas");
        // Set up panning mode handlers
        break;
        
      case DrawingMode.STRAIGHT_LINE:
        canvas.defaultCursor = 'crosshair';
        canvas.hoverCursor = 'crosshair';
        canvas.selection = false;
        toast.info("Line tool: Click and drag to draw a straight line");
        break;
        
      case DrawingMode.ERASER:
        canvas.defaultCursor = 'cell';
        canvas.hoverCursor = 'cell';
        canvas.selection = true;
        toast.info("Eraser tool: Select objects to delete them");
        break;
        
      default:
        canvas.selection = true;
        break;
    }
    
    // Ensure grid stays at the bottom
    if (gridLayerRef.current.length > 0) {
      gridLayerRef.current.forEach(obj => {
        if (canvas.contains(obj)) {
          canvas.sendObjectToBack(obj);
        }
      });
    }
    
    canvas.renderAll();
  }, [tool, lineThickness, lineColor, canvas, gridLayerRef]);
  
  return null; // This component doesn't render anything
};
