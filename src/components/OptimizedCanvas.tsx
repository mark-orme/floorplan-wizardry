import React, { useRef, useEffect, useState } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { useOptimizedDrawing } from '@/hooks/useOptimizedDrawing';
import { useWebGLContext } from '@/hooks/useWebGLContext';
import { toast } from 'sonner';

interface OptimizedCanvasProps {
  width?: number;
  height?: number;
  onCanvasReady?: (canvas: FabricCanvas) => void;
  fabricCanvasRef?: React.MutableRefObject<FabricCanvas | null>;
}

export const OptimizedCanvas: React.FC<OptimizedCanvasProps> = ({
  width = 800,
  height = 600,
  onCanvasReady,
  fabricCanvasRef: externalFabricCanvasRef
}) => {
  const internalCanvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);

  // Initialize fabric canvas with performance optimizations
  useEffect(() => {
    if (!internalCanvasRef.current) return;

    try {
      const canvas = new FabricCanvas(internalCanvasRef.current, {
        width,
        height,
        enableRetinaScaling: true,
        renderOnAddRemove: false,
        isDrawingMode: false,
        fireMiddleClick: false,
        fireRightClick: false,
        stopContextMenu: true
      });

      // Initialize the canvas
      setFabricCanvas(canvas);
      
      // Update both internal state and external ref if provided
      if (externalFabricCanvasRef) {
        externalFabricCanvasRef.current = canvas;
      }
      
      if (onCanvasReady) {
        onCanvasReady(canvas);
      }

      return () => {
        canvas.dispose();
      };
    } catch (error) {
      console.error('Error initializing canvas:', error);
      toast.error('Failed to initialize canvas. Please refresh the page.');
    }
  }, [width, height, onCanvasReady, externalFabricCanvasRef]);

  // Use our optimized drawing hook
  const { webglContext } = useOptimizedDrawing({
    canvasRef: internalCanvasRef,
    fabricCanvas
  });

  // Initialize WebGL context for advanced rendering
  const { glContext, brushSystem } = useWebGLContext({
    canvasRef: internalCanvasRef,
    fabricCanvas
  });

  return (
    <div className="relative">
      <canvas
        ref={internalCanvasRef}
        className="border border-gray-200 rounded shadow-sm"
        style={{ touchAction: 'none' }}
      />
    </div>
  );
};
