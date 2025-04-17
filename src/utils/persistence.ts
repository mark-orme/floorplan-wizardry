
import { Canvas as FabricCanvas } from 'fabric';
import { toast } from 'sonner';

export const saveCanvasState = async (canvas: FabricCanvas | null) => {
  if (!canvas) return;

  try {
    const json = canvas.toJSON(['id', 'type']);
    localStorage.setItem('canvas_objects', JSON.stringify(json));
    localStorage.setItem('canvas_saved_at', new Date().toISOString());
    console.log("Canvas state saved successfully");
  } catch (error) {
    console.error('Error saving canvas state:', error);
    toast.error('Failed to save drawing');
  }
};

export const loadCanvasState = async (canvas: FabricCanvas | null) => {
  if (!canvas) return;

  try {
    const savedState = localStorage.getItem('canvas_objects');
    if (!savedState) {
      console.log("No saved canvas state found");
      return;
    }

    const json = JSON.parse(savedState);
    canvas.loadFromJSON(json, () => {
      canvas.renderAll();
      console.log("Canvas state restored successfully");
    });
  } catch (error) {
    console.error('Error loading canvas state:', error);
    toast.error('Failed to load saved drawing');
  }
};
