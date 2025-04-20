
import React, { useRef, useEffect } from 'react';
import { useCanvasEngine } from '@/contexts/CanvasEngineContext';
import { FabricCanvasEngine } from '@/implementations/canvas-engine/FabricCanvasEngine';
import { useWebGLCanvas } from '@/hooks/useWebGLCanvas';
import { toast } from 'sonner';

export interface FloorPlanCanvasProps {
  width?: number;
  height?: number;
  onCanvasReady?: (engine: any) => void;
  onError?: (error: Error) => void;
}

export const FloorPlanCanvas: React.FC<FloorPlanCanvasProps> = ({
  width = 800,
  height = 600,
  onCanvasReady,
  onError
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { setEngine } = useCanvasEngine();
  const [fabricCanvas, setFabricCanvas] = React.useState<FabricCanvas | null>(null);

  // Initialize WebGL canvas
  const { webglRenderer } = useWebGLCanvas({
    canvasRef,
    fabricCanvas
  });

  useEffect(() => {
    if (!canvasRef.current) return;

    try {
      const engine = new FabricCanvasEngine(canvasRef.current);
      setEngine(engine);
      setFabricCanvas(engine.canvas);
      
      if (onCanvasReady) {
        onCanvasReady(engine);
      }

      return () => {
        engine.dispose();
      };
    } catch (error) {
      console.error('Error initializing canvas:', error);
      if (onError && error instanceof Error) {
        onError(error);
      } else if (error instanceof Error) {
        toast.error(`Canvas error: ${error.message}`);
      }
    }
  }, [setEngine, onCanvasReady, onError]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="border border-gray-200 rounded shadow-sm"
      data-testid="floor-plan-canvas"
    />
  );
};
