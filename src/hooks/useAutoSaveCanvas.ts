
import { useState, useEffect, useCallback } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { debounce } from '@/utils/throttle';

export interface UseAutoSaveCanvasProps {
  canvas: FabricCanvas | null;
  canvasId: string;
  enabled?: boolean;
  debounceMs?: number;
}

export interface UseAutoSaveCanvasResult {
  saveCanvas: () => Promise<void>;
  loadCanvas: () => Promise<void>;
  lastSaved: Date | null;
  isSaving: boolean;
  isLoading: boolean;
}

export const useAutoSaveCanvas = ({
  canvas,
  canvasId,
  enabled = true,
  debounceMs = 1000
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
        canvasId,
        timestamp: new Date().toISOString(),
        version: '1.0',
        data: canvasJSON
      };
      
      // Store in localStorage
      localStorage.setItem(`canvas_${canvasId}`, JSON.stringify(storageData));
      
      // Update last saved timestamp
      const now = new Date();
      setLastSaved(now);
      
      console.log(`Canvas ${canvasId} saved`, {
        objectCount: canvasJSON.objects ? canvasJSON.objects.length : 0,
        timestamp: now
      });
    } catch (error) {
      console.error('Error saving canvas:', error);
    } finally {
      setIsSaving(false);
    }
  }, [canvas, canvasId, enabled]);

  const loadCanvas = useCallback(async () => {
    if (!canvas || !enabled) return;
    
    try {
      setIsLoading(true);
      
      // Retrieve from localStorage
      const storedData = localStorage.getItem(`canvas_${canvasId}`);
      
      if (!storedData) {
        console.log(`No saved canvas found for ${canvasId}`);
        return;
      }
      
      const parsedData = JSON.parse(storedData);
      
      // Clear existing canvas
      canvas.clear();
      
      // Load the saved state
      canvas.loadFromJSON(parsedData.data, () => {
        canvas.renderAll();
        console.log(`Canvas ${canvasId} loaded`, {
          timestamp: new Date(parsedData.timestamp),
          objectCount: parsedData.data.objects ? parsedData.data.objects.length : 0
        });
      });
      
      // Set last saved time from stored data
      setLastSaved(new Date(parsedData.timestamp));
    } catch (error) {
      console.error('Error loading canvas:', error);
    } finally {
      setIsLoading(false);
    }
  }, [canvas, canvasId, enabled]);
  
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
    
    // Load the canvas on initial mount
    loadCanvas();
    
    return () => {
      // Clean up event listeners
      canvas.off('object:modified', handleObjectModified);
      canvas.off('path:created', handlePathCreated);
    };
  }, [canvas, enabled, debouncedSave, loadCanvas]);
  
  return {
    saveCanvas,
    loadCanvas,
    lastSaved,
    isSaving,
    isLoading
  };
};
