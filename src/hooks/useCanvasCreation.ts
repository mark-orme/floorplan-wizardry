
import { useEffect, useState, useRef, useCallback } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { toast } from 'sonner';

export interface UseCanvasCreationOptions {
  canvasEl: HTMLCanvasElement | null;
  width?: number;
  height?: number;
  backgroundColor?: string;
  onReady?: (canvas: FabricCanvas) => void;
  onError?: (error: Error) => void;
}

export const useCanvasCreation = ({
  canvasEl,
  width = 800,
  height = 600,
  backgroundColor = '#ffffff',
  onReady,
  onError
}: UseCanvasCreationOptions) => {
  const [canvas, setCanvas] = useState<FabricCanvas | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const initAttemptRef = useRef(0);

  // Initialize or reinitialize the canvas
  const initializeCanvas = useCallback(() => {
    if (!canvasEl) {
      const canvasError = new Error('Canvas element is missing');
      setError(canvasError);
      if (onError) onError(canvasError);
      return;
    }

    try {
      // Dispose of existing canvas if there is one
      if (canvas) {
        canvas.dispose();
      }

      initAttemptRef.current++;
      const attempt = initAttemptRef.current;

      // Create new Fabric canvas
      const fabricCanvas = new FabricCanvas(canvasEl, {
        width,
        height,
        backgroundColor,
        preserveObjectStacking: true,
        enableRetinaScaling: true,
        selection: true
      });

      console.log(`Canvas initialized (attempt ${attempt}): ${width}x${height}`);

      // Update state with new canvas
      setCanvas(fabricCanvas);
      setIsInitialized(true);
      setError(null);

      // Notify parent component
      if (onReady) {
        onReady(fabricCanvas);
      }

      return fabricCanvas;
    } catch (err) {
      console.error('Error initializing canvas:', err);
      const canvasError = err instanceof Error ? err : new Error('Failed to initialize canvas');
      setError(canvasError);
      setIsInitialized(false);
      
      if (onError) {
        onError(canvasError);
      }
      
      toast.error(`Canvas error: ${canvasError.message}`);
      return null;
    }
  }, [canvasEl, width, height, backgroundColor, canvas, onReady, onError]);

  // Initialize canvas on mount or when dependencies change
  useEffect(() => {
    const fabricCanvas = initializeCanvas();
    
    // Cleanup function
    return () => {
      if (fabricCanvas) {
        console.log('Disposing canvas on cleanup');
        fabricCanvas.dispose();
        setCanvas(null);
        setIsInitialized(false);
      }
    };
  }, [initializeCanvas]);

  // Handle canvas resize
  const resizeCanvas = useCallback((newWidth: number, newHeight: number) => {
    if (!canvas) return;
    
    try {
      canvas.setWidth(newWidth);
      canvas.setHeight(newHeight);
      canvas.renderAll();
      console.log(`Canvas resized to ${newWidth}x${newHeight}`);
    } catch (err) {
      console.error('Error resizing canvas:', err);
      const resizeError = err instanceof Error ? err : new Error('Failed to resize canvas');
      setError(resizeError);
      
      if (onError) {
        onError(resizeError);
      }
      
      toast.error(`Resize error: ${resizeError.message}`);
    }
  }, [canvas, onError]);

  // Retry initialization if it failed
  const retryInitialization = useCallback(() => {
    if (initAttemptRef.current >= 3) {
      toast.error('Maximum retry attempts reached');
      return;
    }
    
    console.log('Retrying canvas initialization');
    toast.info('Retrying canvas initialization...');
    initializeCanvas();
  }, [initializeCanvas]);

  return {
    canvas,
    isInitialized,
    error,
    resizeCanvas,
    retryInitialization
  };
};
