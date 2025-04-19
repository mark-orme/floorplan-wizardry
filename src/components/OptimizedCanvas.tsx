
import React, { useRef, useEffect, useState } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { useOptimizedDrawing } from '@/hooks/useOptimizedDrawing';
import { usePointerEvents } from '@/hooks/usePointerEvents';
import { toast } from 'sonner';

interface OptimizedCanvasProps {
  width?: number;
  height?: number;
  onCanvasReady?: (canvas: FabricCanvas) => void;
  fabricCanvasRef?: React.MutableRefObject<FabricCanvas | null>;
  onPointerMove?: (e: PointerEvent) => void;
}

export const OptimizedCanvas: React.FC<OptimizedCanvasProps> = ({
  width = 800,
  height = 600,
  onCanvasReady,
  fabricCanvasRef: externalFabricCanvasRef,
  onPointerMove
}) => {
  const internalCanvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [pressure, setPressure] = useState<number>(0.5);
  const [tilt, setTilt] = useState<{x: number, y: number}>({x: 0, y: 0});

  // Initialize fabric canvas with performance optimizations
  useEffect(() => {
    if (!internalCanvasRef.current) return;

    try {
      const canvas = new FabricCanvas(internalCanvasRef.current, {
        width,
        height,
        enableRetinaScaling: true,
        renderOnAddRemove: false,
        isDrawingMode: true,
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

  // Handle pressure changes
  const handlePressureChange = (newPressure: number) => {
    setPressure(newPressure);
  };

  // Handle tilt changes
  const handleTiltChange = (tiltX: number, tiltY: number) => {
    setTilt({x: tiltX, y: tiltY});
  };

  // Use our optimized drawing hook with proper parameters
  const { isDrawing, objectCount, metrics } = useOptimizedDrawing({
    canvas: fabricCanvas,
    currentTool: 'DRAW',
    lineThickness: 2,
    lineColor: '#000000'
  });

  // Use enhanced pointer events with proper props
  usePointerEvents({
    onPointerDown: (e) => {},
    onPointerMove: (e) => {},
    onPointerUp: (e) => {},
    enabled: true
  });

  return (
    <div className="relative">
      <canvas
        ref={internalCanvasRef}
        className="border border-gray-200 rounded shadow-sm"
        style={{ touchAction: 'none' }}
      />
      {/* Optional: Add pressure and tilt indicators for debugging */}
      {process.env.NODE_ENV !== 'production' && (
        <div className="absolute bottom-2 right-2 bg-white/80 text-xs text-gray-700 px-2 py-1 rounded">
          <div>Pressure: {pressure.toFixed(2)}</div>
          <div>Tilt: [{tilt.x.toFixed(1)}, {tilt.y.toFixed(1)}]</div>
        </div>
      )}
    </div>
  );
};
