
import React, { useEffect } from "react";
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { DrawingMode } from "@/constants/drawingModes";

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
    };
    
    const handleObjectAdded = () => {
      saveCurrentState();
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
        break;
        
      case DrawingMode.DRAW:
        canvas.isDrawingMode = true;
        canvas.freeDrawingBrush.width = lineThickness;
        canvas.freeDrawingBrush.color = lineColor;
        canvas.defaultCursor = 'crosshair';
        break;
        
      case DrawingMode.HAND:
        canvas.defaultCursor = 'grab';
        canvas.hoverCursor = 'grab';
        // Enable panning mode
        break;
        
      case DrawingMode.STRAIGHT_LINE:
      case DrawingMode.ROOM:
        canvas.defaultCursor = 'crosshair';
        canvas.hoverCursor = 'crosshair';
        break;
        
      case DrawingMode.ERASER:
        canvas.defaultCursor = 'cell';
        canvas.hoverCursor = 'cell';
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
  }, [tool, lineThickness, lineColor, canvas, gridLayerRef]);
  
  return null; // This component doesn't render anything
};
