import { useCallback, useEffect, useRef, useState } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { PerformanceStats } from '@/types/core/PerformanceStats';
import { DEFAULT_PERFORMANCE_STATS } from '@/types/core/PerformanceStats';
import * as Sentry from '@sentry/react';

interface UseCanvasMetricsProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  reportInterval?: number;
  sampleSize?: number;
  sentryEnabled?: boolean;
}

export const useCanvasMetrics = ({
  fabricCanvasRef,
  reportInterval = 5000,
  sampleSize = 60,
  sentryEnabled = true
}: UseCanvasMetricsProps) => {
  // Performance metrics state
  const [metrics, setMetrics] = useState<PerformanceStats>(DEFAULT_PERFORMANCE_STATS);
  
  // Refs for tracking metrics
  const frameTimesRef = useRef<number[]>([]);
  const lastFrameTimeRef = useRef<number>(performance.now());
  const reportIntervalRef = useRef<number | null>(null);
  const droppedFramesRef = useRef(0);
  const longFramesRef = useRef(0);
  const framesRenderedRef = useRef(0);
  const maxFrameTimeRef = useRef(0);
  
  // Track object count for virtualization decisions
  const updateObjectCount = useCallback((visibleCount: number) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    const totalCount = canvas.getObjects().length;
    
    setMetrics(prev => ({
      ...prev,
      objectCount: totalCount,
      visibleObjectCount: visibleCount
    }));
  }, [fabricCanvasRef]);
  
  // Frame timing handler
  const recordFrame = useCallback(() => {
    const now = performance.now();
    const frameDuration = now - lastFrameTimeRef.current;
    lastFrameTimeRef.current = now;
    
    // Skip anomalous frames (e.g., after tab switch)
    if (frameDuration < 1000) {
      frameTimesRef.current.push(frameDuration);
      
      // Keep sample size manageable
      if (frameTimesRef.current.length > sampleSize) {
        frameTimesRef.current.shift();
      }
      
      // Track long frames (> 16ms, which is ~60fps threshold)
      if (frameDuration > 16.7) {
        longFramesRef.current++;
      }
      
      // Track max frame time
      if (frameDuration > maxFrameTimeRef.current) {
        maxFrameTimeRef.current = frameDuration;
      }
    }
    
    framesRenderedRef.current++;
  }, [sampleSize]);
  
  // Calculate metrics from frame data
  const calculateMetrics = useCallback(() => {
    if (frameTimesRef.current.length === 0) return;
    
    const frameTimes = frameTimesRef.current;
    const avgFrameTime = frameTimes.reduce((sum, time) => sum + time, 0) / frameTimes.length;
    const fps = 1000 / avgFrameTime;
    
    setMetrics({
      fps: Math.round(fps),
      frameTime: Math.round(avgFrameTime * 100) / 100,
      maxFrameTime: Math.round(maxFrameTimeRef.current * 100) / 100,
      longFrames: longFramesRef.current,
      droppedFrames: droppedFramesRef.current,
      // Memory usage if available
      memory: (performance as any).memory?.usedJSHeapSize 
        ? Math.round((performance as any).memory.usedJSHeapSize / 1048576) 
        : undefined,
      // Object counts will be updated separately
    });
    
    // Report to Sentry if enabled
    if (sentryEnabled && Sentry) {
      try {
        const canvas = fabricCanvasRef.current;
        const objectCount = canvas ? canvas.getObjects().length : 0;
        
        Sentry.setTag('canvas.fps', Math.round(fps));
        Sentry.setTag('canvas.objectCount', objectCount);
        
        // Create a performance transaction
        if (fps < 30) {
          Sentry.startTransaction({
            name: 'Low FPS Detected',
            op: 'monitor.performance',
            data: {
              fps,
              frameTime: avgFrameTime,
              longFrames: longFramesRef.current,
              objectCount
            }
          }).finish();
        }
      } catch (err) {
        // Ignore Sentry errors
        console.error('Sentry reporting error:', err);
      }
    }
    
    // Reset counters for next interval
    longFramesRef.current = 0;
    maxFrameTimeRef.current = 0;
  }, [fabricCanvasRef, sentryEnabled]);
  
  // Set up render tracking
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    const handleAfterRender = () => {
      recordFrame();
    };
    
    // Attach event listeners
    canvas.on('after:render', handleAfterRender);
    
    // Set up interval for regular performance reporting
    reportIntervalRef.current = window.setInterval(() => {
      calculateMetrics();
    }, reportInterval);
    
    // Clean up
    return () => {
      canvas.off('after:render', handleAfterRender);
      
      if (reportIntervalRef.current) {
        clearInterval(reportIntervalRef.current);
      }
    };
  }, [fabricCanvasRef, recordFrame, calculateMetrics, reportInterval]);
  
  return {
    metrics,
    updateObjectCount,
    recordFrame
  };
};
