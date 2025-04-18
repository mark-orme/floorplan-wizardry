
import { Canvas as FabricCanvas } from 'fabric';
import logger from '@/utils/logger';

export const initializeBrush = (canvas: FabricCanvas, color: string, width: number): void => {
  try {
    if (!canvas.freeDrawingBrush) {
      logger.error('Failed to initialize brush - freeDrawingBrush not available');
      return;
    }

    canvas.freeDrawingBrush.color = color;
    canvas.freeDrawingBrush.width = width;
    canvas.freeDrawingBrush.limitedToCanvasSize = true;
    
    logger.info('Brush initialized successfully', { color, width });
  } catch (error) {
    logger.error('Error initializing brush:', error);
  }
};
