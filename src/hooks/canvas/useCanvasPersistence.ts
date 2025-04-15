
import { useCallback, useEffect, useRef } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { toast } from 'sonner';
import logger from '@/utils/logger';

interface UseCanvasPersistenceProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  canvasStorageKey?: string;
  autoSaveInterval?: number;
  enableAutoSave?: boolean;
}

export const useCanvasPersistence = ({
  fabricCanvasRef,
  canvasStorageKey = 'canvas_state',
  autoSaveInterval = 30000,
  enableAutoSave = true
}: UseCanvasPersistenceProps) => {
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedJsonRef = useRef<string | null>(null);

  // Save canvas state to localStorage
  const saveCanvasState = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return false;

    try {
      // Convert canvas to JSON
      const json = JSON.stringify(canvas.toJSON(['id', 'objectType', 'customProps', 'measurement']));
      
      // Only save if something has changed
      if (json !== lastSavedJsonRef.current) {
        localStorage.setItem(canvasStorageKey, json);
        lastSavedJsonRef.current = json;
        logger.info('Canvas state saved to localStorage');
        return true;
      }
      
      return false;
    } catch (error) {
      logger.error('Error saving canvas state:', error);
      return false;
    }
  }, [fabricCanvasRef, canvasStorageKey]);

  // Load canvas state from localStorage
  const loadCanvasState = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return false;

    try {
      const json = localStorage.getItem(canvasStorageKey);
      if (!json) return false;

      canvas.loadFromJSON(json, () => {
        canvas.requestRenderAll();
        logger.info('Canvas state restored from localStorage');
      });
      
      lastSavedJsonRef.current = json;
      return true;
    } catch (error) {
      logger.error('Error loading canvas state:', error);
      return false;
    }
  }, [fabricCanvasRef, canvasStorageKey]);

  // Clear saved canvas state
  const clearCanvasState = useCallback(() => {
    try {
      localStorage.removeItem(canvasStorageKey);
      lastSavedJsonRef.current = null;
      logger.info('Canvas state cleared from localStorage');
      return true;
    } catch (error) {
      logger.error('Error clearing canvas state:', error);
      return false;
    }
  }, [canvasStorageKey]);

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

  return {
    saveCanvasState,
    loadCanvasState,
    clearCanvasState,
    startAutoSave,
    stopAutoSave
  };
};
