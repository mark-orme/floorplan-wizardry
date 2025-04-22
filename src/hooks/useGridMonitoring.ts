
import { useEffect, useCallback } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { captureMessage } from '@/utils/sentryUtils';

interface UseGridMonitoringProps {
  fabricCanvas: FabricCanvas | null;
  gridObjects: any[];
  gridSize: number;
  componentName?: string;
}

/**
 * Hook for monitoring grid performance and issues
 */
export const useGridMonitoring = ({
  fabricCanvas,
  gridObjects,
  gridSize,
  componentName = 'GridMonitoring'
}: UseGridMonitoringProps) => {
  // Monitor grid rendering performance
  const monitorGridRenderTime = useCallback(() => {
    if (!fabricCanvas) return;
    
    const startTime = performance.now();
    
    fabricCanvas.renderAll();
    
    const renderTime = performance.now() - startTime;
    
    // Only log if rendering takes longer than expected
    if (renderTime > 16) { // 60fps = ~16ms per frame
      captureMessage("Grid rendering performance issue", {
        level: 'warning',
        tags: { component: componentName },
        extra: {
          renderTime,
          objectCount: gridObjects.length,
          gridSize
        }
      });
    }
  }, [fabricCanvas, gridObjects, gridSize, componentName]);
  
  // Monitor grid visibility issues
  const monitorGridVisibility = useCallback(() => {
    if (!fabricCanvas || gridObjects.length === 0) return;
    
    const visibleGridLines = gridObjects.filter(obj => obj.visible);
    const visibilityRatio = visibleGridLines.length / gridObjects.length;
    
    if (visibilityRatio < 0.9) { // More than 10% of grid lines are invisible
      captureMessage("Grid visibility issue detected", {
        level: 'warning',
        tags: { component: componentName },
        extra: {
          totalLines: gridObjects.length,
          visibleLines: visibleGridLines.length,
          visibilityRatio
        }
      });
      
      // Try to fix by forcing all grid lines to be visible
      gridObjects.forEach(obj => {
        obj.set('visible', true);
      });
      
      fabricCanvas.requestRenderAll();
    }
  }, [fabricCanvas, gridObjects, componentName]);
  
  // Set up periodic monitoring
  useEffect(() => {
    if (!fabricCanvas || gridObjects.length === 0) return;
    
    // Initial check
    monitorGridVisibility();
    
    // Periodic checks
    const visibilityInterval = setInterval(monitorGridVisibility, 10000);
    const performanceInterval = setInterval(monitorGridRenderTime, 30000);
    
    return () => {
      clearInterval(visibilityInterval);
      clearInterval(performanceInterval);
    };
  }, [fabricCanvas, gridObjects, monitorGridRenderTime, monitorGridVisibility]);
  
  return {
    monitorGridRenderTime,
    monitorGridVisibility
  };
};
