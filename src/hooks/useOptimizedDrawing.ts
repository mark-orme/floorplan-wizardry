
import { useEffect, useRef } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { toFabricPoint } from '@/utils/fabricPointConverter';

interface UseOptimizedDrawingProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  fabricCanvas: FabricCanvas | null;
}

export const useOptimizedDrawing = ({ 
  canvasRef, 
  fabricCanvas 
}: UseOptimizedDrawingProps) => {
  const webglContextRef = useRef<WebGLRenderingContext | null>(null);

  // Initialize WebGL for performance optimization
  useEffect(() => {
    if (!canvasRef.current || !fabricCanvas) return;

    try {
      // Set up WebGL context for enhanced rendering
      const gl = canvasRef.current.getContext('webgl', {
        alpha: true,
        premultipliedAlpha: false,
        antialias: true,
        depth: false,
        stencil: false
      });

      if (!gl) {
        console.warn('WebGL not supported, falling back to standard rendering');
        return;
      }

      webglContextRef.current = gl;

      // Configure WebGL
      gl.clearColor(0, 0, 0, 0);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

      // Create optimized drawing brushes with WebGL support
      if (fabricCanvas.freeDrawingBrush) {
        fabricCanvas.freeDrawingBrush.width = 2;
        fabricCanvas.freeDrawingBrush.color = '#000000';
      }

      // Add rendering optimizations
      fabricCanvas.enableRetinaScaling = window.devicePixelRatio > 1;
      fabricCanvas.skipTargetFind = true;
      fabricCanvas.selection = false;
      
      // Optimize for drawing
      fabricCanvas.isDrawingMode = true;
      
    } catch (error) {
      console.error('Error initializing WebGL context', error);
    }

    return () => {
      if (webglContextRef.current) {
        const loseContext = webglContextRef.current.getExtension('WEBGL_lose_context');
        if (loseContext) {
          loseContext.loseContext();
        }
        webglContextRef.current = null;
      }
    };
  }, [canvasRef, fabricCanvas]);

  // Set up optimized drawing handlers
  useEffect(() => {
    if (!fabricCanvas || !canvasRef.current) return;

    // Draw with optimized path
    const handleDraw = (point: {x: number, y: number}, isDown: boolean) => {
      if (!fabricCanvas.isDrawingMode || !fabricCanvas.freeDrawingBrush) return;
    
      const fabricPoint = toFabricPoint(point);
      
      if (isDown) {
        // Create dummy event
        const dummyEvent = new Event('mousedown');
        // Fixed: use proper object structure for fabric v6
        fabricCanvas.freeDrawingBrush.onMouseDown({ e: dummyEvent, pointer: fabricPoint });
      } else {
        // Create dummy event
        const dummyEvent = new Event('mousemove');
        // Fixed: use proper object structure for fabric v6
        fabricCanvas.freeDrawingBrush.onMouseMove({ e: dummyEvent, pointer: fabricPoint });
      }
    };

    // Optimize rendering with throttled updates
    let rafId: number | null = null;
    const pendingPoints: Array<{x: number, y: number, isDown: boolean}> = [];
    
    const processPoints = () => {
      if (pendingPoints.length === 0) return;
      
      // Process all pending points
      for (const point of pendingPoints) {
        handleDraw(point, point.isDown);
      }
      
      // Clear the array
      pendingPoints.length = 0;
      
      // Schedule next update
      rafId = requestAnimationFrame(processPoints);
    };
    
    // Start the rendering loop
    rafId = requestAnimationFrame(processPoints);
    
    // Queue draw points for efficient processing
    const queueDrawPoint = (x: number, y: number, isDown: boolean) => {
      pendingPoints.push({x, y, isDown});
      
      if (pendingPoints.length === 1 && !rafId) {
        rafId = requestAnimationFrame(processPoints);
      }
    };

    // Add to the fabricCanvas instance for external access
    (fabricCanvas as any).optimizedDraw = queueDrawPoint;

    return () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [fabricCanvas, canvasRef]);

  return {
    webglContext: webglContextRef.current
  };
};

export default useOptimizedDrawing;
