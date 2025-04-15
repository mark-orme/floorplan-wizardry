
import { DrawingMode } from "@/constants/drawingModes";
import { Canvas as FabricCanvas } from "fabric";
import { toast } from "sonner";

export const useToolbarActions = (canvas: FabricCanvas | null) => {
  const handleToolChange = (tool: DrawingMode) => {
    if (canvas) {
      canvas.isDrawingMode = tool === DrawingMode.DRAW;
      canvas.renderAll();
    }
    return tool;
  };

  const handleUndo = () => {
    // Placeholder for undo functionality
    toast.info("Undo feature coming soon");
  };

  const handleRedo = () => {
    // Placeholder for redo functionality
    toast.info("Redo feature coming soon");
  };

  const handleClear = () => {
    if (canvas) {
      // Clear only non-grid objects
      const objects = canvas.getObjects().filter(obj => !(obj as any).isGrid);
      objects.forEach(obj => canvas.remove(obj));
      canvas.renderAll();
      toast.success("Canvas cleared");
    }
  };

  const handleSave = () => {
    toast.info("Save feature coming soon");
  };

  const handleDelete = () => {
    if (canvas) {
      const selectedObjects = canvas.getActiveObjects();
      if (selectedObjects.length > 0) {
        canvas.remove(...selectedObjects);
        canvas.discardActiveObject();
        canvas.renderAll();
        toast.success(`Deleted ${selectedObjects.length} object(s)`);
      } else {
        toast.info("No objects selected");
      }
    }
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
