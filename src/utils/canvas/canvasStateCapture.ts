
import { Canvas as FabricCanvas } from 'fabric';
import logger from '@/utils/logger';

interface CanvasState {
  version: string;
  data: string;
  timestamp: string;
}

const CURRENT_VERSION = '1.0';

export const captureCanvasState = (canvas: FabricCanvas): string => {
  try {
    const json = canvas.toJSON(['id', 'type', 'objectType']);
    const state: CanvasState = {
      version: CURRENT_VERSION,
      data: JSON.stringify(json),
      timestamp: new Date().toISOString()
    };
    return JSON.stringify(state);
  } catch (error) {
    logger.error('Error capturing canvas state:', error);
    throw new Error('Failed to capture canvas state');
  }
};

export const applyCanvasState = (canvas: FabricCanvas, stateStr: string): void => {
  try {
    const state: CanvasState = JSON.parse(stateStr);
    
    // Version check
    if (state.version !== CURRENT_VERSION) {
      logger.warn(`Canvas state version mismatch. Expected ${CURRENT_VERSION}, got ${state.version}`);
    }
    
    const canvasData = JSON.parse(state.data);
    canvas.loadFromJSON(canvasData, () => {
      canvas.renderAll();
      logger.debug('Canvas state restored', { timestamp: state.timestamp });
    });
  } catch (error) {
    logger.error('Error applying canvas state:', error);
    throw new Error('Failed to apply canvas state');
  }
};
