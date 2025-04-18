
/**
 * Canvas autosave utilities
 * Handles automatic saving and loading of canvas state
 * @module utils/autosave/canvasAutoSave
 */
import { Canvas as FabricCanvas } from 'fabric';
import logger from '@/utils/logger';

// Storage keys
const STORAGE_KEY_CANVAS = 'canvas_autosave_data';
const STORAGE_KEY_TIMESTAMP = 'canvas_autosave_timestamp';
const STORAGE_KEY_VERSION = 'canvas_autosave_version';

// Current autosave version - increment when making breaking changes
const CURRENT_VERSION = '1.0';

export const saveCanvasToLocalStorage = (canvas: FabricCanvas | null): boolean => {
  if (!canvas) return false;
  
  try {
    // Only save non-grid objects
    const objects = canvas.getObjects().filter(obj => !(obj as any).isGrid);
    
    if (objects.length === 0) {
      logger.debug('No objects to save');
      return false;
    }
    
    const json = canvas.toJSON();
    const serializedCanvas = JSON.stringify(json);
    
    localStorage.setItem(STORAGE_KEY_CANVAS, serializedCanvas);
    localStorage.setItem(STORAGE_KEY_TIMESTAMP, new Date().toISOString());
    localStorage.setItem(STORAGE_KEY_VERSION, CURRENT_VERSION);
    
    logger.info('Canvas state autosaved');
    return true;
  } catch (error) {
    logger.error('Error autosaving canvas:', error);
    return false;
  }
};

export const loadCanvasFromLocalStorage = (canvas: FabricCanvas | null): boolean => {
  if (!canvas) return false;
  
  try {
    const savedData = localStorage.getItem(STORAGE_KEY_CANVAS);
    const savedVersion = localStorage.getItem(STORAGE_KEY_VERSION);
    const savedTimestamp = localStorage.getItem(STORAGE_KEY_TIMESTAMP);
    
    if (!savedData || !savedVersion || !savedTimestamp) {
      logger.info('No autosaved canvas data found');
      return false;
    }
    
    if (savedVersion !== CURRENT_VERSION) {
      logger.warn('Autosaved canvas version mismatch');
      return false;
    }
    
    canvas.loadFromJSON(savedData, () => {
      canvas.renderAll();
      logger.info('Canvas state restored from autosave');
    });
    
    return true;
  } catch (error) {
    logger.error('Error loading canvas from autosave:', error);
    return false;
  }
};

export const clearSavedCanvasData = (): void => {
  localStorage.removeItem(STORAGE_KEY_CANVAS);
  localStorage.removeItem(STORAGE_KEY_TIMESTAMP);
  localStorage.removeItem(STORAGE_KEY_VERSION);
  logger.info('Cleared autosaved canvas data');
};

export const getTimeElapsedString = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  
  if (diffSec < 60) return `${diffSec} seconds`;
  
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} minute${diffMin !== 1 ? 's' : ''}`;
  
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour} hour${diffHour !== 1 ? 's' : ''}`;
  
  const diffDay = Math.floor(diffHour / 24);
  return `${diffDay} day${diffDay !== 1 ? 's' : ''}`;
};
