
import React, { useRef, useEffect } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { GridLayer } from './canvas/grid/GridLayer';
import { toast } from 'sonner';

export interface CanvasProps {
  width: number;
  height: number;
  onCanvasReady?: (canvas: FabricCanvas) => void;
  onError?: (error: Error) => void;
  showGridDebug?: boolean;
}

export const Canvas: React.FC<CanvasProps> = ({
  width,
  height,
  onCanvasReady,
  onError,
  showGridDebug = false
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<FabricCanvas | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    try {
      const canvas = new FabricCanvas(canvasRef.current, {
        width,
        height,
        backgroundColor: '#ffffff',
        selection: true,
        renderOnAddRemove: true
      });

      // Store reference to the canvas
      fabricCanvasRef.current = canvas;

      // Call the onCanvasReady callback
      if (onCanvasReady) {
        onCanvasReady(canvas);
      }

      return () => {
        // Clean up the canvas when component unmounts
        canvas.dispose();
        fabricCanvasRef.current = null;
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
    <div className="canvas-container relative" data-testid="canvas-wrapper">
      <canvas
        ref={canvasRef}
        className="border border-gray-200 shadow-sm"
        data-testid="fabric-canvas"
      />
      {fabricCanvasRef.current && (
        <GridLayer
          fabricCanvas={fabricCanvasRef.current}
          dimensions={{ width, height }}
          showDebug={showGridDebug}
        />
      )}
    </div>
  );
};

export default Canvas;
