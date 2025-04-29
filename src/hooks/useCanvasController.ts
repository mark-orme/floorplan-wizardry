
import { useCallback } from 'react';
import { Canvas as FabricCanvas, ActiveSelection, Object as FabricObject } from 'fabric';
import { toast } from 'sonner';
import { saveCanvasToLocalStorage } from '@/utils/autosave/canvasAutoSave';

export const useCanvasController = (canvas: FabricCanvas | null) => {
  const clearCanvas = useCallback(() => {
    if (!canvas) return;
    
    const nonGridObjects = canvas.getObjects().filter(obj => {
      return !(obj as any).isGrid;
    });
    
    if (nonGridObjects.length === 0) {
      toast.info("Canvas is already empty");
      return;
    }
    
    nonGridObjects.forEach(obj => canvas.remove(obj));
    canvas.renderAll();
    saveCanvasToLocalStorage(canvas);
    toast.success("Canvas cleared");
  }, [canvas]);

  const deleteSelectedObjects = useCallback(() => {
    if (!canvas) return;
    
    const selectedObjects = canvas.getActiveObjects().filter(obj => !(obj as any).isGrid);
    
    if (selectedObjects.length === 0) {
      toast.info("No objects selected or only grid objects selected");
      return;
    }
    
    canvas.remove(...selectedObjects);
    canvas.discardActiveObject();
    canvas.renderAll();
    saveCanvasToLocalStorage(canvas);
    toast.success(`Deleted ${selectedObjects.length} object(s)`);
  }, [canvas]);
  
  const saveCanvas = useCallback(async () => {
    if (!canvas) return false;
    
    try {
      // Save to local storage
      saveCanvasToLocalStorage(canvas);
      
      // Save selected objects state
      const activeObjects = canvas.getActiveObjects();
      if (activeObjects.length > 0) {
        canvas.discardActiveObject();
        canvas.renderAll();
        
        // Reselect objects after saving - fixing the ActiveSelection creation
        if (canvas.setActiveObject && activeObjects.length > 0) {
          const selection = new ActiveSelection(activeObjects as FabricObject[], {});
          if (selection.set) {
            selection.set('canvas', canvas);
          }
          canvas.setActiveObject(selection);
          canvas.requestRenderAll();
        }
      }
      
      toast.success("Canvas saved successfully");
      return true;
    } catch (error) {
      console.error("Error saving canvas:", error);
      toast.error("Failed to save canvas");
      return false;
    }
  }, [canvas]);

  return {
    clearCanvas,
    deleteSelectedObjects,
    saveCanvas
  };
};
