
import { useState, useEffect, useCallback } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { useSupabaseFloorPlans } from '@/hooks/useSupabaseFloorPlans';
import logger from '@/utils/logger';
import { HISTORY_KEY } from '@/hooks/useCanvasPersistence';
import { FloorPlan } from '@/types/floorPlanTypes';
import { debounce } from '@/utils/throttle';

export interface UseAutoSaveCanvasProps {
  canvas: FabricCanvas | null;
  enabled?: boolean;
  debounceMs?: number;
  storageKey?: string;
  canvasId?: string;
  autoSaveInterval?: number;
  onSave?: (success: boolean) => void;
  onLoad?: (success: boolean) => void;
  onRestore?: (success: boolean) => void;
}

export interface UseAutoSaveCanvasResult {
  saveCanvas: () => Promise<void>;
  loadCanvas: () => Promise<void>;
  restoreCanvas: () => Promise<void>; // Added this method for compatibility
  lastSaved: Date | null;
  isSaving: boolean;
  isLoading: boolean;
}

export const useAutoSaveCanvas = ({
  canvas,
  enabled = true,
  debounceMs = 1000,
  storageKey = 'canvas_autosave',
  canvasId = 'default',
  autoSaveInterval,
  onSave,
  onLoad
}: UseAutoSaveCanvasProps): UseAutoSaveCanvasResult => {
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const saveCanvas = useCallback(async () => {
    if (!canvas || !enabled) return;
    
    try {
      setIsSaving(true);
      
      // Optimize JSON size by filtering out unnecessary properties
      const canvasJSON = canvas.toJSON(['id', 'type', 'points', 'radius', 'width', 'height', 'fill', 'stroke', 'strokeWidth']);
      
      // Create a structured JSON with metadata
      const storageData = {
        canvasId: canvasId,
        timestamp: new Date().toISOString(),
        version: '1.0',
        data: canvasJSON
      };
      
      // Store in localStorage
      localStorage.setItem(storageKey, JSON.stringify(storageData));
      
      // Update last saved timestamp
      const now = new Date();
      setLastSaved(now);
      
      // Type guard to ensure canvasJSON has objects property before accessing length
      const objectCount = canvasJSON && 
                         typeof canvasJSON === 'object' && 
                         'objects' in canvasJSON && 
                         Array.isArray(canvasJSON.objects) ? 
                         canvasJSON.objects.length : 0;
                         
      console.log(`Canvas ${canvasId} saved`, {
        objectCount,
        timestamp: now
      });
      
      if (onSave) {
        onSave(true);
      }
    } catch (error) {
      console.error('Error saving canvas:', error);
      if (onSave) {
        onSave(false);
      }
    } finally {
      setIsSaving(false);
    }
  }, [canvas, canvasId, enabled, storageKey, onSave]);

  const loadCanvas = useCallback(async () => {
    if (!canvas || !enabled) return;
    
    try {
      setIsLoading(true);
      
      // Retrieve from localStorage
      const storedData = localStorage.getItem(storageKey);
      
      if (!storedData) {
        console.log(`No saved canvas found for ${canvasId}`);
        if (onLoad) {
          onLoad(false);
        }
        return;
      }
      
      const parsedData = JSON.parse(storedData);
      
      // Clear existing canvas
      canvas.clear();
      
      // Load the saved state
      canvas.loadFromJSON(parsedData.data, () => {
        canvas.renderAll();
        
        // Type guard to ensure parsedData.data has objects property before accessing length
        const objectCount = parsedData.data && 
                           typeof parsedData.data === 'object' && 
                           'objects' in parsedData.data && 
                           Array.isArray(parsedData.data.objects) ? 
                           parsedData.data.objects.length : 0;
                           
        console.log(`Canvas ${canvasId} loaded`, {
          timestamp: new Date(parsedData.timestamp),
          objectCount
        });
        
        if (onLoad) {
          onLoad(true);
        }
      });
      
      // Set last saved time from stored data
      setLastSaved(new Date(parsedData.timestamp));
    } catch (error) {
      console.error('Error loading canvas:', error);
      if (onLoad) {
        onLoad(false);
      }
    } finally {
      setIsLoading(false);
    }
  }, [canvas, canvasId, enabled, storageKey, onLoad]);
  
  // Adding restoreCanvas as an alias for loadCanvas for compatibility
  const restoreCanvas = useCallback(async () => {
    return loadCanvas();
  }, [loadCanvas]);
  
  // Debounce the save function to avoid frequent saves
  const debouncedSave = useCallback(
    debounce(() => {
      saveCanvas();
    }, debounceMs),
    [saveCanvas, debounceMs]
  );
  
  // Set up auto-save on canvas changes
  useEffect(() => {
    if (!canvas || !enabled) return;
    
    const handleObjectModified = () => {
      debouncedSave();
    };
    
    const handlePathCreated = () => {
      debouncedSave();
    };
    
    // Attach event listeners
    canvas.on('object:modified', handleObjectModified);
    canvas.on('path:created', handlePathCreated);
    
    // Set up auto-save interval if provided
    let intervalId: number | undefined;
    if (autoSaveInterval && autoSaveInterval > 0) {
      intervalId = window.setInterval(() => {
        saveCanvas();
      }, autoSaveInterval);
    }
    
    // Load the canvas on initial mount
    loadCanvas();
    
    return () => {
      // Clean up event listeners
      canvas.off('object:modified', handleObjectModified);
      canvas.off('path:created', handlePathCreated);
      
      // Clear interval if it exists
      if (intervalId) {
        window.clearInterval(intervalId);
      }
    };
  }, [canvas, enabled, debouncedSave, loadCanvas, saveCanvas, autoSaveInterval]);
  
  return {
    saveCanvas,
    loadCanvas,
    restoreCanvas, // Added for compatibility
    lastSaved,
    isSaving,
    isLoading
  };
};
