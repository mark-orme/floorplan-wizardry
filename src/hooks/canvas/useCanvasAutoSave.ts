
import { useState, useEffect, useCallback } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

interface UseCanvasAutoSaveProps {
  canvas: FabricCanvas | null;
  autoSaveInterval?: number;
  canvasId?: string;
}

export function useCanvasAutoSave({
  canvas,
  autoSaveInterval = 30000, // Default to 30 seconds
  canvasId = 'default-canvas'
}: UseCanvasAutoSaveProps) {
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const { user } = useAuth();
  
  // Function to save canvas state to local storage
  const saveToLocalStorage = useCallback(() => {
    if (!canvas) return;
    
    try {
      const canvasJSON = canvas.toJSON(['id', 'name']);
      localStorage.setItem(`canvas_${canvasId}`, JSON.stringify(canvasJSON));
      setLastSaved(new Date());
      return true;
    } catch (error) {
      console.error('Error saving canvas to local storage:', error);
      return false;
    }
  }, [canvas, canvasId]);
  
  // Auto-save on interval
  useEffect(() => {
    if (!canvas || autoSaveInterval <= 0) return;
    
    const intervalId = setInterval(() => {
      const saved = saveToLocalStorage();
      if (saved) {
        console.log(`Auto-saved canvas at ${new Date().toLocaleTimeString()}`);
      }
    }, autoSaveInterval);
    
    return () => {
      clearInterval(intervalId);
    };
  }, [canvas, autoSaveInterval, saveToLocalStorage]);
  
  // Save when canvas is modified
  useEffect(() => {
    if (!canvas) return;
    
    const handleModified = () => {
      saveToLocalStorage();
    };
    
    canvas.on('object:modified', handleModified);
    
    return () => {
      canvas.off('object:modified', handleModified);
    };
  }, [canvas, saveToLocalStorage]);
  
  // Manual save function
  const saveCanvas = useCallback(() => {
    if (!canvas) {
      toast.error('No canvas to save');
      return false;
    }
    
    const saved = saveToLocalStorage();
    
    if (saved) {
      toast.success('Canvas saved successfully');
      return true;
    } else {
      toast.error('Failed to save canvas');
      return false;
    }
  }, [canvas, saveToLocalStorage]);
  
  return {
    lastSaved,
    saveCanvas,
    canSave: !!canvas
  };
}
