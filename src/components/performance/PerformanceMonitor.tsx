
import React, { useEffect, useState } from 'react';
import { useTheme } from '@/hooks/useTheme';

interface PerformanceMetrics {
  fps: number;
  memory?: {
    usedJSHeapSize: number;
    totalJSHeapSize: number;
  };
  responseTime?: number;
}

interface PerformanceMonitorProps {
  showMemory?: boolean;
  showResponseTime?: boolean;
  interval?: number;
  className?: string;
}

export function PerformanceMonitor({
  showMemory = false,
  showResponseTime = false,
  interval = 1000,
  className = ''
}: PerformanceMonitorProps) {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({ fps: 0 });
  const { theme } = useTheme();
  
  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let frameId: number;
    
    const calculateFPS = () => {
      const now = performance.now();
      const elapsed = now - lastTime;
      
      if (elapsed >= interval) {
        const fps = Math.round((frameCount * 1000) / elapsed);
        
        const newMetrics: PerformanceMetrics = { fps };
        
        // Add memory metrics if supported and requested
        if (showMemory && 'memory' in performance) {
          const memoryInfo = (performance as any).memory;
          newMetrics.memory = {
            usedJSHeapSize: memoryInfo?.usedJSHeapSize || 0,
            totalJSHeapSize: memoryInfo?.totalJSHeapSize || 0
          };
        }
        
        // Add response time if requested
        if (showResponseTime) {
          const navigationEntries = performance.getEntriesByType('navigation');
          if (navigationEntries.length > 0) {
            // Safely access the responseStart property with proper type checking
            const entry = navigationEntries[0];
            const responseTime = entry ? entry.responseEnd - (entry as any).responseStart : 0;
            newMetrics.responseTime = responseTime;
          }
        }
        
        setMetrics(newMetrics);
        
        frameCount = 0;
        lastTime = now;
      }
      
      frameCount++;
      frameId = requestAnimationFrame(calculateFPS);
    };
    
    frameId = requestAnimationFrame(calculateFPS);
    
    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [interval, showMemory, showResponseTime]);
  
  const backgroundColor = theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100';
  const textColor = theme === 'dark' ? 'text-gray-100' : 'text-gray-800';
  
  return (
    <div className={`${backgroundColor} ${textColor} p-2 rounded-md text-xs fixed bottom-2 right-2 opacity-80 hover:opacity-100 transition-opacity z-50 ${className}`}>
      <div className="mb-1">FPS: {metrics.fps}</div>
      
      {showMemory && metrics.memory && (
        <div className="mb-1">
          Memory: {Math.round(metrics.memory.usedJSHeapSize / 1048576)} / {Math.round(metrics.memory.totalJSHeapSize / 1048576)} MB
        </div>
      )}
      
      {showResponseTime && metrics.responseTime !== undefined && (
        <div>Response: {metrics.responseTime.toFixed(2)} ms</div>
      )}
    </div>
  );
}
