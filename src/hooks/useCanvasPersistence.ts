
import { useState, useCallback } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { toast } from 'sonner';
import { persistCanvasState, restoreCanvasState } from '@/utils/canvas/persistenceManager';

export const useCanvasPersistence = (canvas: FabricCanvas | null) => {
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);

  const saveCanvas = useCallback(async () => {
    if (!canvas) return false;
    
    try {
      setIsSaving(true);
      const success = await persistCanvasState(canvas);
      
      if (success) {
        setLastSavedAt(new Date());
      }
      
      setIsSaving(false);
      return success;
    } catch (error) {
      console.error('Error saving canvas:', error);
      setIsSaving(false);
      return false;
    }
  }, [canvas]);

  const loadCanvas = useCallback(async () => {
    if (!canvas) return false;
    
    try {
      setIsLoading(true);
      const success = await restoreCanvasState(canvas);
      setIsLoading(false);
      return success;
    } catch (error) {
      console.error('Error loading canvas:', error);
      setIsLoading(false);
      toast.error('Failed to load saved drawing');
      return false;
    }
  }, [canvas]);

  const clearSavedCanvas = useCallback(() => {
    try {
      localStorage.removeItem('canvas_state');
      localStorage.removeItem('canvas_state_timestamp');
      setLastSavedAt(null);
      toast.success('Saved canvas data cleared');
      return true;
    } catch (error) {
      console.error('Error clearing saved canvas:', error);
      toast.error('Failed to clear saved canvas data');
      return false;
    }
  }, []);

  return {
    saveCanvas,
    loadCanvas,
    clearSavedCanvas,
    isSaving,
    isLoading,
    lastSavedAt
  };
};
