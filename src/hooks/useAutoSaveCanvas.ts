
/**
 * Custom hook for automatic canvas saving and restoring
 * @module hooks/useAutoSaveCanvas
 */
import { useEffect, useState, useCallback, useRef } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { toast } from 'sonner';
import { useLocalStorage } from './useLocalStorage';
import { debounce } from '@/utils/debounce';

interface UseAutoSaveCanvasProps {
  canvas: FabricCanvas | null;
  canvasId: string;
  debounceMs?: number;
  onSave?: (success: boolean) => void;
  onRestore?: (success: boolean) => void;
}

/**
 * Hook for automatic canvas saving and restoring
 */
export const useAutoSaveCanvas = ({
  canvas,
  canvasId,
  debounceMs = 2000,
  onSave,
  onRestore
}: UseAutoSaveCanvasProps) => {
  const [isSaving, setIsSaving] = useState(false);
  const [canRestore, setCanRestore] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const setupDoneRef = useRef(false);
  
  // Storage keys based on canvas ID
  const canvasKey = `canvas_state_${canvasId}`;
  const timestampKey = `canvas_timestamp_${canvasId}`;
  
  // Use local storage hook
  const [savedCanvas, setSavedCanvas] = useLocalStorage<string | null>(canvasKey, null);
  const [savedTimestamp, setSavedTimestamp] = useLocalStorage<string | null>(timestampKey, null);
  
  // Check if we can restore on mount
  useEffect(() => {
    if (savedCanvas && savedTimestamp) {
      setCanRestore(true);
    }
  }, [savedCanvas, savedTimestamp]);
  
  // Save canvas state
  const saveCanvas = useCallback(() => {
    if (!canvas) return false;
    
    try {
      setIsSaving(true);
      
      // Only save non-grid objects to reduce size
      const json = canvas.toJSON(['objectType']);
      const jsonString = JSON.stringify(json);
      
      // Save to local storage
      setSavedCanvas(jsonString);
      const now = new Date();
      setSavedTimestamp(now.toISOString());
      setLastSaved(now);
      
      // Notify success
      if (onSave) onSave(true);
      
      return true;
    } catch (error) {
      console.error('Error auto-saving canvas:', error);
      if (onSave) onSave(false);
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [canvas, setSavedCanvas, setSavedTimestamp, onSave]);
  
  // Fix: Create the debounced function with the correct syntax
  // The debounce function expects a function as its first argument, not a function call
  const debouncedSave = useRef(debounce(saveCanvas, debounceMs));
  
  // Restore canvas state
  const restoreCanvas = useCallback(() => {
    if (!canvas || !savedCanvas) return false;
    
    try {
      // Store grid objects to preserve them
      const gridObjects = canvas.getObjects().filter(obj => (obj as any).objectType === 'grid');
      
      // Load the saved state
      canvas.loadFromJSON(JSON.parse(savedCanvas), () => {
        // Restore grid objects
        gridObjects.forEach(obj => canvas.add(obj));
        
        // Send grid objects to back
        gridObjects.forEach(obj => canvas.sendToBack(obj));
        
        canvas.renderAll();
        toast.success('Your drawing has been restored');
        
        if (onRestore) onRestore(true);
      });
      
      return true;
    } catch (error) {
      console.error('Error restoring canvas:', error);
      toast.error('Failed to restore your drawing');
      
      if (onRestore) onRestore(false);
      return false;
    }
  }, [canvas, savedCanvas, onRestore]);
  
  // Clear saved canvas
  const clearSavedCanvas = useCallback(() => {
    setSavedCanvas(null);
    setSavedTimestamp(null);
    setLastSaved(null);
    setCanRestore(false);
  }, [setSavedCanvas, setSavedTimestamp]);
  
  // Set up auto-save event listeners
  useEffect(() => {
    if (!canvas || setupDoneRef.current) return;
    
    // Define save events - use type assertion for fabric.js events
    const saveEvents = [
      'object:added',
      'object:modified',
      'object:removed',
      'path:created'
    ];
    
    const handleChange = () => {
      debouncedSave.current();
    };
    
    // Add event listeners with type assertion
    saveEvents.forEach(event => {
      // Using 'on' with a string event name is safe for Fabric.js
      canvas.on(event as any, handleChange);
    });
    
    setupDoneRef.current = true;
    
    // Clean up event listeners
    return () => {
      if (canvas) {
        saveEvents.forEach(event => {
          // Using 'off' with a string event name is safe for Fabric.js
          canvas.off(event as any, handleChange);
        });
      }
    };
  }, [canvas]);
  
  return {
    isSaving,
    lastSaved,
    canRestore,
    saveCanvas,
    restoreCanvas,
    clearSavedCanvas
  };
};
