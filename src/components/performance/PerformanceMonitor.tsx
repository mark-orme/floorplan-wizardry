
import React, { useEffect, useState } from 'react';
import { Canvas } from 'fabric';

interface PerformanceMonitorProps {
  canvas?: Canvas | null;
  refreshInterval?: number;
  showMemory?: boolean;
}

interface PerformanceData {
  fps: number;
  frameTime: number;
  objectCount: number;
  renderTime: number | null;
  memoryUsage?: {
    usedJSHeapSize?: number;
    totalJSHeapSize?: number;
    jsHeapSizeLimit?: number;
  };
}

export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({
  canvas,
  refreshInterval = 1000,
  showMemory = false
}) => {
  const [perfData, setPerfData] = useState<PerformanceData>({
    fps: 0,
    frameTime: 0,
    objectCount: 0,
    renderTime: null,
    memoryUsage: {
      usedJSHeapSize: 0,
      totalJSHeapSize: 0,
      jsHeapSizeLimit: 0
    }
  });

  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let frameId: number;
    
    // Use a safe access to memory that may not be available in all browsers
    const getMemoryUsage = () => {
      try {
        const performanceMemory = (performance as any).memory;
        if (performanceMemory) {
          return {
            usedJSHeapSize: performanceMemory.usedJSHeapSize,
            totalJSHeapSize: performanceMemory.totalJSHeapSize,
            jsHeapSizeLimit: performanceMemory.jsHeapSizeLimit
          };
        }
        return undefined;
      } catch (e) {
        return undefined;
      }
    };
    
    const getObjectCount = () => {
      return canvas && canvas.getObjects ? canvas.getObjects().length : 0;
    };

    const getRenderTiming = () => {
      if (!performance.getEntriesByType) return null;
      
      const entries = performance.getEntriesByType('paint');
      const paintEntry = entries.find(entry => entry.name === 'paint');
      
      return paintEntry ? paintEntry.duration : null;
    };
    
    const measurePerformance = () => {
      frameCount++;
      
      const now = performance.now();
      const elapsed = now - lastTime;
      
      if (elapsed >= refreshInterval) {
        const fps = Math.round((frameCount * 1000) / elapsed);
        const frameTime = elapsed / frameCount;
        
        setPerfData({
          fps,
          frameTime,
          objectCount: getObjectCount(),
          renderTime: getRenderTiming(),
          memoryUsage: showMemory ? getMemoryUsage() : undefined
        });
        
        frameCount = 0;
        lastTime = now;
      }
      
      frameId = requestAnimationFrame(measurePerformance);
    };
    
    frameId = requestAnimationFrame(measurePerformance);
    
    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [canvas, refreshInterval, showMemory]);
  
  return (
    <div className="performance-monitor bg-black bg-opacity-75 text-green-400 p-2 rounded text-xs fixed bottom-4 left-4 font-mono">
      <div>FPS: {perfData.fps}</div>
      <div>Frame: {perfData.frameTime.toFixed(2)}ms</div>
      <div>Objects: {perfData.objectCount}</div>
      {perfData.renderTime !== null && (
        <div>Render: {perfData.renderTime.toFixed(2)}ms</div>
      )}
      {perfData.memoryUsage && (
        <div>
          Memory: {Math.round(perfData.memoryUsage.usedJSHeapSize / (1024 * 1024))}MB / 
          {Math.round(perfData.memoryUsage.jsHeapSizeLimit / (1024 * 1024))}MB
        </div>
      )}
    </div>
  );
};
