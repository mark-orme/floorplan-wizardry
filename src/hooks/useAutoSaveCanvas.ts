
/**
 * Custom hook for automatic canvas saving and restoring
 * @module hooks/useAutoSaveCanvas
 */
import { useEffect, useState, useCallback, useRef } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { toast } from 'sonner';
import { useLocalStorage } from './useLocalStorage';
import { debounce } from '@/utils/throttleUtils';
import { saveCanvasToIDB, loadCanvasFromIDB } from '@/utils/storage/idbCanvasStore';
import { validateCanvasData, sanitizeCanvasData } from '@/utils/validation/canvasValidation';
import { handleError } from '@/utils/errorHandling';

interface UseAutoSaveCanvasProps {
  canvas: FabricCanvas | null;
  canvasId: string;
  debounceMs?: number;
  onSave?: (success: boolean) => void;
  onRestore?: (success: boolean) => void;
}

/**
 * Hook for automatic canvas saving and restoring
 * Provides both localStorage and IndexedDB persistence options
 */
export const useAutoSaveCanvas = ({
  canvas,
  canvasId,
  debounceMs = 2000,
  onSave,
  onRestore
}: UseAutoSaveCanvasProps) => {
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [canRestore, setCanRestore] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const setupDoneRef = useRef(false);
  
  const canvasKey = `canvas_state_${canvasId}`;
  const timestampKey = `canvas_timestamp_${canvasId}`;
  
  const [savedCanvas, setSavedCanvas] = useLocalStorage<string | null>(canvasKey, null);
  const [savedTimestamp, setSavedTimestamp] = useLocalStorage<string | null>(timestampKey, null);
  
  useEffect(() => {
    const checkCanRestore = async () => {
      if (savedCanvas && savedTimestamp) {
        setCanRestore(true);
        return;
      }
      
      try {
        const idbData = await loadCanvasFromIDB(canvasId);
        if (idbData) {
          setCanRestore(true);
        }
      } catch (error) {
        console.error('Error checking IndexedDB for canvas data:', error);
      }
    };
    
    checkCanRestore();
  }, [savedCanvas, savedTimestamp, canvasId]);
  
  const saveCanvas = useCallback(async () => {
    if (!canvas) return false;
    
    try {
      setIsSaving(true);
      
      const json = canvas.toJSON(['objectType']);
      
      if (!validateCanvasData(json)) {
        console.warn('Invalid canvas data detected during autosave');
        return false;
      }
      
      const sanitizedData = sanitizeCanvasData(json);
      if (!sanitizedData) {
        console.warn('Failed to sanitize canvas data during autosave');
        return false;
      }
      
      const jsonString = JSON.stringify(sanitizedData);
      
      setSavedCanvas(jsonString);
      const now = new Date();
      setSavedTimestamp(now.toISOString());
      setLastSaved(now);
      
      try {
        await saveCanvasToIDB(canvasId, sanitizedData);
      } catch (idbError) {
        console.warn('Failed to save to IndexedDB, using localStorage only:', idbError);
      }
      
      if (onSave) onSave(true);
      
      return true;
    } catch (error) {
      handleError(error, 'error', {
        component: 'useAutoSaveCanvas',
        operation: 'saveCanvas',
        context: { canvasId }
      });
      if (onSave) onSave(false);
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [canvas, canvasId, setSavedCanvas, setSavedTimestamp, onSave]);
  
  // Create debounced save function
  const debouncedSaveRef = useRef<() => void>();
  
  // Update the debounced function when its dependencies change
  useEffect(() => {
    debouncedSaveRef.current = debounce(() => {
      saveCanvas();
    }, debounceMs);
  }, [saveCanvas, debounceMs]);
  
  const restoreCanvas = useCallback(async () => {
    if (!canvas) return false;
    
    try {
      setIsLoading(true);
      
      let canvasData;
      try {
        canvasData = await loadCanvasFromIDB(canvasId);
      } catch (idbError) {
        console.warn('Failed to load from IndexedDB, trying localStorage:', idbError);
      }
      
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
      
      const gridObjects = canvas.getObjects().filter(obj => (obj as any).objectType === 'grid');
      
      canvas.loadFromJSON(canvasData, () => {
        gridObjects.forEach(obj => canvas.add(obj));
        gridObjects.forEach(obj => canvas.sendToBack(obj));
        canvas.renderAll();
        
        if (onRestore) onRestore(true);
      });
      
      return true;
    } catch (error) {
      handleError(error, 'error', {
        component: 'useAutoSaveCanvas',
        operation: 'restoreCanvas',
        context: { canvasId }
      });
      
      if (onRestore) onRestore(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [canvas, canvasId, savedCanvas, onRestore]);
  
  const clearSavedCanvas = useCallback(async () => {
    setSavedCanvas(null);
    setSavedTimestamp(null);
    setLastSaved(null);
    setCanRestore(false);
    
    try {
      await clearSavedCanvasFromIDB(canvasId);
    } catch (error) {
      console.error('Error clearing canvas from IndexedDB:', error);
    }
  }, [canvasId, setSavedCanvas, setSavedTimestamp]);
  
  useEffect(() => {
    if (!canvas || setupDoneRef.current) return;
    
    const saveEvents = [
      'object:added',
      'object:modified',
      'object:removed',
      'path:created'
    ];
    
    const handleChange = () => {
      if (debouncedSaveRef.current) {
        debouncedSaveRef.current();
      }
    };
    
    saveEvents.forEach(event => {
      canvas.on(event as any, handleChange);
    });
    
    setupDoneRef.current = true;
    
    return () => {
      if (canvas) {
        saveEvents.forEach(event => {
          canvas.off(event as any, handleChange);
        });
      }
    };
  }, [canvas]);
  
  return {
    isSaving,
    isLoading,
    lastSaved,
    canRestore,
    saveCanvas,
    restoreCanvas,
    clearSavedCanvas
  };
};

async function clearSavedCanvasFromIDB(canvasId: string): Promise<void> {
  try {
    const { clearSavedCanvas } = await import('@/utils/storage/idbCanvasStore');
    await clearSavedCanvas(canvasId);
  } catch (error) {
    console.error('Error clearing canvas from IndexedDB:', error);
  }
}
