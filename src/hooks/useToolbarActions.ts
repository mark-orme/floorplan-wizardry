
import { DrawingMode } from "@/constants/drawingModes";
import { Canvas as FabricCanvas } from "fabric";
import { toast } from "sonner";

export const useToolbarActions = (canvas: FabricCanvas | null) => {
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

    if (canvas.getObjects().length > 0) {
      const objects = canvas.getObjects();
      const lastObject = objects[objects.length - 1];
      canvas.remove(lastObject);
      canvas.renderAll();
      toast.success("Undo successful");
    } else {
      toast.info("Nothing to undo");
    }
  };

  const handleRedo = () => {
    if (!canvas?.historyUndo?.length) {
      toast.info("Nothing to redo");
      return;
    }

    const lastUndo = canvas.historyUndo[canvas.historyUndo.length - 1];
    canvas.add(lastUndo);
    canvas.historyUndo.pop();
    canvas.renderAll();
    toast.success("Redo successful");
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
    handleDelete
  };
};
