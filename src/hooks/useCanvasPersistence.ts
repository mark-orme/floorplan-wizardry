
import { useState, useCallback } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { toast } from 'sonner';

interface UseCanvasPersistenceResult {
  isSaving: boolean;
  isLoading: boolean;
  lastSaved: Date | null;
  saveCanvas: () => Promise<void>;
  loadCanvas: () => Promise<void>;
}

export const useCanvasPersistence = (
  canvas: FabricCanvas | null
): UseCanvasPersistenceResult => {
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const saveCanvas = useCallback(async () => {
    if (!canvas) return;
    
    try {
      setIsSaving(true);
      const json = canvas.toJSON(['id', 'type']);
      localStorage.setItem('canvas_state', JSON.stringify(json));
      localStorage.setItem('canvas_saved_at', new Date().toISOString());
      setLastSaved(new Date());
      toast.success('Drawing saved successfully');
    } catch (error) {
      console.error('Error saving canvas:', error);
      toast.error('Failed to save drawing');
    } finally {
      setIsSaving(false);
    }
  }, [canvas]);

  const loadCanvas = useCallback(async () => {
    if (!canvas) return;
    
    try {
      setIsLoading(true);
      const savedState = localStorage.getItem('canvas_state');
      const savedAt = localStorage.getItem('canvas_saved_at');
      
      if (!savedState) {
        toast.info('No saved drawing found');
        return;
      }

      canvas.loadFromJSON(JSON.parse(savedState), () => {
        canvas.renderAll();
        if (savedAt) {
          setLastSaved(new Date(savedAt));
        }
        toast.success('Drawing loaded successfully');
      });
    } catch (error) {
      console.error('Error loading canvas:', error);
      toast.error('Failed to load drawing');
    } finally {
      setIsLoading(false);
    }
  }, [canvas]);

  return {
    isSaving,
    isLoading,
    lastSaved,
    saveCanvas,
    loadCanvas
  };
};
