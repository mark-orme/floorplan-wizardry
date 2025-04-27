
import React, { useRef, useEffect } from 'react';
import { fabric } from 'fabric';
import { cn } from '@/lib/utils';

interface DrawingCanvasProps {
  width?: number;
  height?: number;
  className?: string;
  onCanvasReady?: (canvas: fabric.Canvas) => void;
  onCanvasError?: (error: Error) => void;
}

export const DrawingCanvas = ({
  width = 800,
  height = 600,
  className,
  onCanvasReady,
  onCanvasError
}: DrawingCanvasProps): JSX.Element => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    try {
      const canvas = new fabric.Canvas(canvasRef.current, {
        width,
        height,
        backgroundColor: '#ffffff'
      });

      onCanvasReady?.(canvas);

      return () => {
        canvas.dispose();
      };
    } catch (error) {
      onCanvasError?.(error instanceof Error ? error : new Error('Canvas initialization failed'));
    }
  }, [width, height, onCanvasReady, onCanvasError]);

  return (
    <canvas
      ref={canvasRef}
      className={cn('max-w-full h-auto', className)}
    />
  );
};
