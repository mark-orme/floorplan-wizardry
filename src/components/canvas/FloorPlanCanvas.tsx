
import React, { useRef, useEffect } from 'react';
import { Canvas as FabricCanvas } from 'fabric';

interface FloorPlanCanvasProps {
  width?: number;
  height?: number;
  onCanvasReady?: (canvas: FabricCanvas) => void;
}

export const FloorPlanCanvas: React.FC<FloorPlanCanvasProps> = ({
  width = 800,
  height = 600,
  onCanvasReady
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasInstanceRef = useRef<FabricCanvas | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Initialize canvas
    const canvas = new window.fabric.Canvas(canvasRef.current, {
      width,
      height,
      backgroundColor: '#ffffff'
    });
    
    canvasInstanceRef.current = canvas;
    
    if (onCanvasReady) {
      onCanvasReady(canvas);
    }
    
    return () => {
      canvas.dispose();
      canvasInstanceRef.current = null;
    };
  }, [width, height, onCanvasReady]);

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        className="border border-gray-300 shadow-md"
      />
    </div>
  );
};

export default FloorPlanCanvas;
