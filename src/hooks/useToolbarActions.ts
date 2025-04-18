
import { DrawingMode } from "@/constants/drawingModes";
import { Canvas as FabricCanvas } from "fabric";
import { toast } from "sonner";
import { useCanvasUndoRedo } from "@/hooks/useCanvasUndoRedo";

export const useToolbarActions = (canvas: FabricCanvas | null) => {
  // Initialize canvas undo/redo functionality
  const { undo, redo, canUndo, canRedo } = useCanvasUndoRedo({
    canvas,
    maxHistoryStates: 50,
    captureDelay: 300
  });

  const handleToolChange = (tool: DrawingMode) => {
    if (canvas) {
      canvas.isDrawingMode = tool === DrawingMode.DRAW;
      
      // Reset selection when switching tools
      canvas.discardActiveObject();
      canvas.renderAll();
      
      toast.info(`Switched to ${tool} tool`);
    }
    return tool;
  };

  const handleUndo = () => {
    if (!canvas) return;
    undo();
  };

  const handleRedo = () => {
    if (!canvas) return;
    redo();
  };

  const handleClear = () => {
    if (!canvas) return;

    const objects = canvas.getObjects();
    if (objects.length === 0) {
      toast.info("Canvas is already empty");
      return;
    }
    
    // Clear only non-grid objects
    objects.forEach(obj => {
      if (!(obj as any).isGrid) {
        canvas.remove(obj);
      }
    });
    
    canvas.renderAll();
    toast.success("Canvas cleared");
  };

  const handleSave = () => {
    if (!canvas) return;
    
    try {
      const json = canvas.toJSON();
      localStorage.setItem('canvasState', JSON.stringify(json));
      toast.success("Canvas state saved");
    } catch (error) {
      console.error('Error saving canvas:', error);
      toast.error("Failed to save canvas state");
    }
  };

  const handleDelete = () => {
    if (!canvas) return;

    const selectedObjects = canvas.getActiveObjects();
    if (selectedObjects.length === 0) {
      toast.info("No objects selected");
      return;
    }

    // Filter out grid objects
    const deletableObjects = selectedObjects.filter(obj => !(obj as any).isGrid);
    
    if (deletableObjects.length === 0) {
      toast.info("Cannot delete grid objects");
      return;
    }

    canvas.remove(...deletableObjects);
    canvas.discardActiveObject();
    canvas.renderAll();
    toast.success(`Deleted ${deletableObjects.length} object(s)`);
  };

  return {
    handleToolChange,
    handleUndo,
    handleRedo,
    handleClear,
    handleSave,
    handleDelete,
    canUndo,
    canRedo
  };
};
