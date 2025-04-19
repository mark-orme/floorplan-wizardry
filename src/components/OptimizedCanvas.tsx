
import React, { useRef, useEffect } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { usePointerEvents } from '@/hooks/usePointerEvents';
import { useWebGLContext } from '@/hooks/useWebGLContext';
import { toast } from 'sonner';

interface OptimizedCanvasProps {
  width?: number;
  height?: number;
  onCanvasReady?: (canvas: FabricCanvas) => void;
}

export const OptimizedCanvas: React.FC<OptimizedCanvasProps> = ({
  width = 800,
  height = 600,
  onCanvasReady
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = React.useState<FabricCanvas | null>(null);

  // Initialize fabric canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width,
      height,
      enableRetinaScaling: true,
      renderOnAddRemove: true
    });

    setFabricCanvas(canvas);
    onCanvasReady?.(canvas);

    return () => {
      canvas.dispose();
    };
  }, [width, height, onCanvasReady]);

  // Use our enhanced pointer events
  usePointerEvents({
    canvasRef,
    fabricCanvas,
    onPressureChange: (pressure) => {
      console.log('Pressure:', pressure);
    }
  });

  // Initialize WebGL context
  useWebGLContext({
    canvasRef,
    fabricCanvas
  });

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        className="border border-gray-200 rounded shadow-sm"
        style={{ touchAction: 'none' }}
      />
    </div>
  );
};
