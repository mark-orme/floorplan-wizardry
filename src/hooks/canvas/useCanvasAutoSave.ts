
/**
 * Canvas auto-save hook
 * Automatically saves canvas when changes are detected
 */
import { useEffect, useRef, useCallback } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { debounce } from '@/utils/throttleUtils';
import { useCanvasPersistence } from './useCanvasPersistence';

interface UseCanvasAutoSaveProps {
  canvas: FabricCanvas | null;
  canvasId: string;
  debounceMs?: number;
  onSave?: (success: boolean) => void;
  onRestore?: (success: boolean) => void;
}

/**
 * Hook for automatically saving canvas changes
 */
export function useCanvasAutoSave({
  canvas,
  canvasId,
  debounceMs = 2000,
  onSave,
  onRestore
}: UseCanvasAutoSaveProps) {
  const setupDoneRef = useRef(false);
  const debouncedSaveRef = useRef<() => void>();
  
  const {
    isSaving,
    isLoading,
    lastSaved,
    saveCanvas,
    restoreCanvas,
    clearSavedCanvas
  } = useCanvasPersistence({ canvasId, onSave, onRestore });
  
  // Create a wrapper function for saving the current canvas
  const saveCurrentCanvas = useCallback(async () => {
    if (!canvas) return false;
    return saveCanvas(canvas);
  }, [canvas, saveCanvas]);
  
  // Set up debounced save function
  useEffect(() => {
    const saveFn = () => {
      saveCurrentCanvas();
    };
    debouncedSaveRef.current = debounce(saveFn, debounceMs);
  }, [saveCurrentCanvas, debounceMs]);
  
  // Set up canvas event listeners for auto-saving
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
  
  // Wrapper for restoring the current canvas
  const restoreCurrentCanvas = useCallback(async () => {
    if (!canvas) return false;
    return restoreCanvas(canvas);
  }, [canvas, restoreCanvas]);
  
  return {
    isSaving,
    isLoading,
    lastSaved,
    saveCanvas: saveCurrentCanvas,
    restoreCanvas: restoreCurrentCanvas,
    clearSavedCanvas
  };
}
