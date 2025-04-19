
import { useEffect, useRef, useCallback } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { AdvancedBrushSystem } from '@/utils/canvas/brushes/AdvancedBrushSystem';
import { throttleRAF } from '@/utils/canvas/throttle';

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
  const lastPointRef = useRef<{x: number, y: number} | null>(null);

  // Create optimized stroke handler with RAF throttling
  const handleStroke = useCallback(throttleRAF((opt: any) => {
    if (fabricCanvas?.isDrawingMode && glContextRef.current && brushSystemRef.current) {
      const pointer = fabricCanvas.getPointer(opt.e);
      const pressure = opt.e.pressure || 1.0;
      const tiltX = opt.e.tiltX || 0;
      const tiltY = opt.e.tiltY || 0;
      
      // Calculate velocity if we have a previous point
      const prevPoint = lastPointRef.current;
      let velocity = 0;
      
      if (prevPoint) {
        const dx = pointer.x - prevPoint.x;
        const dy = pointer.y - prevPoint.y;
        velocity = Math.min(Math.sqrt(dx * dx + dy * dy) * 0.1, 1.0);
      }

      brushSystemRef.current.updateParameters({
        pressure,
        tiltX,
        tiltY,
        velocity,
        width: fabricCanvas.freeDrawingBrush.width,
        color: fabricCanvas.freeDrawingBrush.color
      });

      brushSystemRef.current.drawStroke(
        { x: pointer.x, y: pointer.y },
        lastPointRef.current
      );
      
      // Update last point
      lastPointRef.current = { x: pointer.x, y: pointer.y };
    }
  }), [fabricCanvas]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !fabricCanvas || initializationAttempted.current) return;

    initializationAttempted.current = true;
    try {
      // Initialize WebGL context with performance optimizations
      const glOptions = { 
        alpha: true, 
        antialias: true,
        preserveDrawingBuffer: true,
        premultipliedAlpha: false,
        stencil: true,
        powerPreference: 'high-performance',
        desynchronized: true // Enable desynchronized context for lower latency
      };
      
      // Try to get WebGL2 first, then fall back to WebGL
      const gl = (canvas.getContext('webgl2', glOptions) || 
                  canvas.getContext('webgl', glOptions)) as WebGLRenderingContext;

      if (!gl) {
        throw new Error('WebGL not supported');
      }

      glContextRef.current = gl;

      // Initialize WebGL configuration for optimal performance
      gl.clearColor(0.0, 0.0, 0.0, 0.0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      gl.viewport(0, 0, canvas.width, canvas.height);

      // Initialize advanced brush system
      brushSystemRef.current = new AdvancedBrushSystem(gl);
      
      // Event handlers with appropriate binding
      const customMouseDownHandler = (opt: any) => {
        // Reset last point when starting a new stroke
        lastPointRef.current = null;
        handleStroke(opt);
      };
      
      const customMouseMoveHandler = (opt: any) => {
        if (fabricCanvas.isDrawingMode) {
          handleStroke(opt);
        }
      };
      
      // Add custom handlers for drawing
      fabricCanvas.on('mouse:down', customMouseDownHandler);
      fabricCanvas.on('mouse:move', customMouseMoveHandler);

      console.log('WebGL context and brush system initialized successfully');

    } catch (error) {
      console.error('Failed to initialize WebGL context:', error);
    }

    return () => {
      if (fabricCanvas) {
        // Properly clean up event listeners
        fabricCanvas.off('mouse:down');
        fabricCanvas.off('mouse:move');
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
  }, [canvasRef, fabricCanvas, handleStroke]);

  return {
    glContext: glContextRef.current,
    brushSystem: brushSystemRef.current
  };
};
