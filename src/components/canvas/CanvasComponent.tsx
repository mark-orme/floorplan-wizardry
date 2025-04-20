
import React, { useEffect, useRef } from 'react';
import { Canvas as FabricCanvas } from 'fabric';

interface CanvasComponentProps {
  width: number;
  height: number;
  onCanvasReady?: (canvas: FabricCanvas) => void;
  onError?: (error: Error) => void;
  className?: string;
}

const CanvasComponent: React.FC<CanvasComponentProps> = ({
  width,
  height,
  onCanvasReady,
  onError,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<FabricCanvas | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    try {
      // Initialize Fabric canvas
      const canvas = new FabricCanvas(canvasRef.current, {
        width,
        height,
        selection: true,
        preserveObjectStacking: true,
        renderOnAddRemove: true
      });
      
      // Store reference
      fabricCanvasRef.current = canvas;
      
      // Notify parent
      if (onCanvasReady) {
        onCanvasReady(canvas);
      }
      
      // Clean up on unmount
      return () => {
        if (fabricCanvasRef.current) {
          fabricCanvasRef.current.dispose();
          fabricCanvasRef.current = null;
        }
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
      className={`border border-gray-200 rounded ${className}`}
      data-testid="canvas-element"
    />
  );
};

export default CanvasComponent;
