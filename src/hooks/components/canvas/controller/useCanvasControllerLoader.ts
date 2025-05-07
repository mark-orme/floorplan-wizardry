
import { useState, useEffect } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { toast } from 'sonner';

interface DebugInfo {
  fps: number;
  objectCount: number;
  renderTime: number;
}

interface UseCanvasControllerLoaderProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  debugInfo: DebugInfo;
  setDebugInfo: React.Dispatch<React.SetStateAction<DebugInfo>>;
  setErrorMessage: React.Dispatch<React.SetStateAction<string | null>>;
}

export const useCanvasControllerLoader = ({
  canvasRef,
  debugInfo,
  setDebugInfo,
  setErrorMessage
}: UseCanvasControllerLoaderProps) => {
  const [canvas, setCanvas] = useState<FabricCanvas | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!canvasRef.current || isInitialized) return;

    try {
      const fabricCanvas = new FabricCanvas(canvasRef.current, {
        width: 800,
        height: 600,
        backgroundColor: '#FFFFFF'
      });
      
      setCanvas(fabricCanvas);
      setIsInitialized(true);
      setErrorMessage(null);
      
      return () => {
        fabricCanvas.dispose();
      };
    } catch (error) {
      console.error('Failed to initialize canvas:', error);
      setErrorMessage('Failed to initialize canvas');
      toast.error('Failed to initialize canvas');
    }
  }, [canvasRef, isInitialized, setErrorMessage]);

  return {
    canvas,
    isInitialized
  };
};
