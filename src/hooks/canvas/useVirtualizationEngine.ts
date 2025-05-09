
import { useEffect, useState, useCallback, useRef } from 'react';
import { throttle, debounce } from 'lodash';
import { Canvas, Object as FabricObject } from 'fabric';

interface UseVirtualizationEngineProps {
  canvas: Canvas | null;
  enabled?: boolean;
  threshold?: number;
  optimizationLevel?: 'low' | 'medium' | 'high';
}

interface VirtualizationStats {
  visibleObjects: number;
  totalObjects: number;
  lastRenderTime: number;
  fps: number;
}

export const useVirtualizationEngine = ({
  canvas,
  enabled = true,
  threshold = 100,
  optimizationLevel = 'medium'
}: UseVirtualizationEngineProps) => {
  const [isVirtualized, setIsVirtualized] = useState(enabled);
  const [stats, setStats] = useState<VirtualizationStats>({
    visibleObjects: 0,
    totalObjects: 0,
    lastRenderTime: 0,
    fps: 60
  });
  
  const lastFrameTime = useRef<number>(0);
  const frameCount = useRef<number>(0);
  const renderTimeRef = useRef<number>(0);
  
  // Use a throttled function for performance calculations
  const updateStats = useCallback(throttle(() => {
    if (!canvas) return;
    
    const now = performance.now();
    const elapsedTime = now - lastFrameTime.current;
    
    if (elapsedTime >= 1000) {
      const fps = Math.round((frameCount.current * 1000) / elapsedTime);
      const objects = canvas.getObjects ? canvas.getObjects() : [];
      
      // Check if objects are defined before accessing properties
      const totalObjects = objects ? objects.length : 0;
      const visibleObjects = objects ? objects.filter(obj => {
        // Check if getBoundingRect exists before calling
        if (!obj || typeof obj.getBoundingRect !== 'function') return false;
        
        try {
          const bounds = obj.getBoundingRect();
          // Ensure the bounds object is defined
          if (!bounds) return false;
          
          // Safe access to bounds properties
          const left = bounds.left !== undefined ? bounds.left : 0;
          const top = bounds.top !== undefined ? bounds.top : 0;
          const width = bounds.width !== undefined ? bounds.width : 0;
          const height = bounds.height !== undefined ? bounds.height : 0;
          
          // Calculate if object is in viewport
          return true; // Simplified for now
        } catch (error) {
          console.error('Error calculating bounds:', error);
          return false;
        }
      }).length : 0;
      
      setStats({
        visibleObjects,
        totalObjects,
        lastRenderTime: renderTimeRef.current,
        fps
      });
      
      lastFrameTime.current = now;
      frameCount.current = 0;
    } else {
      frameCount.current++;
    }
  }, 500), [canvas]);
  
  const startVirtualization = useCallback(() => {
    if (!canvas || !isVirtualized) return;
    
    const handleBeforeRender = () => {
      renderTimeRef.current = performance.now();
    };
    
    const handleAfterRender = () => {
      renderTimeRef.current = performance.now() - renderTimeRef.current;
      updateStats();
    };
    
    if (canvas.on) {
      canvas.on('before:render', handleBeforeRender);
      canvas.on('after:render', handleAfterRender);
    }
    
    return () => {
      if (canvas.off) {
        canvas.off('before:render', handleBeforeRender);
        canvas.off('after:render', handleAfterRender);
      }
    };
  }, [canvas, isVirtualized, updateStats]);
  
  // Optimization function: optimize rendering based on object count
  const optimizeRendering = useCallback(debounce(() => {
    if (!canvas || !isVirtualized) return;
    
    const objects = canvas.getObjects ? canvas.getObjects() : [];
    if (!objects || objects.length < threshold) return;
    
    // Apply optimization settings
    switch (optimizationLevel) {
      case 'high':
        objects.forEach(obj => {
          if (obj) {
            obj.objectCaching = true;
            if ('strokeWidth' in obj) {
              (obj as any).strokeWidth = Math.max(1, (obj as any).strokeWidth);
            }
          }
        });
        break;
      case 'medium':
        objects.forEach(obj => {
          if (obj) obj.objectCaching = true;
        });
        break;
      case 'low':
        objects.forEach(obj => {
          if (obj && obj.type === 'path') obj.objectCaching = true;
        });
        break;
    }
    
    if (canvas.requestRenderAll) {
      canvas.requestRenderAll();
    }
  }, 500), [canvas, isVirtualized, threshold, optimizationLevel]);
  
  useEffect(() => {
    const cleanup = startVirtualization();
    return () => {
      if (cleanup && typeof cleanup === 'function') {
        cleanup();
      }
      if (updateStats && typeof updateStats.cancel === 'function') {
        updateStats.cancel();
      }
      if (optimizeRendering && typeof optimizeRendering.cancel === 'function') {
        optimizeRendering.cancel();
      }
    };
  }, [startVirtualization, updateStats, optimizeRendering]);
  
  useEffect(() => {
    setIsVirtualized(enabled);
  }, [enabled]);
  
  useEffect(() => {
    if (isVirtualized) {
      optimizeRendering();
    }
  }, [isVirtualized, optimizeRendering]);
  
  return {
    stats,
    isVirtualized,
    enableVirtualization: () => setIsVirtualized(true),
    disableVirtualization: () => setIsVirtualized(false),
    toggleVirtualization: () => setIsVirtualized(prev => !prev)
  };
};
