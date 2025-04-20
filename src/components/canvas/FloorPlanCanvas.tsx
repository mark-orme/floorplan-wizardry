
import React, { useRef, useEffect } from 'react';
import { useCanvasEngine } from '@/contexts/CanvasEngineContext';
import { FabricCanvasEngine } from '@/implementations/canvas-engine/FabricCanvasEngine';

interface FloorPlanCanvasProps {
  width?: number;
  height?: number;
  onCanvasReady?: (engine: any) => void;
}

export const FloorPlanCanvas: React.FC<FloorPlanCanvasProps> = ({
  width = 800,
  height = 600,
  onCanvasReady
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { setEngine } = useCanvasEngine();

  useEffect(() => {
    if (!canvasRef.current) return;

    const engine = new FabricCanvasEngine(canvasRef.current);
    setEngine(engine);
    
    if (onCanvasReady) {
      onCanvasReady(engine);
    }

    return () => {
      engine.dispose();
    };
  }, [setEngine, onCanvasReady]);

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
