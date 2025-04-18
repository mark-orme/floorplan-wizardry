
import { useEffect, useRef, useState } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { toast } from 'sonner';
import logger from '@/utils/logger';

interface UseCanvasInitializationProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  width: number;
  height: number;
  onReady?: (canvas: FabricCanvas) => void;
}

export const useCanvasInitialization = ({
  canvasRef,
  width,
  height,
  onReady
}: UseCanvasInitializationProps) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const fabricCanvasRef = useRef<FabricCanvas | null>(null);
  const initAttemptsRef = useRef(0);
  const MAX_INIT_ATTEMPTS = 3;

  useEffect(() => {
    const initializeCanvas = () => {
      try {
        if (!canvasRef.current) {
          throw new Error('Canvas element not found');
        }

        // Create new Fabric canvas instance
        const canvas = new FabricCanvas(canvasRef.current, {
          width,
          height,
          backgroundColor: '#ffffff',
          selection: true,
          renderOnAddRemove: true
        });

        // Store canvas reference
        fabricCanvasRef.current = canvas;
        setIsInitialized(true);
        setError(null);
        initAttemptsRef.current = 0;

        // Notify parent component
        if (onReady) {
          onReady(canvas);
        }

        logger.info('Canvas initialized successfully');
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to initialize canvas');
        logger.error('Canvas initialization error:', error);
        setError(error);

        // Retry initialization if not exceeded max attempts
        if (initAttemptsRef.current < MAX_INIT_ATTEMPTS) {
          initAttemptsRef.current++;
          setTimeout(initializeCanvas, 500);
        } else {
          toast.error('Failed to initialize canvas after multiple attempts');
        }
      }
    };

    if (!isInitialized && !error) {
      initializeCanvas();
    }

    // Cleanup function
    return () => {
      if (fabricCanvasRef.current) {
        fabricCanvasRef.current.dispose();
        fabricCanvasRef.current = null;
      }
    };
  }, [canvasRef, width, height, onReady, isInitialized]);

  return {
    canvas: fabricCanvasRef.current,
    isInitialized,
    error
  };
};
