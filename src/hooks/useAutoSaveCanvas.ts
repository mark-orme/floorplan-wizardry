
import { useCallback, useEffect, useRef } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { toast } from 'sonner';
import logger from '@/utils/logger';

interface UseAutoSaveCanvasProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  canvasStorageKey?: string;
  autoSaveInterval?: number;
  showToasts?: boolean;
}

export const useAutoSaveCanvas = ({
  fabricCanvasRef,
  canvasStorageKey = 'canvas_state',
  autoSaveInterval = 30000,
  showToasts = true
}: UseAutoSaveCanvasProps) => {
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedRef = useRef<string | null>(null);
  
  // Save canvas state to localStorage
  const saveCanvasState = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return false;
    
    try {
      // Convert canvas to JSON
      const json = JSON.stringify(canvas.toJSON(['id', 'objectType', 'customProps', 'measurement']));
      
      // Only save if something has changed
      if (json !== lastSavedRef.current) {
        localStorage.setItem(canvasStorageKey, json);
        lastSavedRef.current = json;
        
        if (showToasts) {
          toast.success('Canvas state saved');
        }
        
        logger.info('Canvas state saved to localStorage');
        return true;
      }
      
      return false;
    } catch (error) {
      logger.error('Error saving canvas state:', error);
      
      if (showToasts) {
        toast.error('Failed to save canvas state');
      }
      
      return false;
    }
  }, [fabricCanvasRef, canvasStorageKey, showToasts]);
  
  // Load canvas state from localStorage
  const loadCanvasState = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return false;
    
    try {
      const json = localStorage.getItem(canvasStorageKey);
      if (!json) return false;
      
      canvas.loadFromJSON(json, () => {
        canvas.requestRenderAll();
        
        if (showToasts) {
          toast.success('Canvas state restored');
        }
        
        logger.info('Canvas state restored from localStorage');
      });
      
      lastSavedRef.current = json;
      return true;
    } catch (error) {
      logger.error('Error loading canvas state:', error);
      
      if (showToasts) {
        toast.error('Failed to restore canvas state');
      }
      
      return false;
    }
  }, [fabricCanvasRef, canvasStorageKey, showToasts]);
  
  // Clear saved canvas state
  const clearCanvasState = useCallback(() => {
    try {
      localStorage.removeItem(canvasStorageKey);
      lastSavedRef.current = null;
      
      if (showToasts) {
        toast.success('Canvas state cleared');
      }
      
      logger.info('Canvas state cleared from localStorage');
      return true;
    } catch (error) {
      logger.error('Error clearing canvas state:', error);
      
      if (showToasts) {
        toast.error('Failed to clear canvas state');
      }
      
      return false;
    }
  }, [canvasStorageKey, showToasts]);
  
  // Reset canvas to empty state
  const resetCanvas = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return false;
    
    try {
      // Clear all objects except grid
      const objects = canvas.getObjects().filter(obj => (obj as any).objectType !== 'grid');
      objects.forEach(obj => canvas.remove(obj));
      
      // Reset zoom and pan
      canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
      
      // Render changes
      canvas.requestRenderAll();
      
      // Clear saved state
      clearCanvasState();
      
      if (showToasts) {
        toast.success('Canvas reset to empty state');
      }
      
      logger.info('Canvas reset to empty state');
      return true;
    } catch (error) {
      logger.error('Error resetting canvas:', error);
      
      if (showToasts) {
        toast.error('Failed to reset canvas');
      }
      
      return false;
    }
  }, [fabricCanvasRef, clearCanvasState, showToasts]);
  
  // Start auto-save timer
  const startAutoSave = useCallback(() => {
    // Clear any existing timer
    if (autoSaveTimerRef.current) {
      clearInterval(autoSaveTimerRef.current);
    }
    
    // Set new timer
    autoSaveTimerRef.current = setInterval(() => {
      saveCanvasState();
    }, autoSaveInterval);
    
    logger.info(`Auto-save started (interval: ${autoSaveInterval}ms)`);
  }, [autoSaveInterval, saveCanvasState]);
  
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
    startAutoSave();
    
    // Attempt to load saved state
    const loaded = loadCanvasState();
    if (!loaded) {
      logger.info('No saved canvas state found');
    }
    
    // Clean up timer when component unmounts
    return () => {
      stopAutoSave();
    };
  }, [startAutoSave, loadCanvasState, stopAutoSave]);
  
  return {
    saveCanvasState,
    loadCanvasState,
    clearCanvasState,
    resetCanvas,
    startAutoSave,
    stopAutoSave
  };
};
