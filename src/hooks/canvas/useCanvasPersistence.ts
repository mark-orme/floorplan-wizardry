
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

  useEffect(() => {
    const hasData = localStorage.getItem(canvasStorageKey) !== null;
    setCanRestore(hasData);
  }, [canvasStorageKey]);

  const saveCanvasState = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return false;

    try {
      setIsSaving(true);
      const json = JSON.stringify(canvas.toJSON(['id', 'objectType', 'customProps', 'measurement']));
      
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
        canvas.requestRenderAll(); // Removed unnecessary argument
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

  const resetCanvas = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return false;
    
    try {
      canvas.clear();
      canvas.requestRenderAll();
      
      clearCanvasState();
      
      return true;
    } catch (error) {
      logger.error('Error resetting canvas:', error);
      return false;
    }
  }, [fabricCanvasRef, clearCanvasState]);

  const startAutoSave = useCallback(() => {
    if (!enableAutoSave) return;
    
    if (autoSaveTimerRef.current) {
      clearInterval(autoSaveTimerRef.current);
    }
    
    autoSaveTimerRef.current = setInterval(() => {
      const saved = saveCanvasState();
      if (saved) {
        logger.info(`Auto-saved canvas (interval: ${autoSaveInterval}ms)`);
      }
    }, autoSaveInterval);
    
    logger.info(`Auto-save started (interval: ${autoSaveInterval}ms)`);
  }, [enableAutoSave, autoSaveInterval, saveCanvasState]);

  const stopAutoSave = useCallback(() => {
    if (autoSaveTimerRef.current) {
      clearInterval(autoSaveTimerRef.current);
      autoSaveTimerRef.current = null;
      logger.info('Auto-save stopped');
    }
  }, []);

  useEffect(() => {
    if (enableAutoSave) {
      startAutoSave();
    }
    
    return () => {
      stopAutoSave();
    };
  }, [enableAutoSave, startAutoSave, stopAutoSave]);

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
    saveCanvas,
    restoreCanvas,
    clearSavedCanvas,
    isSaving,
    isLoading,
    lastSaved,
    canRestore
  };
};
