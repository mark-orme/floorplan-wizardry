
/**
 * Canvas persistence hook
 * Manages loading and saving canvas data to localStorage and IndexedDB
 */
import { useState, useCallback } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { saveCanvasToIDB, loadCanvasFromIDB, clearSavedCanvas as clearIDBCanvas } from '@/utils/storage/idbCanvasStore';
import { validateCanvasData, sanitizeCanvasData } from '@/utils/validation/canvasValidation';
import { handleError } from '@/utils/errorHandling';

interface UseCanvasPersistenceProps {
  canvasId: string;
  onSave?: (success: boolean) => void;
  onRestore?: (success: boolean) => void;
}

/**
 * Hook for managing canvas persistence to localStorage and IndexedDB
 */
export function useCanvasPersistence({
  canvasId,
  onSave,
  onRestore
}: UseCanvasPersistenceProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  const canvasKey = `canvas_state_${canvasId}`;
  const timestampKey = `canvas_timestamp_${canvasId}`;
  
  const [savedCanvas, setSavedCanvas] = useLocalStorage<string | null>(canvasKey, null);
  const [savedTimestamp, setSavedTimestamp] = useLocalStorage<string | null>(timestampKey, null);
  
  /**
   * Save canvas to both localStorage and IndexedDB
   */
  const saveCanvas = useCallback(async (canvas: FabricCanvas) => {
    if (!canvas) return false;
    
    try {
      setIsSaving(true);
      
      const json = canvas.toJSON(['objectType']);
      
      if (!validateCanvasData(json)) {
        console.warn('Invalid canvas data detected during save');
        return false;
      }
      
      const sanitizedData = sanitizeCanvasData(json);
      if (!sanitizedData) {
        console.warn('Failed to sanitize canvas data during save');
        return false;
      }
      
      const jsonString = JSON.stringify(sanitizedData);
      
      // Save to localStorage
      setSavedCanvas(jsonString);
      const now = new Date();
      setSavedTimestamp(now.toISOString());
      setLastSaved(now);
      
      // Save to IndexedDB
      try {
        await saveCanvasToIDB(canvasId, sanitizedData);
        canvas.renderAll();
      } catch (idbError) {
        console.warn('Failed to save to IndexedDB, using localStorage only:', idbError);
      }
      
      if (onSave) onSave(true);
      return true;
    } catch (error) {
      handleError(error, 'error', {
        component: 'useCanvasPersistence',
        operation: 'saveCanvas',
        context: { canvasId }
      });
      if (onSave) onSave(false);
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [canvasId, setSavedCanvas, setSavedTimestamp, onSave]);
  
  /**
   * Restore canvas from localStorage or IndexedDB
   */
  const restoreCanvas = useCallback(async (canvas: FabricCanvas) => {
    if (!canvas) return false;
    
    try {
      setIsLoading(true);
      
      // First try loading from IndexedDB
      let canvasData;
      try {
        canvasData = await loadCanvasFromIDB(canvasId);
      } catch (idbError) {
        console.warn('Failed to load from IndexedDB, trying localStorage:', idbError);
      }
      
      // Fall back to localStorage if needed
      if (!canvasData && savedCanvas) {
        try {
          canvasData = JSON.parse(savedCanvas);
        } catch (parseError) {
          console.error('Error parsing saved canvas JSON:', parseError);
          return false;
        }
      }
      
      if (!canvasData) {
        console.warn('No saved canvas data found');
        return false;
      }
      
      // Save grid objects to reapply after loading
      const gridObjects = canvas.getObjects().filter(obj => (obj as any).objectType === 'grid');
      
      // Load the canvas data
      canvas.loadFromJSON(canvasData, () => {
        // Re-add and position grid objects
        gridObjects.forEach(obj => canvas.add(obj));
        gridObjects.forEach(obj => canvas.sendToBack(obj));
        canvas.renderAll();
        
        if (onRestore) onRestore(true);
      });
      
      return true;
    } catch (error) {
      handleError(error, 'error', {
        component: 'useCanvasPersistence',
        operation: 'restoreCanvas',
        context: { canvasId }
      });
      
      if (onRestore) onRestore(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [canvasId, savedCanvas, onRestore]);
  
  /**
   * Clear all saved canvas data
   */
  const clearSavedCanvas = useCallback(async () => {
    setSavedCanvas(null);
    setSavedTimestamp(null);
    setLastSaved(null);
    
    try {
      await clearIDBCanvas(canvasId);
    } catch (error) {
      console.error('Error clearing canvas from IndexedDB:', error);
    }
  }, [canvasId, setSavedCanvas, setSavedTimestamp]);
  
  return {
    isSaving,
    isLoading,
    lastSaved,
    savedCanvas,
    savedTimestamp,
    saveCanvas,
    restoreCanvas,
    clearSavedCanvas
  };
}
