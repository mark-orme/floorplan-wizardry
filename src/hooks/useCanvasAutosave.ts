
/**
 * Hook for managing canvas autosave
 * @module hooks/useCanvasAutosave
 */
import { useEffect, useRef, useCallback } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { 
  saveCanvasToLocalStorage, 
  loadCanvasFromLocalStorage 
} from '@/utils/autosave/canvasAutoSave';
import logger from '@/utils/logger';
import { FabricEventTypes } from '@/types/fabric-events';

// Default autosave interval in milliseconds (5 seconds)
const DEFAULT_AUTOSAVE_INTERVAL = 5000;

interface UseCanvasAutosaveProps {
  canvas: FabricCanvas | null;
  enabled?: boolean;
  interval?: number;
  onSave?: (success: boolean) => void;
  onLoad?: (success: boolean) => void;
}

/**
 * Hook that provides automatic canvas saving functionality
 * @param props Configuration for the autosave
 * @returns Functions to manually trigger save and load
 */
export const useCanvasAutosave = ({
  canvas,
  enabled = true,
  interval = DEFAULT_AUTOSAVE_INTERVAL,
  onSave,
  onLoad
}: UseCanvasAutosaveProps) => {
  // Keep track of timer
  const autosaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  // Keep track of modification count
  const modificationCountRef = useRef<number>(0);
  // Track if initial load has been attempted
  const initialLoadAttemptedRef = useRef<boolean>(false);
  
  /**
   * Save canvas state
   */
  const saveCanvas = useCallback(() => {
    if (!canvas || !enabled) return false;
    
    const success = saveCanvasToLocalStorage(canvas);
    
    if (onSave) {
      onSave(success);
    }
    
    return success;
  }, [canvas, enabled, onSave]);
  
  /**
   * Load canvas state
   */
  const loadCanvas = useCallback(() => {
    if (!canvas || !enabled) return false;
    
    const success = loadCanvasFromLocalStorage(canvas);
    
    if (onLoad) {
      onLoad(success);
    }
    
    return success;
  }, [canvas, enabled, onLoad]);
  
  /**
   * Handle object modifications
   */
  const handleModification = useCallback(() => {
    modificationCountRef.current += 1;
  }, []);
  
  // Set up event listeners for canvas modifications
  useEffect(() => {
    if (!canvas || !enabled) return;
    
    // Add listeners for events that indicate canvas changes
    const events = [
      FabricEventTypes.OBJECT_ADDED, 
      FabricEventTypes.OBJECT_REMOVED, 
      FabricEventTypes.OBJECT_MODIFIED,
      'path:created'
    ];
    
    events.forEach(event => {
      canvas.on(event, handleModification);
    });
    
    // Clean up event listeners
    return () => {
      if (canvas) {
        events.forEach(event => {
          canvas.off(event, handleModification);
        });
      }
    };
  }, [canvas, enabled, handleModification]);
  
  // Load canvas state on initialization
  useEffect(() => {
    if (!canvas || !enabled || initialLoadAttemptedRef.current) return;
    
    // Attempt to load on first mount
    setTimeout(() => {
      loadCanvas();
      initialLoadAttemptedRef.current = true;
    }, 1000); // Delay to ensure canvas is fully initialized
    
  }, [canvas, enabled, loadCanvas]);
  
  // Set up autosave timer
  useEffect(() => {
    if (!canvas || !enabled) return;
    
    // Clear any existing timer
    if (autosaveTimerRef.current) {
      clearInterval(autosaveTimerRef.current);
    }
    
    // Create new timer
    autosaveTimerRef.current = setInterval(() => {
      // Only save if there have been modifications
      if (modificationCountRef.current > 0) {
        logger.info(`Autosaving canvas (${modificationCountRef.current} modifications)`);
        saveCanvas();
        modificationCountRef.current = 0;
      }
    }, interval);
    
    // Clean up timer
    return () => {
      if (autosaveTimerRef.current) {
        clearInterval(autosaveTimerRef.current);
        autosaveTimerRef.current = null;
      }
    };
  }, [canvas, enabled, interval, saveCanvas]);
  
  // Force save when component unmounts
  useEffect(() => {
    return () => {
      if (enabled && modificationCountRef.current > 0) {
        logger.info('Saving canvas on unmount');
        saveCanvas();
      }
    };
  }, [enabled, saveCanvas]);
  
  return {
    saveCanvas,
    loadCanvas
  };
};
