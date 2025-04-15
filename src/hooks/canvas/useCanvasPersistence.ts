
import { useCallback, useEffect, useRef, useState } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { toast } from 'sonner';
import logger from '@/utils/logger';

interface UseCanvasPersistenceProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  canvasStorageKey?: string;
  autoSaveInterval?: number;
  enableAutoSave?: boolean;
  onSave?: (success: boolean) => void;
  onRestore?: (success: boolean) => void;
}

export const useCanvasPersistence = ({
  fabricCanvasRef,
  canvasStorageKey = 'canvas_state',
  autoSaveInterval = 30000,
  enableAutoSave = true,
  onSave,
  onRestore
}: UseCanvasPersistenceProps) => {
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedJsonRef = useRef<string | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [canRestore, setCanRestore] = useState(false);

  // Check if there's data to restore
  useEffect(() => {
    const hasData = localStorage.getItem(canvasStorageKey) !== null;
    setCanRestore(hasData);
  }, [canvasStorageKey]);

  // Save canvas state to localStorage
  const saveCanvasState = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return false;

    try {
      setIsSaving(true);
      // Convert canvas to JSON
      const json = JSON.stringify(canvas.toJSON(['id', 'objectType', 'customProps', 'measurement']));
      
      // Only save if something has changed
      if (json !== lastSavedJsonRef.current) {
        localStorage.setItem(canvasStorageKey, json);
        lastSavedJsonRef.current = json;
        const now = new Date();
        setLastSaved(now);
        logger.info('Canvas state saved to localStorage');
        if (onSave) onSave(true);
        setIsSaving(false);
        return true;
      }
      
      setIsSaving(false);
      return false;
    } catch (error) {
      logger.error('Error saving canvas state:', error);
      setIsSaving(false);
      if (onSave) onSave(false);
      return false;
    }
  }, [fabricCanvasRef, canvasStorageKey, onSave]);

  // Load canvas state from localStorage
  const loadCanvasState = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return false;

    try {
      setIsLoading(true);
      const json = localStorage.getItem(canvasStorageKey);
      if (!json) {
        setIsLoading(false);
        if (onRestore) onRestore(false);
        return false;
      }

      canvas.loadFromJSON(json, () => {
        // Fixed: Remove the argument from renderAll
        canvas.requestRenderAll();
        logger.info('Canvas state restored from localStorage');
        setIsLoading(false);
        if (onRestore) onRestore(true);
      });
      
      lastSavedJsonRef.current = json;
      return true;
    } catch (error) {
      logger.error('Error loading canvas state:', error);
      setIsLoading(false);
      if (onRestore) onRestore(false);
      return false;
    }
  }, [fabricCanvasRef, canvasStorageKey, onRestore]);

  // Clear saved canvas state
  const clearCanvasState = useCallback(() => {
    try {
      localStorage.removeItem(canvasStorageKey);
      lastSavedJsonRef.current = null;
      setCanRestore(false);
      logger.info('Canvas state cleared from localStorage');
      return true;
    } catch (error) {
      logger.error('Error clearing canvas state:', error);
      return false;
    }
  }, [canvasStorageKey]);

  // Reset canvas
  const resetCanvas = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return false;
    
    try {
      // Remove all objects
      canvas.clear();
      canvas.requestRenderAll();
      
      // Clear saved state
      clearCanvasState();
      
      return true;
    } catch (error) {
      logger.error('Error resetting canvas:', error);
      return false;
    }
  }, [fabricCanvasRef, clearCanvasState]);

  // Start auto-save timer
  const startAutoSave = useCallback(() => {
    if (!enableAutoSave) return;
    
    // Clear any existing timer
    if (autoSaveTimerRef.current) {
      clearInterval(autoSaveTimerRef.current);
    }
    
    // Set new timer
    autoSaveTimerRef.current = setInterval(() => {
      const saved = saveCanvasState();
      if (saved) {
        logger.info(`Auto-saved canvas (interval: ${autoSaveInterval}ms)`);
      }
    }, autoSaveInterval);
    
    logger.info(`Auto-save started (interval: ${autoSaveInterval}ms)`);
  }, [enableAutoSave, autoSaveInterval, saveCanvasState]);

  // Stop auto-save timer
  const stopAutoSave = useCallback(() => {
    if (autoSaveTimerRef.current) {
      clearInterval(autoSaveTimerRef.current);
      autoSaveTimerRef.current = null;
      logger.info('Auto-save stopped');
    }
  }, []);

  // Set up auto-save when component mounts
  useEffect(() => {
    if (enableAutoSave) {
      startAutoSave();
    }
    
    // Clean up timer when component unmounts
    return () => {
      stopAutoSave();
    };
  }, [enableAutoSave, startAutoSave, stopAutoSave]);

  // For compatibility with older code
  const saveCanvas = saveCanvasState;
  const restoreCanvas = loadCanvasState;
  const clearSavedCanvas = clearCanvasState;

  return {
    saveCanvasState,
    loadCanvasState,
    clearCanvasState,
    resetCanvas,
    startAutoSave,
    stopAutoSave,
    // Compatibility properties
    saveCanvas,
    restoreCanvas,
    clearSavedCanvas,
    isSaving,
    isLoading,
    lastSaved,
    canRestore
  };
};
