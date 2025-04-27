
import React, { useRef, useEffect } from 'react';
import { ExtendedCanvas } from '@/types/canvas/ExtendedCanvas';

interface FloorPlanCanvasProps {
  onCanvasError?: (error: Error) => void;
}

export const FloorPlanCanvas: React.FC<FloorPlanCanvasProps> = ({ onCanvasError }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    try {
      const canvas = new window.fabric.Canvas(canvasRef.current, {
        width: 800,
        height: 600,
        backgroundColor: '#ffffff'
      }) as unknown as ExtendedCanvas;

      return () => {
        canvas.dispose();
      };
    } catch (error) {
      onCanvasError?.(error instanceof Error ? error : new Error('Canvas initialization failed'));
    }
  }, [onCanvasError]);

  return (
    <div className="w-full h-[500px] border border-gray-200 rounded-md bg-gray-50 flex items-center justify-center">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
      />
    </div>
  );
};
