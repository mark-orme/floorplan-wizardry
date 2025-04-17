
import { useCallback, useEffect, useRef, useState } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { toast } from 'sonner';
import { captureCanvasState, applyCanvasState } from '@/utils/canvas/canvasStateCapture';

interface UseAutoSaveCanvasProps {
  canvas: FabricCanvas | null;
  autoSaveInterval?: number; // in milliseconds
  storageKey?: string;
  onSave?: (success: boolean) => void;
  onRestore?: (success: boolean) => void;
}

export const useAutoSaveCanvas = ({
  canvas,
  autoSaveInterval = 30000, // Default: save every 30 seconds
  storageKey = 'canvas_autosave',
  onSave,
  onRestore
}: UseAutoSaveCanvasProps) => {
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const timerRef = useRef<number | null>(null);
  
  // Check if there's saved canvas data
  const canRestore = useCallback((): boolean => {
    return !!localStorage.getItem(`${storageKey}_data`);
  }, [storageKey]);

  // Save canvas state to localStorage
  const saveCanvas = useCallback((): boolean => {
    if (!canvas) return false;
    
    try {
      setIsSaving(true);
      
      // Get canvas state
      const state = captureCanvasState(canvas);
      if (!state) {
        console.warn("No canvas state to save");
        return false;
      }
      
      // Save to localStorage
      localStorage.setItem(`${storageKey}_data`, state);
      localStorage.setItem(`${storageKey}_timestamp`, new Date().toISOString());
      
      // Update last saved timestamp
      setLastSaved(new Date());
      
      console.log("Canvas state saved");
      
      // Call onSave callback if provided
      onSave?.(true);
      return true;
    } catch (error) {
      console.error("Error saving canvas state:", error);
      onSave?.(false);
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [canvas, storageKey, onSave]);

  // Restore canvas state from localStorage
  const restoreCanvas = useCallback((): boolean => {
    if (!canvas) return false;
    
    try {
      // Get saved state
      const state = localStorage.getItem(`${storageKey}_data`);
      if (!state) {
        console.warn("No saved canvas state found");
        onRestore?.(false);
        return false;
      }
      
      // Apply state to canvas
      applyCanvasState(canvas, state);
      
      console.log("Canvas state restored");
      onRestore?.(true);
      return true;
    } catch (error) {
      console.error("Error restoring canvas state:", error);
      onRestore?.(false);
      return false;
    }
  }, [canvas, storageKey, onRestore]);

  // Set up auto-save interval
  useEffect(() => {
    // Clear previous timer if any
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
    }
    
    if (!canvas) return;
    
    // Start auto-save timer
    timerRef.current = window.setInterval(() => {
      const hasObjectsToSave = (canvas.getObjects() || []).some(
        obj => !(obj as any).isGrid
      );
      
      if (hasObjectsToSave) {
        saveCanvas();
      }
    }, autoSaveInterval);
    
    // Clean up on unmount
    return () => {
      if (timerRef.current !== null) {
        window.clearInterval(timerRef.current);
      }
    };
  }, [canvas, autoSaveInterval, saveCanvas]);

  // Cleanup and final save on component unmount
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (canvas) {
        saveCanvas();
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (canvas) {
        saveCanvas();
      }
    };
  }, [canvas, saveCanvas]);

  return {
    saveCanvas,
    restoreCanvas,
    lastSaved,
    isSaving,
    canRestore
  };
};
