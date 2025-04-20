
import React, { useRef, useEffect } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { toast } from 'sonner';

interface CanvasComponentProps {
  width?: number;
  height?: number;
  onCanvasReady?: (canvas: FabricCanvas) => void;
  onError?: (error: Error) => void;
}

export const CanvasComponent: React.FC<CanvasComponentProps> = ({
  width = 800,
  height = 600,
  onCanvasReady,
  onError
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    try {
      const canvas = new FabricCanvas(canvasRef.current, {
        width,
        height,
        backgroundColor: '#FFFFFF',
        selection: true,
        preserveObjectStacking: true,
        renderOnAddRemove: true
      });
      
      if (onCanvasReady) {
        onCanvasReady(canvas);
      }
      
      return () => {
        canvas.dispose();
      };
    } catch (error) {
      console.error('Error initializing canvas:', error);
      if (onError && error instanceof Error) {
        onError(error);
      } else if (error instanceof Error) {
        toast.error(`Canvas error: ${error.message}`);
      }
    }
  }, [width, height, onCanvasReady, onError]);
  
  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="border border-gray-200 rounded shadow-sm"
      data-testid="canvas-component"
    />
  );
};

export default CanvasComponent;
