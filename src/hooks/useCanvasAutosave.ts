
/**
 * Enhanced secure canvas autosave hook
 * Implements proper validation and safer storage
 */
import { useEffect, useState, useRef } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { saveCanvasToIDB, loadCanvasFromIDB } from '@/utils/storage/idbCanvasStore';
import { debounce } from '@/utils/debounce';
import { toast } from 'sonner';
import { validateCanvasData, sanitizeCanvasData } from '@/utils/validation/canvasValidation';
import { handleError } from '@/utils/errorHandling';

interface UseCanvasAutosaveProps {
  canvas: FabricCanvas | null;
  canvasId?: string;
  debounceMs?: number;
  onSave?: (success: boolean) => void;
  onLoad?: (success: boolean) => void;
  onRestore?: (success: boolean) => void;
}

/**
 * Hook for automatically saving and loading canvas state from IndexedDB
 * with enhanced security and validation
 * 
 * @param props Canvas and configuration options
 * @returns Object with save and load functions
 */
export function useCanvasAutosave({
  canvas,
  canvasId = 'default-canvas',
  debounceMs = 2000,
  onSave,
  onLoad,
  onRestore
}: UseCanvasAutosaveProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const setupDoneRef = useRef(false);
  
  // Save canvas state to IndexedDB with validation
  const saveCanvas = async () => {
    if (!canvas) return false;
    
    try {
      setIsSaving(true);
      const json = canvas.toJSON();
      
      // Validate canvas data before saving
      if (!validateCanvasData(json)) {
        throw new Error('Invalid canvas data');
      }
      
      // Sanitize data before storage
      const sanitizedData = sanitizeCanvasData(json);
      if (!sanitizedData) {
        throw new Error('Failed to sanitize canvas data');
      }
      
      await saveCanvasToIDB(canvasId, sanitizedData);
      setLastSaved(new Date());
      onSave?.(true);
      return true;
    } catch (error) {
      // Use centralized error handling with controlled logging
      handleError(error, 'error', {
        component: 'useCanvasAutosave',
        operation: 'saveCanvas',
        context: { canvasIdentifier: canvasId }
      });
      onSave?.(false);
      return false;
    } finally {
      setIsSaving(false);
    }
  };
  
  // Create a debounced version of saveCanvas
  const debouncedSave = useRef(debounce(() => saveCanvas(), debounceMs));
  
  // Load canvas state from IndexedDB
  const loadCanvas = async () => {
    if (!canvas) return false;
    
    try {
      setIsLoading(true);
      const json = await loadCanvasFromIDB(canvasId);
      
      if (json) {
        // Validate loaded data before applying
        if (!validateCanvasData(json)) {
          throw new Error('Invalid stored canvas data');
        }
        
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
      handleError(error, 'error', {
        component: 'useCanvasAutosave',
        operation: 'loadCanvas',
        context: { canvasIdentifier: canvasId }
      });
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
    
    // Add event listeners with proper type assertions
    saveEvents.forEach(event => {
      canvas.on(event as any, handleChange);
    });
    
    setupDoneRef.current = true;
    
    // Clean up event listeners
    return () => {
      if (canvas) {
        saveEvents.forEach(event => {
          canvas.off(event as any, handleChange);
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
