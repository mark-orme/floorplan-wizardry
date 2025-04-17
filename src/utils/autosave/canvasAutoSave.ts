
/**
 * Canvas autosave utilities
 * Handles automatic saving and loading of canvas state
 * @module utils/autosave/canvasAutoSave
 */
import { Canvas as FabricCanvas } from 'fabric';

// Storage keys
const STORAGE_KEY_CANVAS = 'canvas_autosave_data';
const STORAGE_KEY_TIMESTAMP = 'canvas_autosave_timestamp';
const STORAGE_KEY_VERSION = 'canvas_autosave_version';

// Current autosave version - increment when making breaking changes
const CURRENT_VERSION = '1.0';

/**
 * Save canvas state to localStorage
 * @param canvas The fabric canvas to save
 * @returns True if save was successful
 */
export const saveCanvasToLocalStorage = (canvas: FabricCanvas | null): boolean => {
  if (!canvas) return false;
  
  try {
    // Only save non-grid objects
    const objects = canvas.getObjects().filter(obj => !(obj as any).isGrid);
    
    if (objects.length === 0) {
      // No need to save if there are no drawing objects
      return false;
    }
    
    // Serialize canvas
    const json = canvas.toJSON();
    const serializedCanvas = JSON.stringify(json);
    
    // Save to localStorage with timestamp and version
    localStorage.setItem(STORAGE_KEY_CANVAS, serializedCanvas);
    localStorage.setItem(STORAGE_KEY_TIMESTAMP, new Date().toISOString());
    localStorage.setItem(STORAGE_KEY_VERSION, CURRENT_VERSION);
    
    console.info('Canvas state autosaved to localStorage');
    return true;
  } catch (error) {
    console.error('Error autosaving canvas to localStorage:', error);
    return false;
  }
};

/**
 * Load canvas state from localStorage
 * @param canvas The fabric canvas to load into
 * @returns True if load was successful
 */
export const loadCanvasFromLocalStorage = (canvas: FabricCanvas | null): boolean => {
  if (!canvas) return false;
  
  try {
    // Check if we have saved data
    const savedData = localStorage.getItem(STORAGE_KEY_CANVAS);
    const savedVersion = localStorage.getItem(STORAGE_KEY_VERSION);
    const savedTimestamp = localStorage.getItem(STORAGE_KEY_TIMESTAMP);
    
    if (!savedData || !savedVersion || !savedTimestamp) {
      console.info('No autosaved canvas data found');
      return false;
    }
    
    // Version check
    if (savedVersion !== CURRENT_VERSION) {
      console.warn('Autosaved canvas version mismatch - cannot load');
      return false;
    }
    
    // Load from JSON
    canvas.loadFromJSON(savedData, () => {
      canvas.renderAll();
      console.info('Loaded canvas state from localStorage');
    });
    
    return true;
  } catch (error) {
    console.error('Error loading canvas from localStorage:', error);
    return false;
  }
};

/**
 * Clear saved canvas data from localStorage
 */
export const clearSavedCanvasData = (): void => {
  localStorage.removeItem(STORAGE_KEY_CANVAS);
  localStorage.removeItem(STORAGE_KEY_TIMESTAMP);
  localStorage.removeItem(STORAGE_KEY_VERSION);
  console.info('Cleared autosaved canvas data');
};

/**
 * Convert a past date to a human-readable string
 * @param date The past date
 * @returns Human-readable time elapsed string
 */
export const getTimeElapsedString = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  
  // Convert to seconds
  const diffSec = Math.floor(diffMs / 1000);
  
  if (diffSec < 60) {
    return `${diffSec} seconds`;
  }
  
  // Convert to minutes
  const diffMin = Math.floor(diffSec / 60);
  
  if (diffMin < 60) {
    return `${diffMin} minute${diffMin !== 1 ? 's' : ''}`;
  }
  
  // Convert to hours
  const diffHour = Math.floor(diffMin / 60);
  
  if (diffHour < 24) {
    return `${diffHour} hour${diffHour !== 1 ? 's' : ''}`;
  }
  
  // Convert to days
  const diffDay = Math.floor(diffHour / 24);
  
  return `${diffDay} day${diffDay !== 1 ? 's' : ''}`;
};
