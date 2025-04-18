
import { useEffect, useRef } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import logger from '@/utils/logger';
import { PerformanceStats, DEFAULT_PERFORMANCE_STATS } from '@/types/core/PerformanceStats';

interface UseGridPerformanceMonitorProps {
  canvas: FabricCanvas | null;
  enabled?: boolean;
  onPerformanceUpdate?: (stats: PerformanceStats) => void;
}

export const useGridPerformanceMonitor = ({
  canvas,
  enabled = true,
  onPerformanceUpdate
}: UseGridPerformanceMonitorProps) => {
  const statsRef = useRef<PerformanceStats>(DEFAULT_PERFORMANCE_STATS);
  const frameCountRef = useRef(0);
  const lastFrameTimeRef = useRef(performance.now());

  useEffect(() => {
    if (!canvas || !enabled) return;

    let frameId: number;
    const measurePerformance = () => {
      frameCountRef.current++;
      const now = performance.now();
      const elapsed = now - lastFrameTimeRef.current;

      // Calculate FPS every second
      if (elapsed >= 1000) {
        const fps = Math.round((frameCountRef.current * 1000) / elapsed);
        const frameTime = elapsed / frameCountRef.current;
        
        statsRef.current = {
          ...statsRef.current,
          fps,
          frameTime,
          maxFrameTime: Math.max(statsRef.current.maxFrameTime || 0, frameTime),
          longFrames: frameTime > 16 ? (statsRef.current.longFrames || 0) + 1 : statsRef.current.longFrames || 0
        };

        if (onPerformanceUpdate) {
          onPerformanceUpdate(statsRef.current);
        }

        // Log performance issues
        if (fps < 30 || frameTime > 32) {
          logger.warn('Performance issues detected', {
            fps,
            frameTime,
            objectCount: canvas.getObjects().length
          });
        }

        frameCountRef.current = 0;
        lastFrameTimeRef.current = now;
      }

      frameId = requestAnimationFrame(measurePerformance);
    };

    frameId = requestAnimationFrame(measurePerformance);

    return () => {
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
    };
  }, [canvas, enabled, onPerformanceUpdate]);

  return statsRef.current;
};
