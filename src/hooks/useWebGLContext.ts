
import { useEffect, useRef } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { AdvancedBrushSystem } from '@/utils/canvas/brushes/AdvancedBrushSystem';

interface UseWebGLContextProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  fabricCanvas: FabricCanvas | null;
}

export const useWebGLContext = ({ 
  canvasRef, 
  fabricCanvas 
}: UseWebGLContextProps) => {
  const glContextRef = useRef<WebGLRenderingContext | WebGL2RenderingContext | null>(null);
  const brushSystemRef = useRef<AdvancedBrushSystem | null>(null);
  const initializationAttempted = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !fabricCanvas || initializationAttempted.current) return;

    initializationAttempted.current = true;
    try {
      // Initialize WebGL context
      const gl = (canvas.getContext('webgl2', { 
        alpha: true, 
        antialias: true,
        preserveDrawingBuffer: true,
        premultipliedAlpha: false,
        stencil: true 
      }) || 
      canvas.getContext('webgl', { 
        alpha: true, 
        antialias: true,
        preserveDrawingBuffer: true,
        premultipliedAlpha: false,
        stencil: true 
      })) as WebGLRenderingContext;

      if (!gl) {
        throw new Error('WebGL not supported');
      }

      glContextRef.current = gl;

      // Initialize WebGL configuration
      gl.clearColor(0.0, 0.0, 0.0, 0.0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      gl.viewport(0, 0, canvas.width, canvas.height);

      // Initialize advanced brush system
      brushSystemRef.current = new AdvancedBrushSystem(gl);
      
      // Custom drawing handler
      const customMouseDownHandler = (opt: any) => {
        if (fabricCanvas.isDrawingMode && glContextRef.current && brushSystemRef.current) {
          const pointer = fabricCanvas.getPointer(opt.e);
          const pressure = opt.e.pressure || 1.0;
          const tiltX = opt.e.tiltX || 0;
          const tiltY = opt.e.tiltY || 0;

          brushSystemRef.current.updateParameters({
            pressure,
            tiltX,
            tiltY,
            width: fabricCanvas.freeDrawingBrush.width,
            color: fabricCanvas.freeDrawingBrush.color
          });

          brushSystemRef.current.drawStroke(
            { x: pointer.x, y: pointer.y },
            null
          );
        }
      };

      // Add custom handler for drawing
      fabricCanvas.on('mouse:down', customMouseDownHandler);

      console.log('WebGL context and brush system initialized successfully');

    } catch (error) {
      console.error('Failed to initialize WebGL context:', error);
    }

    return () => {
      if (fabricCanvas) {
        fabricCanvas.off('mouse:down');
      }
      
      if (glContextRef.current) {
        if (brushSystemRef.current) {
          // Clean up brush system resources if needed
        }
        
        const ext = glContextRef.current.getExtension('WEBGL_lose_context');
        if (ext) ext.loseContext();
        
        glContextRef.current = null;
        brushSystemRef.current = null;
        initializationAttempted.current = false;
      }
    };
  }, [canvasRef, fabricCanvas]);

  return {
    glContext: glContextRef.current,
    brushSystem: brushSystemRef.current
  };
};
