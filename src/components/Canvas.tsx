
import React, { useRef, useEffect } from 'react';
import { Canvas as FabricCanvas } from 'fabric';

export interface CanvasProps {
  width: number;
  height: number;
  onCanvasReady: (canvas: FabricCanvas) => void;
  onError?: (error: Error) => void;
  style?: React.CSSProperties;
}

export const Canvas: React.FC<CanvasProps> = ({ 
  width,
  height,
  onCanvasReady,
  onError,
  style
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    try {
      const canvas = new FabricCanvas(canvasRef.current, {
        width,
        height
      });

      onCanvasReady(canvas);

      return () => {
        canvas.dispose();
      };
    } catch (error) {
      console.error('Error initializing canvas:', error);
      if (onError && error instanceof Error) {
        onError(error);
      }
    }
  }, [width, height, onCanvasReady, onError]);

  return (
    <canvas 
      ref={canvasRef} 
      width={width} 
      height={height} 
      data-testid="canvas"
      style={style}
    />
  );
};
