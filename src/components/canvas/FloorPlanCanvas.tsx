
import React, { useRef, useEffect, useState } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { useCanvasEngine } from '@/contexts/CanvasEngineContext';
import { DrawingMode } from '@/constants/drawingModes';
import { toast } from 'sonner';
import { useCanvasContext } from '@/contexts/CanvasContext';

export interface FloorPlanCanvasProps {
  width?: number;
  height?: number;
  onCanvasReady?: (engine: any) => void;
  onError?: (error: Error) => void;
  tool?: DrawingMode;
  className?: string;
}

export const FloorPlanCanvas: React.FC<FloorPlanCanvasProps> = ({
  width = 800,
  height = 600,
  onCanvasReady,
  onError,
  tool = DrawingMode.SELECT,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { engine, setEngine } = useCanvasEngine();
  const { setCanvas } = useCanvasContext();
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);

  // Initialize canvas when component mounts
  useEffect(() => {
    if (!canvasRef.current) return;

    try {
      // Create a new FabricCanvas directly when CanvasEngine is not available
      const canvas = new FabricCanvas(canvasRef.current, {
        width,
        height,
        backgroundColor: '#ffffff',
        selection: true,
        renderOnAddRemove: true
      });
      
      setFabricCanvas(canvas);
      
      if (setEngine) {
        // If we have access to the engine context, use it
        setEngine({ 
          canvas,
          getCanvas: () => canvas,
          dispose: () => canvas.dispose()
        });
      }
      
      if (setCanvas) {
        setCanvas(canvas);
      }
      
      if (onCanvasReady) {
        onCanvasReady({ 
          canvas,
          getCanvas: () => canvas,
          dispose: () => canvas.dispose()
        });
      }

      return () => {
        canvas.dispose();
        setFabricCanvas(null);
        if (setEngine) {
          setEngine(null);
        }
      };
    } catch (error) {
      console.error('Error initializing canvas:', error);
      if (onError && error instanceof Error) {
        onError(error);
      } else if (error instanceof Error) {
        toast.error(`Canvas error: ${error.message}`);
      }
    }
  }, [width, height, onCanvasReady, onError, setEngine, setCanvas]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className={`border border-gray-200 rounded shadow-sm ${className}`}
      data-testid="floor-plan-canvas"
    />
  );
};

export default FloorPlanCanvas;
