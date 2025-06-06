
import { useEffect, useRef } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { WebGLRenderer } from '@/utils/webgl/webglRenderer';

interface UseWebGLCanvasProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  fabricCanvas: FabricCanvas | null;
}

export const useWebGLCanvas = ({ canvasRef, fabricCanvas }: UseWebGLCanvasProps) => {
  const webglRendererRef = useRef<WebGLRenderer | null>(null);

  useEffect(() => {
    if (!canvasRef.current || !fabricCanvas) return;

    try {
      // Initialize the WebGL renderer
      webglRendererRef.current = new WebGLRenderer(canvasRef.current);
      console.log('WebGL renderer initialized successfully');
    } catch (error) {
      console.error('Error initializing WebGL renderer:', error);
      // Consider adding error handling or fallback mechanism
    }

    return () => {
      if (webglRendererRef.current) {
        webglRendererRef.current.dispose();
        webglRendererRef.current = null;
      }
    };
  }, [canvasRef, fabricCanvas]);

  return {
    webglRenderer: webglRendererRef.current
  };
};
