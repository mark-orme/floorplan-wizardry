
import { Canvas as FabricCanvas } from 'fabric';
import { toast } from 'sonner';
import logger from '@/utils/logger';

export const saveCanvasState = async (canvas: FabricCanvas | null) => {
  if (!canvas) return;

  try {
    const json = canvas.toJSON(['id', 'type']);
    localStorage.setItem('canvas_objects', JSON.stringify(json));
    localStorage.setItem('canvas_saved_at', new Date().toISOString());
    
    // Send canvas state to backend if user is logged in
    // This is handled by useSupabaseFloorPlans in useCanvasPersistence
    // No additional implementation needed here as it's handled by the hooks
    
    logger.info("Canvas state saved successfully");
  } catch (error) {
    logger.error('Error saving canvas state:', error);
    toast.error('Failed to save drawing');
  }
};

export const loadCanvasState = async (canvas: FabricCanvas | null) => {
  if (!canvas) return;

  try {
    const savedState = localStorage.getItem('canvas_objects');
    if (!savedState) {
      logger.info("No saved canvas state found");
      return;
    }

    const json = JSON.parse(savedState);
    canvas.loadFromJSON(json, () => {
      canvas.renderAll();
      logger.info("Canvas state restored successfully");
    });
  } catch (error) {
    logger.error('Error loading canvas state:', error);
    toast.error('Failed to load saved drawing');
  }
};
