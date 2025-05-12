
import React, { useRef } from 'react';
import { Canvas } from 'fabric';
import { toast } from 'sonner';

interface CanvasWithFallbackProps {
  width?: number;
  height?: number;
  onCanvasReady?: (canvas: Canvas) => void;
  onError?: (error: Error) => void;
}

export const CanvasWithFallback: React.FC<CanvasWithFallbackProps> = ({
  width = 800,
  height = 600,
  onCanvasReady,
  onError
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const initializeCanvas = () => {
    if (!canvasRef.current) return;
    
    try {
      const canvas = new Canvas(canvasRef.current, {
        width,
        height,
        backgroundColor: '#ffffff'
      });
      
      if (onCanvasReady) {
        onCanvasReady(canvas);
      }
      
      return canvas;
    } catch (error) {
      if (onError && error instanceof Error) {
        onError(error);
      }
      toast.error('Failed to initialize canvas');
      return null;
    }
  };
  
  return (
    <div className="canvas-container">
      <canvas 
        ref={canvasRef} 
        className="border border-gray-200 rounded"
        aria-label="Drawing canvas"
      />
    </div>
  );
};

export default CanvasWithFallback;
