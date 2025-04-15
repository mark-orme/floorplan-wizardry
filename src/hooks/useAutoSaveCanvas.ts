import { useState, useEffect, useRef } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { toast } from 'sonner';
import logger from '@/utils/logger';

interface UseAutoSaveCanvasProps {
  canvas: FabricCanvas | null;
  canvasId: string;
  autoSaveInterval?: number;
  onSave?: (success: boolean) => void;
  onRestore?: (success: boolean) => void;
}

export function useAutoSaveCanvas({
  canvas,
  canvasId,
  autoSaveInterval = 30000,
  onSave,
  onRestore
}: UseAutoSaveCanvasProps) {
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [canRestore, setCanRestore] = useState(false);
  const autoSaveIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const stateKey = `canvas_${canvasId}_state`;
  const timestampKey = `canvas_${canvasId}_timestamp`;
  
  useEffect(() => {
    const savedState = localStorage.getItem(stateKey);
    const savedTimestamp = localStorage.getItem(timestampKey);
    
    if (savedState && savedTimestamp) {
      setCanRestore(true);
      setLastSaved(new Date(savedTimestamp));
    }
  }, [stateKey, timestampKey]);
  
  useEffect(() => {
    if (!canvas) return;
    
    const saveCanvas = () => {
      if (canvas) {
        saveCurrentCanvas();
      }
    };
    
    if (autoSaveIntervalRef.current) {
      clearInterval(autoSaveIntervalRef.current);
    }
    
    autoSaveIntervalRef.current = setInterval(saveCanvas, autoSaveInterval);
    
    const handleModification = () => {
      logger.debug('Canvas modified, will be saved on next interval');
    };
    
    canvas.on('object:added', handleModification);
    canvas.on('object:modified', handleModification);
    canvas.on('object:removed', handleModification);
    
    return () => {
      if (autoSaveIntervalRef.current) {
        clearInterval(autoSaveIntervalRef.current);
      }
      
      if (canvas) {
        canvas.off('object:added', handleModification);
        canvas.off('object:modified', handleModification);
        canvas.off('object:removed', handleModification);
      }
    };
  }, [canvas, autoSaveInterval]);
  
  const saveCurrentCanvas = async () => {
    if (!canvas) {
      if (onSave) onSave(false);
      return false;
    }
    
    try {
      setIsSaving(true);
      
      const json = JSON.stringify(canvas.toJSON());
      
      localStorage.setItem(stateKey, json);
      
      const now = new Date();
      localStorage.setItem(timestampKey, now.toISOString());
      
      setLastSaved(now);
      setCanRestore(true);
      setIsSaving(false);
      
      logger.info(`Canvas saved to localStorage (id: ${canvasId})`);
      if (onSave) onSave(true);
      
      return true;
    } catch (error) {
      logger.error('Error saving canvas:', error);
      setIsSaving(false);
      if (onSave) onSave(false);
      
      return false;
    }
  };
  
  const restoreCanvas = async () => {
    if (!canvas) {
      if (onRestore) onRestore(false);
      return false;
    }
    
    try {
      setIsLoading(true);
      
      const savedState = localStorage.getItem(stateKey);
      if (!savedState) {
        setIsLoading(false);
        if (onRestore) onRestore(false);
        return false;
      }
      
      canvas.loadFromJSON(savedState, () => {
        canvas.renderAll();
        setIsLoading(false);
        if (onRestore) onRestore(true);
      });
      
      logger.info(`Canvas restored from localStorage (id: ${canvasId})`);
      
      return true;
    } catch (error) {
      logger.error('Error restoring canvas:', error);
      setIsLoading(false);
      if (onRestore) onRestore(false);
      
      return false;
    }
  };
  
  const clearSavedCanvas = () => {
    try {
      localStorage.removeItem(stateKey);
      localStorage.removeItem(timestampKey);
      setCanRestore(false);
      setLastSaved(null);
      
      logger.info(`Canvas state cleared from localStorage (id: ${canvasId})`);
      
      return true;
    } catch (error) {
      logger.error('Error clearing canvas state:', error);
      return false;
    }
  };
  
  return {
    saveCanvas: saveCurrentCanvas,
    restoreCanvas,
    clearSavedCanvas,
    canRestore,
    lastSaved,
    isSaving,
    isLoading
  };
}
