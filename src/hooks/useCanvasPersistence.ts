
import { useCallback, useState } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { toast } from 'sonner';
import logger from '@/utils/logger';

// Export the history key for other hooks to use
export const HISTORY_KEY = 'canvas_state';

interface UseCanvasPersistenceResult {
  isSaving: boolean;
  isLoading: boolean;
  lastSaved: Date | null;
  saveCanvas: () => Promise<void>;
  loadCanvas: () => Promise<void>;
}

export const useCanvasPersistence = (
  canvas: FabricCanvas | null,
  storageKey = HISTORY_KEY
): UseCanvasPersistenceResult => {
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const saveCanvas = useCallback(async () => {
    if (!canvas) return;
    
    try {
      setIsSaving(true);
      const json = canvas.toJSON();
      localStorage.setItem(storageKey, JSON.stringify(json));
      localStorage.setItem(`${storageKey}_timestamp`, new Date().toISOString());
      setLastSaved(new Date());
      logger.debug('Canvas state saved successfully');
      toast.success('Drawing saved successfully');
    } catch (error) {
      logger.error('Error saving canvas:', error);
      toast.error('Failed to save drawing');
    } finally {
      setIsSaving(false);
    }
  }, [canvas, storageKey]);

  const loadCanvas = useCallback(async () => {
    if (!canvas) return;
    
    try {
      setIsLoading(true);
      const savedState = localStorage.getItem(storageKey);
      const savedTimestamp = localStorage.getItem(`${storageKey}_timestamp`);
      
      if (!savedState) {
        toast.info('No saved drawing found');
        return;
      }

      canvas.loadFromJSON(JSON.parse(savedState), () => {
        canvas.renderAll();
        if (savedTimestamp) {
          setLastSaved(new Date(savedTimestamp));
        }
        toast.success('Drawing loaded successfully');
      });
    } catch (error) {
      logger.error('Error loading canvas:', error);
      toast.error('Failed to load drawing');
    } finally {
      setIsLoading(false);
    }
  }, [canvas, storageKey]);

  return {
    isSaving,
    isLoading,
    lastSaved,
    saveCanvas,
    loadCanvas
  };
};
