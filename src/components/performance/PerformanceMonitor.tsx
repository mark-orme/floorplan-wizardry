
import React, { useEffect, useState, useRef } from 'react';
import { Canvas } from 'fabric';

interface PerformanceMonitorProps {
  canvas?: Canvas | null;
  renderInterval?: number;
  showFps?: boolean;
  showObjectCount?: boolean;
  showMemoryUsage?: boolean;
}

interface PerformanceData {
  fps: number;
  objectCount: number;
  memoryUsage?: {
    usedJSHeapSize?: number;
    jsHeapSizeLimit?: number;
    totalJSHeapSize?: number;
  };
}

// Custom type for performance.memory which is non-standard
interface ExtendedPerformance extends Performance {
  memory?: {
    usedJSHeapSize: number;
    jsHeapSizeLimit: number;
    totalJSHeapSize: number;
  };
}

export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({
  canvas = null,
  renderInterval = 1000,
  showFps = true,
  showObjectCount = true,
  showMemoryUsage = true,
}) => {
  const [perfData, setPerfData] = useState<PerformanceData>({
    fps: 0,
    objectCount: 0,
    memoryUsage: {
      usedJSHeapSize: 0,
      jsHeapSizeLimit: 0,
      totalJSHeapSize: 0
    }
  });

  const frameCount = useRef(0);
  const lastUpdateTime = useRef(performance.now());
  const animationFrameId = useRef<number | null>(null);

  // Get memory usage safely
  const getMemoryUsage = () => {
    const extendedPerformance = performance as ExtendedPerformance;
    if (extendedPerformance.memory) {
      return {
        usedJSHeapSize: extendedPerformance.memory.usedJSHeapSize,
        jsHeapSizeLimit: extendedPerformance.memory.jsHeapSizeLimit,
        totalJSHeapSize: extendedPerformance.memory.totalJSHeapSize,
      };
    }
    return {
      usedJSHeapSize: 0,
      jsHeapSizeLimit: 0,
      totalJSHeapSize: 0,
    };
  };

  const getObjectCount = () => {
    if (!canvas) return 0;
    return canvas.getObjects?.().length || 0;
  };

  const updateStats = () => {
    frameCount.current += 1;

    const now = performance.now();
    const elapsed = now - lastUpdateTime.current;

    if (elapsed >= renderInterval) {
      const fps = Math.round((frameCount.current * 1000) / elapsed);
      const objectCount = getObjectCount();
      const memoryUsage = getMemoryUsage();

      setPerfData({
        fps,
        objectCount,
        memoryUsage
      });

      frameCount.current = 0;
      lastUpdateTime.current = now;
    }

    animationFrameId.current = requestAnimationFrame(updateStats);
  };

  useEffect(() => {
    animationFrameId.current = requestAnimationFrame(updateStats);

    return () => {
      if (animationFrameId.current !== null) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [canvas, renderInterval]);

  const formatBytes = (bytes?: number): string => {
    if (bytes === undefined) return '0 B';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  return (
    <div className="fixed bottom-4 left-4 bg-black/80 text-white p-2 rounded font-mono text-xs z-50">
      {showFps && <div>FPS: {perfData.fps}</div>}
      {showObjectCount && <div>Objects: {perfData.objectCount}</div>}
      {showMemoryUsage && (
        <div>
          Memory: {formatBytes(perfData.memoryUsage?.usedJSHeapSize)} / {formatBytes(perfData.memoryUsage?.jsHeapSizeLimit)}
        </div>
      )}
    </div>
  );
};
