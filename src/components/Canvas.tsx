
import React, { useEffect, useRef } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { createSimpleGrid } from '@/utils/simpleGridCreator';
import { toast } from 'sonner';

interface CanvasProps {
  width?: number;
  height?: number;
  onCanvasReady?: (canvas: FabricCanvas) => void;
  onError?: (error: Error) => void;
  showGridDebug?: boolean;
}

export const Canvas: React.FC<CanvasProps> = ({
  width = 800,
  height = 600,
  onCanvasReady,
  onError,
  showGridDebug = true
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    try {
      // Create canvas instance
      const canvas = new FabricCanvas(canvasRef.current, {
        width,
        height,
        backgroundColor: '#ffffff',
        selection: true,
      });
      
      // Add grid if enabled
      if (showGridDebug) {
        createSimpleGrid(canvas);
      }
      
      // Notify parent component that canvas is ready
      if (onCanvasReady) {
        onCanvasReady(canvas);
      }
      
      return () => {
        canvas.dispose();
      };
    } catch (error) {
      console.error('Canvas initialization error:', error);
      if (onError && error instanceof Error) {
        onError(error);
      } else if (error instanceof Error) {
        toast.error(`Canvas error: ${error.message}`);
      }
    }
  }, [width, height, onCanvasReady, onError, showGridDebug]);
  
  return (
    <canvas 
      ref={canvasRef}
      className="border border-gray-300 rounded shadow-sm"
      data-testid="canvas-element"
    />
  );
};

export default Canvas;
