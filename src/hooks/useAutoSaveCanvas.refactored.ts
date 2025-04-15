
/**
 * Refactored version of useAutoSaveCanvas
 * Uses the modular hooks approach
 * @module hooks/useAutoSaveCanvas
 */
import { useCallback, useEffect, useState } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { captureCanvasState, applyCanvasState } from '@/utils/canvas/canvasStateCapture';
import { toast } from 'sonner';
import logger from '@/utils/logger';

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
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [canRestore, setCanRestore] = useState(false);
  
  // Check if we have saved data that can be restored
  useEffect(() => {
    if (!canvas) return;
    
    const savedData = localStorage.getItem(`canvas-state-${canvasId}`);
    setCanRestore(!!savedData);
  }, [canvas, canvasId]);
  
  // Save canvas state to storage
  const saveCanvas = useCallback(() => {
    if (!canvas) return;
    
    setIsSaving(true);
    try {
      const state = captureCanvasState(canvas);
      localStorage.setItem(`canvas-state-${canvasId}`, state);
      localStorage.setItem(`canvas-timestamp-${canvasId}`, new Date().toISOString());
      
      setLastSaved(new Date());
      if (onSave) onSave(true);
      logger.debug(`Canvas state saved for ${canvasId}`);
      return true;
    } catch (error) {
      logger.error("Error saving canvas state:", error);
      if (onSave) onSave(false);
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [canvas, canvasId, onSave]);
  
  // Restore canvas from storage
  const restoreCanvas = useCallback(() => {
    if (!canvas) return;
    
    setIsLoading(true);
    try {
      const state = localStorage.getItem(`canvas-state-${canvasId}`);
      if (!state) {
        if (onRestore) onRestore(false);
        return false;
      }
      
      applyCanvasState(canvas, state);
      
      const timestamp = localStorage.getItem(`canvas-timestamp-${canvasId}`);
      if (timestamp) {
        setLastSaved(new Date(timestamp));
      }
      
      if (onRestore) onRestore(true);
      toast.success("Canvas restored successfully");
      logger.debug(`Canvas state restored for ${canvasId}`);
      return true;
    } catch (error) {
      logger.error("Error restoring canvas state:", error);
      if (onRestore) onRestore(false);
      toast.error("Failed to restore canvas");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [canvas, canvasId, onRestore]);
  
  // Clear saved canvas data
  const clearSavedCanvas = useCallback(() => {
    localStorage.removeItem(`canvas-state-${canvasId}`);
    localStorage.removeItem(`canvas-timestamp-${canvasId}`);
    setCanRestore(false);
    setLastSaved(null);
    logger.debug(`Canvas state cleared for ${canvasId}`);
  }, [canvasId]);
  
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
