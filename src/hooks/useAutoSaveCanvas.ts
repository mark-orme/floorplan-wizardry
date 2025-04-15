
/**
 * Custom hook for automatic canvas saving and restoring
 * @module hooks/useAutoSaveCanvas
 */
import { useEffect, useState, useCallback, useRef } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { toast } from 'sonner';
import { useLocalStorage } from './useLocalStorage';
import { debounce } from '@/utils/debounce';
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
  
  // Storage keys based on canvas ID
  const canvasKey = `canvas_state_${canvasId}`;
  const timestampKey = `canvas_timestamp_${canvasId}`;
  
  // Use local storage hook
  const [savedCanvas, setSavedCanvas] = useLocalStorage<string | null>(canvasKey, null);
  const [savedTimestamp, setSavedTimestamp] = useLocalStorage<string | null>(timestampKey, null);
  
  // Check if we can restore on mount
  useEffect(() => {
    const checkCanRestore = async () => {
      // Check localStorage
      if (savedCanvas && savedTimestamp) {
        setCanRestore(true);
        return;
      }
      
      // Also check IndexedDB
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
  
  // Save canvas state
  const saveCanvas = useCallback(async () => {
    if (!canvas) return false;
    
    try {
      setIsSaving(true);
      
      // Only save non-grid objects to reduce size
      const json = canvas.toJSON(['objectType']);
      
      // Validate canvas data before saving
      if (!validateCanvasData(json)) {
        console.warn('Invalid canvas data detected during autosave');
        return false;
      }
      
      // Sanitize the data
      const sanitizedData = sanitizeCanvasData(json);
      if (!sanitizedData) {
        console.warn('Failed to sanitize canvas data during autosave');
        return false;
      }
      
      const jsonString = JSON.stringify(sanitizedData);
      
      // Save to local storage
      setSavedCanvas(jsonString);
      const now = new Date();
      setSavedTimestamp(now.toISOString());
      setLastSaved(now);
      
      // Also save to IndexedDB for larger storage capacity
      try {
        await saveCanvasToIDB(canvasId, sanitizedData);
      } catch (idbError) {
        console.warn('Failed to save to IndexedDB, using localStorage only:', idbError);
      }
      
      // Notify success
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
  
  // Create the debounced function correctly
  const debouncedSave = useRef(
    debounce(saveCanvas, debounceMs)
  );
  
  // Restore canvas state
  const restoreCanvas = useCallback(async () => {
    if (!canvas) return false;
    
    try {
      setIsLoading(true);
      
      // Try loading from IndexedDB first (more reliable for larger data)
      let canvasData;
      try {
        canvasData = await loadCanvasFromIDB(canvasId);
      } catch (idbError) {
        console.warn('Failed to load from IndexedDB, trying localStorage:', idbError);
      }
      
      // Fall back to localStorage if IndexedDB failed
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
      
      // Store grid objects to preserve them
      const gridObjects = canvas.getObjects().filter(obj => (obj as any).objectType === 'grid');
      
      // Load the saved state
      canvas.loadFromJSON(canvasData, () => {
        // Restore grid objects
        gridObjects.forEach(obj => canvas.add(obj));
        
        // Send grid objects to back
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
  
  // Clear saved canvas
  const clearSavedCanvas = useCallback(async () => {
    setSavedCanvas(null);
    setSavedTimestamp(null);
    setLastSaved(null);
    setCanRestore(false);
    
    // Also clear from IndexedDB
    try {
      await clearSavedCanvasFromIDB(canvasId);
    } catch (error) {
      console.error('Error clearing canvas from IndexedDB:', error);
    }
  }, [canvasId, setSavedCanvas, setSavedTimestamp]);
  
  // Set up auto-save event listeners
  useEffect(() => {
    if (!canvas || setupDoneRef.current) return;
    
    // Define save events - use type assertion for fabric.js events
    const saveEvents = [
      'object:added',
      'object:modified',
      'object:removed',
      'path:created'
    ];
    
    const handleChange = () => {
      debouncedSave.current();
    };
    
    // Add event listeners with type assertion
    saveEvents.forEach(event => {
      // Using 'on' with a string event name is safe for Fabric.js
      canvas.on(event as any, handleChange);
    });
    
    setupDoneRef.current = true;
    
    // Clean up event listeners
    return () => {
      if (canvas) {
        saveEvents.forEach(event => {
          // Using 'off' with a string event name is safe for Fabric.js
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

// Helper function to clear canvas from IndexedDB
async function clearSavedCanvasFromIDB(canvasId: string): Promise<void> {
  try {
    const { clearSavedCanvas } = await import('@/utils/storage/idbCanvasStore');
    await clearSavedCanvas(canvasId);
  } catch (error) {
    console.error('Error clearing canvas from IndexedDB:', error);
  }
}
