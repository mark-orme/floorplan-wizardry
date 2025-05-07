// Fix the incorrect use of responseEnd property
import React, { useEffect, useState } from 'react';

interface PerformanceStats {
  fps: number;
  responseTime: number;
  memoryUsage: number | null;
  resourceCount: number;
}

export const PerformanceMonitor: React.FC = () => {
  const [stats, setStats] = useState<PerformanceStats>({
    fps: 0,
    responseTime: 0,
    memoryUsage: null,
    resourceCount: 0
  });

  useEffect(() => {
    let animationFrameId: number;
    let lastFrameTime: number | null = null;

    const calculateFPS = (timestamp: number) => {
      if (lastFrameTime !== null) {
        const timeDiff = timestamp - lastFrameTime;
        const fps = 1000 / timeDiff;
        return fps;
      }
      return 0;
    };

    const calculateMemoryUsage = () => {
      if (performance.memory) {
        return performance.memory.usedJSHeapSize / performance.memory.jsHeapSizeLimit;
      }
      return null;
    };
    
    // Fix the performance entry access
    const calculateResponseTime = () => {
      const navEntries = performance.getEntriesByType('navigation');
      let responseTime = 0;
      
      if (navEntries.length > 0) {
        const navigationEntry = navEntries[0] as PerformanceNavigationTiming;
        // Use responseEnd - requestStart instead of just responseEnd
        responseTime = navigationEntry.responseEnd - navigationEntry.requestStart;
      }
      
      return responseTime;
    };

    const calculateResourceCount = () => {
      const resourceEntries = performance.getEntriesByType('resource');
      return resourceEntries.length;
    };

    const updateStats = (timestamp: number) => {
      const fps = calculateFPS(timestamp);
      const responseTime = calculateResponseTime();
      const memoryUsage = calculateMemoryUsage();
      const resourceCount = calculateResourceCount();

      setStats({
        fps: fps,
        responseTime: responseTime,
        memoryUsage: memoryUsage,
        resourceCount: resourceCount
      });

      lastFrameTime = timestamp;
      animationFrameId = requestAnimationFrame(updateStats);
    };

    animationFrameId = requestAnimationFrame(updateStats);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);
  
  return (
    <div className="fixed bottom-0 left-0 p-4 bg-white bg-opacity-75 border border-gray-300 rounded-md shadow-lg">
      <h3 className="text-sm font-semibold mb-2">Performance Stats</h3>
      <p className="text-xs">
        FPS: <span className="font-medium">{stats.fps.toFixed(2)}</span>
      </p>
      <p className="text-xs">
        Response Time: <span className="font-medium">{stats.responseTime} ms</span>
      </p>
      <p className="text-xs">
        Resources: <span className="font-medium">{stats.resourceCount}</span>
      </p>
      {stats.memoryUsage !== null && (
        <p className="text-xs">
          Memory Usage: <span className="font-medium">{(stats.memoryUsage * 100).toFixed(2)}%</span>
        </p>
      )}
    </div>
  );
}
