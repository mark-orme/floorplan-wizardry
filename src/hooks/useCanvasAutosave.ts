
import { useEffect, useState, useRef } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { saveCanvasToIDB, loadCanvasFromIDB } from '@/utils/storage/idbCanvasStore';
import { debounce } from '@/utils/debounce';
import { toast } from 'sonner';

interface UseCanvasAutosaveProps {
  canvas: FabricCanvas | null;
  canvasId?: string;
  debounceMs?: number;
  onSave?: (success: boolean) => void;
  onLoad?: (success: boolean) => void;
}

/**
 * Hook for automatically saving and loading canvas state from IndexedDB
 * 
 * @param props Canvas and configuration options
 * @returns Object with save and load functions
 */
export function useCanvasAutosave({
  canvas,
  canvasId = 'default-canvas',
  debounceMs = 2000,
  onSave,
  onLoad
}: UseCanvasAutosaveProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const setupDoneRef = useRef(false);
  
  // Save canvas state to IndexedDB
  const saveCanvas = async () => {
    if (!canvas) return false;
    
    try {
      setIsSaving(true);
      const json = canvas.toJSON();
      await saveCanvasToIDB(canvasId, json);
      setLastSaved(new Date());
      onSave?.(true);
      return true;
    } catch (error) {
      console.error('Error auto-saving canvas:', error);
      onSave?.(false);
      return false;
    } finally {
      setIsSaving(false);
    }
  };
  
  // Create a debounced version of saveCanvas
  const debouncedSave = useRef(debounce(saveCanvas, debounceMs));
  
  // Load canvas state from IndexedDB
  const loadCanvas = async () => {
    if (!canvas) return false;
    
    try {
      setIsLoading(true);
      const json = await loadCanvasFromIDB(canvasId);
      
      if (json) {
        // Store grid objects to preserve them
        const gridObjects = canvas.getObjects().filter(obj => (obj as any).objectType === 'grid');
        
        // Load the saved state
        canvas.loadFromJSON(json, () => {
          // Restore grid objects
          gridObjects.forEach(obj => canvas.add(obj));
          
          // Send grid objects to back
          gridObjects.forEach(obj => canvas.sendToBack(obj));
          
          canvas.renderAll();
          toast.success('Canvas restored from local storage');
          onLoad?.(true);
        });
        return true;
      } else {
        onLoad?.(false);
        return false;
      }
    } catch (error) {
      console.error('Error loading canvas:', error);
      onLoad?.(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Set up auto-save event listeners
  useEffect(() => {
    if (!canvas || setupDoneRef.current) return;
    
    const handleChange = () => {
      debouncedSave.current();
    };
    
    // Events that should trigger an auto-save
    const saveEvents = [
      'object:added',
      'object:modified',
      'object:removed',
      'path:created'
    ];
    
    // Add event listeners
    saveEvents.forEach(event => {
      canvas.on(event, handleChange);
    });
    
    setupDoneRef.current = true;
    
    // Clean up event listeners
    return () => {
      if (canvas) {
        saveEvents.forEach(event => {
          canvas.off(event, handleChange);
        });
      }
    };
  }, [canvas, canvasId]);
  
  return {
    saveCanvas,
    loadCanvas,
    isSaving,
    isLoading,
    lastSaved
  };
}
