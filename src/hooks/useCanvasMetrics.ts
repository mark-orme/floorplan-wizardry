
import { useCallback, useState, useEffect, useRef } from 'react';
import { Canvas as FabricCanvas } from 'fabric';

interface PerformanceMetrics {
  fps: number;
  renderTime: number;
  objectCount: number;
}

export const useCanvasMetrics = ({ 
  fabricCanvasRef 
}: { 
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null> 
}) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 0,
    renderTime: 0,
    objectCount: 0
  });

  const frameCountRef = useRef(0);
  const lastFrameTimeRef = useRef(performance.now());

  const updateObjectCount = useCallback((count: number) => {
    setMetrics(prev => ({
      ...prev,
      objectCount: count
    }));
  }, []);

  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    let frameId: number;
    const updateFPS = () => {
      frameCountRef.current++;
      const now = performance.now();
      const elapsed = now - lastFrameTimeRef.current;

      if (elapsed >= 1000) {
        const fps = Math.round((frameCountRef.current * 1000) / elapsed);
        setMetrics(prev => ({ ...prev, fps }));
        frameCountRef.current = 0;
        lastFrameTimeRef.current = now;
      }

      frameId = requestAnimationFrame(updateFPS);
    };

    frameId = requestAnimationFrame(updateFPS);

    return () => {
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, [fabricCanvasRef]);

  return { metrics, updateObjectCount };
};
