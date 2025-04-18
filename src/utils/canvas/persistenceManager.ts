
import { Canvas as FabricCanvas } from 'fabric';
import { toast } from 'sonner';
import logger from '@/utils/logger';

const STORAGE_KEY = 'canvas_state';

export const persistCanvasState = async (canvas: FabricCanvas): Promise<boolean> => {
  try {
    const state = canvas.toJSON(['id', 'name', 'objectType', 'selectable', 'evented']);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    localStorage.setItem(`${STORAGE_KEY}_timestamp`, new Date().toISOString());
    logger.info('Canvas state persisted successfully');
    return true;
  } catch (error) {
    logger.error('Failed to persist canvas state:', error);
    toast.error('Failed to save canvas state');
    return false;
  }
};

export const restoreCanvasState = async (canvas: FabricCanvas): Promise<boolean> => {
  try {
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (!savedState) {
      logger.info('No saved canvas state found');
      return false;
    }

    const parsedState = JSON.parse(savedState);
    if (!parsedState || typeof parsedState !== 'object') {
      throw new Error('Invalid canvas state format');
    }

    canvas.loadFromJSON(parsedState, () => {
      canvas.renderAll();
      logger.info('Canvas state restored successfully');
      toast.success('Canvas restored successfully');
    });

    return true;
  } catch (error) {
    logger.error('Failed to restore canvas state:', error);
    toast.error('Failed to restore canvas state');
    return false;
  }
};

export const clearCanvasState = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(`${STORAGE_KEY}_timestamp`);
    logger.info('Canvas state cleared');
  } catch (error) {
    logger.error('Error clearing canvas state:', error);
    toast.error('Failed to clear canvas state');
  }
};
