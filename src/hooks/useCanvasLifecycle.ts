
import { useEffect, useRef, useState } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { toast } from 'sonner';

interface UseCanvasLifecycleOptions {
  onInit?: (canvas: FabricCanvas) => void;
  onDestroy?: (canvas: FabricCanvas) => void;
  onError?: (error: Error) => void;
  width?: number;
  height?: number;
  backgroundColor?: string;
}

/**
 * Hook for managing canvas lifecycle
 */
export const useCanvasLifecycle = (canvasRef: React.RefObject<HTMLCanvasElement>, options: UseCanvasLifecycleOptions = {}) => {
  const {
    onInit,
    onDestroy,
    onError,
    width = 800,
    height = 600,
    backgroundColor = '#ffffff'
  } = options;
  
  const [canvas, setCanvas] = useState<FabricCanvas | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Initialize canvas
  useEffect(() => {
    if (!canvasRef.current || isInitialized) return;
    
    try {
      const fabricCanvas = new window.fabric.Canvas(canvasRef.current, {
        width,
        height,
        backgroundColor,
        renderOnAddRemove: true,
        selection: true
      });
      
      setCanvas(fabricCanvas);
      setIsInitialized(true);
      
      if (onInit) {
        onInit(fabricCanvas);
      }
      
      return () => {
        if (fabricCanvas) {
          if (onDestroy) {
            onDestroy(fabricCanvas);
          }
          
          fabricCanvas.dispose();
          setCanvas(null);
          setIsInitialized(false);
        }
      };
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error initializing canvas');
      setError(error);
      
      if (onError) {
        onError(error);
      }
      
      toast.error(`Canvas initialization error: ${error.message}`);
      console.error('Canvas initialization error:', error);
    }
  }, [canvasRef, isInitialized, onInit, onDestroy, onError, width, height, backgroundColor]);
  
  return {
    canvas,
    isInitialized,
    error
  };
};

export default useCanvasLifecycle;
