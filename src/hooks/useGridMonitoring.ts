import { useState, useEffect, useCallback } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { captureMessage } from '@/utils/sentry';

interface GridMonitoringOptions {
  canvas: FabricCanvas | null;
  gridSize: number;
  threshold?: number;
  interval?: number;
}

export const useGridMonitoring = ({
  canvas,
  gridSize,
  threshold = 0.1,
  interval = 5000
}: GridMonitoringOptions) => {
  const [renderTime, setRenderTime] = useState(0);
  const [objectCount, setObjectCount] = useState(0);

  const measureGridPerformance = useCallback(() => {
    if (!canvas) return;

    const start = performance.now();
    canvas.requestRenderAll();
    const end = performance.now();

    const currentRenderTime = end - start;
    const currentObjectCount = canvas.getObjects().length;

    setRenderTime(currentRenderTime);
    setObjectCount(currentObjectCount);
    
    captureMessage("Grid performance metric captured", {
      level: 'info',
      tags: { component: "GridMonitoring" },
      extra: { renderTime, objectCount, gridSize }
    });
  }, [canvas, gridSize, renderTime, objectCount]);

  const optimizeGridSize = useCallback(() => {
    if (!canvas) return;

    const currentObjectCount = canvas.getObjects().length;
    const idealGridSize = Math.ceil(Math.sqrt(currentObjectCount));

    if (Math.abs(idealGridSize - gridSize) > threshold * gridSize) {
      const previousSize = gridSize;
      const newSize = idealGridSize;
      
      captureMessage("Grid size optimized", {
        level: 'info',
        tags: { component: "GridMonitoring" },
        extra: { previousSize, newSize, threshold }
      });
    }
  }, [canvas, gridSize, threshold]);

  useEffect(() => {
    const performanceInterval = setInterval(measureGridPerformance, interval);
    const optimizationInterval = setInterval(optimizeGridSize, interval * 2);

    return () => {
      clearInterval(performanceInterval);
      clearInterval(optimizationInterval);
    };
  }, [measureGridPerformance, optimizeGridSize, interval]);

  return {
    renderTime,
    objectCount
  };
};
