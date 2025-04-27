
import React, { useEffect, useRef } from 'react';
import { ExtendedCanvas } from '@/types/canvas/ExtendedCanvas';

interface ReliableCanvasContainerProps {
  width: number;
  height: number;
  backgroundColor?: string;
  onReady?: (canvas: ExtendedCanvas) => void;
}

export const ReliableCanvasContainer: React.FC<ReliableCanvasContainerProps> = ({
  width,
  height,
  backgroundColor = '#ffffff',
  onReady
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    try {
      // Properly cast to ExtendedCanvas
      const canvas = new window.fabric.Canvas(canvasRef.current, {
        width,
        height, 
        backgroundColor
      }) as unknown as ExtendedCanvas;

      // Now the canvas has wrapperEl as required
      onReady?.(canvas);

      return () => {
        canvas.dispose();
      };
    } catch (error) {
      console.error('Error initializing canvas:', error);
    }
  }, [width, height, backgroundColor, onReady]);

  return (
    <div className="canvas-container">
      <canvas ref={canvasRef} />
    </div>
  );
};
