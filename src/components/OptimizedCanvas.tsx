
import React, { useRef, useEffect } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { usePointerEvents } from '@/hooks/usePointerEvents';
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
  const [fabricCanvas, setFabricCanvas] = React.useState<FabricCanvas | null>(null);

  // Initialize fabric canvas
  useEffect(() => {
    if (!internalCanvasRef.current) return;

    const canvas = new FabricCanvas(internalCanvasRef.current, {
      width,
      height,
      enableRetinaScaling: true,
      renderOnAddRemove: true
    });

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
  }, [width, height, onCanvasReady, externalFabricCanvasRef]);

  // Use our enhanced pointer events
  usePointerEvents({
    canvasRef: internalCanvasRef,
    fabricCanvas,
    onPressureChange: (pressure) => {
      console.log('Pressure:', pressure);
    }
  });

  // Initialize WebGL context
  useWebGLContext({
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
