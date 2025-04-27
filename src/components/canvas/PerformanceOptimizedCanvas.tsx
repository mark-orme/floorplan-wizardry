
import React, { useEffect, useRef } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { ExtendedCanvas } from '@/types/canvas/ExtendedCanvas';

interface PerformanceMetrics {
  objectCount: number;
  renderTime: number;
  frameRate: number;
  visibleObjects: number;
}

interface PerformanceOptimizedCanvasProps {
  width: number;
  height: number;
  onCanvasReady?: (canvas: ExtendedCanvas) => void;
}

export const PerformanceOptimizedCanvas: React.FC<PerformanceOptimizedCanvasProps> = ({
  width,
  height,
  onCanvasReady
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new window.fabric.Canvas(canvasRef.current, {
      width,
      height,
      backgroundColor: '#ffffff'
    }) as unknown as ExtendedCanvas;

    onCanvasReady?.(canvas);

    return () => {
      canvas.dispose();
    };
  }, [width, height, onCanvasReady]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
    />
  );
};
