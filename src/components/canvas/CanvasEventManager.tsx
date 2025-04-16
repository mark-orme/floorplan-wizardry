
import { useEffect } from "react";
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { DrawingMode } from "@/constants/drawingModes";

interface CanvasEventManagerProps {
  canvas: FabricCanvas;
  tool: DrawingMode;
  lineThickness: number;
  lineColor: string;
  gridLayerRef: React.MutableRefObject<FabricObject[]>;
  saveCurrentState?: () => void;
  undo?: () => void;
  redo?: () => void;
  deleteSelectedObjects?: () => void;
}

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
  // Set up tool-specific canvas behavior
  useEffect(() => {
    if (!canvas) return;

    // Configure canvas based on active tool
    switch (tool) {
      case DrawingMode.SELECT:
        canvas.isDrawingMode = false;
        canvas.selection = true;
        canvas.defaultCursor = 'default';
        break;
      case DrawingMode.DRAW:
        canvas.isDrawingMode = true;
        canvas.freeDrawingBrush.width = lineThickness;
        canvas.freeDrawingBrush.color = lineColor;
        canvas.selection = false;
        canvas.defaultCursor = 'crosshair';
        break;
      case DrawingMode.STRAIGHT_LINE:
      case DrawingMode.WALL:
      case DrawingMode.RECTANGLE:
      case DrawingMode.CIRCLE:
        canvas.isDrawingMode = false;
        canvas.selection = false;
        canvas.defaultCursor = 'crosshair';
        break;
      case DrawingMode.PAN:
        canvas.isDrawingMode = false;
        canvas.selection = false;
        canvas.defaultCursor = 'grab';
        break;
      case DrawingMode.ERASER:
        canvas.isDrawingMode = false;
        canvas.selection = true;
        canvas.defaultCursor = 'cell';
        break;
      default:
        canvas.isDrawingMode = false;
        canvas.selection = true;
        canvas.defaultCursor = 'default';
    }

    // Send grid objects to back
    if (gridLayerRef.current.length > 0) {
      gridLayerRef.current.forEach(obj => {
        if (canvas.contains(obj)) {
          canvas.sendToBack(obj);
        }
      });
    }

    canvas.renderAll();
  }, [canvas, tool, lineThickness, lineColor, gridLayerRef]);

  // Keyboard event handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!canvas) return;

      // CTRL+Z for undo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey && undo) {
        e.preventDefault();
        undo();
      }

      // CTRL+SHIFT+Z or CTRL+Y for redo
      if (((e.ctrlKey || e.metaKey) && e.key === 'z' && e.shiftKey) || 
          ((e.ctrlKey || e.metaKey) && e.key === 'y') && redo) {
        e.preventDefault();
        redo();
      }

      // Delete or Backspace to delete selected objects
      if ((e.key === 'Delete' || e.key === 'Backspace') && deleteSelectedObjects) {
        if (canvas.getActiveObjects().length > 0) {
          e.preventDefault();
          deleteSelectedObjects();
        }
      }

      // Escape to deselect
      if (e.key === 'Escape') {
        canvas.discardActiveObject();
        canvas.requestRenderAll();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [canvas, undo, redo, deleteSelectedObjects]);

  return null;
};
