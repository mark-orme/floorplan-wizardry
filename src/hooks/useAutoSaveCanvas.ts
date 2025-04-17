
import { useCallback, useEffect, useRef, useState } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { throttle } from '@/utils/throttle';
import { toast } from 'sonner';
import { useOptimizedGeometryWorker } from './useOptimizedGeometryWorker';
import { measureAsyncPerformance } from '@/utils/performance';

export interface UseAutoSaveCanvasProps {
  canvas: FabricCanvas | null;
  enabled?: boolean;
  interval?: number;
  storageKey?: string;
  onSave?: (data: string) => void;
  onLoad?: () => void;
}

export const useAutoSaveCanvas = ({
  canvas,
  enabled = true,
  interval = 30000,
  storageKey = 'canvas_autosave',
  onSave,
  onLoad
}: UseAutoSaveCanvasProps) => {
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const autoSaveTimerRef = useRef<number | null>(null);
  const geometryWorker = useOptimizedGeometryWorker();
  
  // Prepare canvas data with optimized JSON via transferables
  const prepareCanvasData = useCallback(async () => {
    if (!canvas) return null;
    
    try {
      // Measures performance while preparing canvas data
      const [result, measurement] = await measureAsyncPerformance('canvas.serialize', async () => {
        // Get JSON representation of canvas
        const json = canvas.toJSON(['id', 'name', 'selectable', 'metadata']);
        
        // If we have large point arrays, optimize them
        if (json.objects && json.objects.length > 100) {
          // Process large path objects in batches
          const pathObjects = json.objects.filter(obj => obj.type === 'path' && obj.path && obj.path.length > 100);
          
          if (pathObjects.length > 0) {
            console.log(`Optimizing ${pathObjects.length} large path objects before save`);
            
            // Process in batches to avoid blocking the main thread
            for (let i = 0; i < pathObjects.length; i += 10) {
              const batch = pathObjects.slice(i, i + 10);
              
              // Process each object in parallel
              await Promise.all(batch.map(async (pathObj) => {
                if (pathObj.path && pathObj.path.length > 100) {
                  // Convert path format to points for optimization
                  const points = pathObj.path.map(cmd => {
                    if (Array.isArray(cmd) && cmd.length >= 3) {
                      return { x: cmd[1], y: cmd[2] };
                    }
                    return null;
                  }).filter(Boolean);
                  
                  // Use worker to optimize points if available
                  if (points.length > 100 && geometryWorker.features.isSupported) {
                    try {
                      // Tolerance based on zoom level
                      const tolerance = 1 / (canvas.getZoom() || 1);
                      const optimizedPoints = await geometryWorker.optimizePoints(points, tolerance);
                      
                      // Replace the path with optimized version if successful
                      if (optimizedPoints && optimizedPoints.length > 0) {
                        // Convert back to path format
                        pathObj.path = optimizedPoints.map((p, idx) => 
                          idx === 0 ? ['M', p.x, p.y] : ['L', p.x, p.y]
                        );
                        
                        console.log(`Optimized path from ${points.length} to ${optimizedPoints.length} points`);
                      }
                    } catch (err) {
                      console.error('Error optimizing path for storage:', err);
                    }
                  }
                }
              }));
            }
          }
        }
        
        return JSON.stringify(json);
      });
      
      console.log(`Canvas serialized in ${measurement.duration.toFixed(2)}ms`);
      return result;
    } catch (error) {
      console.error('Error preparing canvas data:', error);
      return null;
    }
  }, [canvas, geometryWorker]);
  
  // Save canvas state
  const saveCanvas = useCallback(async () => {
    if (!canvas || !enabled) return;
    
    setIsSaving(true);
    
    try {
      const data = await prepareCanvasData();
      if (!data) throw new Error('Failed to prepare canvas data');
      
      // Save to localStorage
      localStorage.setItem(storageKey, data);
      
      const now = new Date();
      setLastSaved(now);
      
      // Call save callback if provided
      if (onSave) onSave(data);
      
      console.log(`Canvas saved successfully at ${now.toLocaleTimeString()}`);
    } catch (error) {
      console.error('Error saving canvas:', error);
      toast.error('Failed to save canvas');
    } finally {
      setIsSaving(false);
    }
  }, [canvas, enabled, storageKey, onSave, prepareCanvasData]);
  
  // Throttled save to avoid excessive operations
  const throttledSave = useCallback(
    throttle(saveCanvas, 2000), 
    [saveCanvas]
  );
  
  // Load canvas state
  const loadCanvas = useCallback(async () => {
    if (!canvas || !enabled) return;
    
    setIsLoading(true);
    
    try {
      const data = localStorage.getItem(storageKey);
      if (!data) {
        console.log('No saved canvas data found');
        setIsLoading(false);
        return;
      }
      
      // Load canvas from JSON
      await canvas.loadFromJSON(data, canvas.renderAll.bind(canvas));
      
      console.log('Canvas loaded successfully');
      
      // Call load callback if provided
      if (onLoad) onLoad();
      
      toast.success('Canvas restored successfully');
    } catch (error) {
      console.error('Error loading canvas:', error);
      toast.error('Failed to load canvas');
    } finally {
      setIsLoading(false);
    }
  }, [canvas, enabled, storageKey, onLoad]);
  
  // Set up auto-save interval
  useEffect(() => {
    if (!enabled || !canvas) return;
    
    // Clear existing timer
    if (autoSaveTimerRef.current) {
      window.clearInterval(autoSaveTimerRef.current);
    }
    
    // Set up new timer
    autoSaveTimerRef.current = window.setInterval(() => {
      saveCanvas();
    }, interval);
    
    // Clean up on unmount
    return () => {
      if (autoSaveTimerRef.current) {
        window.clearInterval(autoSaveTimerRef.current);
      }
    };
  }, [enabled, canvas, interval, saveCanvas]);
  
  // Set up object modified event listener for reactive saving
  useEffect(() => {
    if (!canvas || !enabled) return;
    
    const handleObjectModified = () => {
      throttledSave();
    };
    
    // Attach event listeners
    canvas.on('object:modified', handleObjectModified);
    canvas.on('object:added', handleObjectModified);
    canvas.on('object:removed', handleObjectModified);
    
    // Clean up
    return () => {
      canvas.off('object:modified', handleObjectModified);
      canvas.off('object:added', handleObjectModified);
      canvas.off('object:removed', handleObjectModified);
    };
  }, [canvas, enabled, throttledSave]);
  
  return {
    saveCanvas,
    loadCanvas,
    lastSaved,
    isSaving,
    isLoading
  };
};
