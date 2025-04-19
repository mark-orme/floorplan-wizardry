
import { useEffect, useRef } from 'react';
import { Canvas as FabricCanvas } from 'fabric';

interface UseWebGLContextProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  fabricCanvas: FabricCanvas | null;
}

export const useWebGLContext = ({ 
  canvasRef, 
  fabricCanvas 
}: UseWebGLContextProps) => {
  const glContextRef = useRef<WebGLRenderingContext | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !fabricCanvas) return;

    try {
      // Try to get WebGL2 context first
      const gl = canvas.getContext('webgl2') || 
                canvas.getContext('webgl') as WebGLRenderingContext;

      if (!gl) {
        throw new Error('WebGL not supported');
      }

      glContextRef.current = gl;

      // Enable WebGL optimizations
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      
      console.log('WebGL context initialized');
    } catch (error) {
      console.error('Failed to initialize WebGL:', error);
    }

    return () => {
      if (glContextRef.current) {
        const ext = glContextRef.current.getExtension('WEBGL_lose_context');
        if (ext) ext.loseContext();
      }
    };
  }, [canvasRef, fabricCanvas]);

  return glContextRef;
};
