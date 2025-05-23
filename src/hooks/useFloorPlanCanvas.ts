import { useCallback, useEffect, useState } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { toast } from 'sonner';

interface UseFloorPlanCanvasProps {
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>;
  width?: number;
  height?: number;
  onCanvasReady?: (canvas: FabricCanvas) => void;
  onCanvasError?: (error: Error) => void;
}

export const useFloorPlanCanvas = ({
  canvasRef,
  width = 800,
  height = 600,
  onCanvasReady,
  onCanvasError
}: UseFloorPlanCanvasProps) => {
  const [canvas, setCanvas] = useState<FabricCanvas | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Initialize canvas
  const initializeCanvas = useCallback(() => {
    if (!canvasRef.current) return;
    
    try {
      const fabricCanvas = new FabricCanvas(canvasRef.current, {
        width,
        height,
        backgroundColor: '#ffffff'
      });
      
      setCanvas(fabricCanvas);
      setIsLoading(false);
      
      if (onCanvasReady) {
        onCanvasReady(fabricCanvas);
      }
      
      return fabricCanvas;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to initialize canvas');
      
      setError(error);
      setIsLoading(false);
      
      if (onCanvasError) {
        onCanvasError(error);
      }
      
      toast.error('Failed to initialize canvas');
      return null;
    }
  }, [canvasRef, width, height, onCanvasReady, onCanvasError]);
  
  // Set up canvas event listeners
  const setupEventListeners = useCallback((canvas: FabricCanvas) => {
    const handleMouseDown = (e: any) => {
      // Handle mouse events
    };
    
    const handleMouseMove = (e: any) => {
      // Handle mouse events
    };
    
    const handleMouseUp = (e: any) => {
      // Handle mouse events
    };
    
    // Add event listeners
    canvas.on('mouse:down', handleMouseDown);
    canvas.on('mouse:move', handleMouseMove);
    canvas.on('mouse:up', handleMouseUp);
    
    // Return cleanup function
    return () => {
      canvas.off('mouse:down', handleMouseDown);
      canvas.off('mouse:move', handleMouseMove);
      canvas.off('mouse:up', handleMouseUp);
    };
  }, []);
  
  // Initialize canvas on mount
  useEffect(() => {
    const canvas = initializeCanvas();
    if (!canvas) return;
    
    const cleanup = setupEventListeners(canvas);
    
    return () => {
      cleanup();
      canvas.dispose();
      setCanvas(null);
    };
  }, [initializeCanvas, setupEventListeners]);
  
  return {
    canvas,
    isLoading,
    error,
    setCanvas
  };
};
