
import { useEffect, useRef, useCallback } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { toast } from 'sonner';

interface UseOptimizedDrawingProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  fabricCanvas: FabricCanvas | null;
}

export const useOptimizedDrawing = ({ canvasRef, fabricCanvas }: UseOptimizedDrawingProps) => {
  const webglContextRef = useRef<WebGL2RenderingContext | null>(null);
  const isDrawingRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number; pressure: number } | null>(null);

  // Initialize WebGL context with optimal settings
  const initializeWebGL = useCallback(() => {
    if (!canvasRef.current) return;

    const gl = canvasRef.current.getContext('webgl2', {
      alpha: true,
      antialias: true,
      preserveDrawingBuffer: false,
      premultipliedAlpha: false,
      desynchronized: true,
      powerPreference: 'high-performance'
    });

    if (!gl) {
      console.error('WebGL2 not supported');
      return;
    }

    webglContextRef.current = gl;
    
    // Configure WebGL for optimal performance
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0.0, 0.0, 0.0, 0.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
  }, [canvasRef]);

  // Optimized point interpolation for smooth lines
  const interpolatePoints = useCallback((p1: any, p2: any, pressure: number): any[] => {
    const points = [];
    const steps = Math.ceil(Math.hypot(p2.x - p1.x, p2.y - p1.y) / 2);
    
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      points.push({
        x: p1.x + (p2.x - p1.x) * t,
        y: p1.y + (p2.y - p1.y) * t,
        pressure: p1.pressure + (pressure - p1.pressure) * t
      });
    }
    
    return points;
  }, []);

  // Raw pointer event handlers for minimal latency
  useEffect(() => {
    if (!canvasRef.current || !fabricCanvas) return;

    const canvas = canvasRef.current;

    const handlePointerDown = (e: PointerEvent) => {
      e.preventDefault();
      isDrawingRef.current = true;
      
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      lastPointRef.current = { 
        x, 
        y, 
        pressure: e.pressure || 0.5 
      };

      // Start path in Fabric
      if (fabricCanvas.isDrawingMode && fabricCanvas.freeDrawingBrush) {
        fabricCanvas.freeDrawingBrush.onMouseDown(new fabric.Point(x, y), {
          e,
          pointer: { x, y }
        });
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!isDrawingRef.current || !lastPointRef.current) return;
      e.preventDefault();
      
      const rect = canvas.getBoundingClientRect();
      const currentPoint = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        pressure: e.pressure || 0.5
      };

      // Interpolate points for smooth lines
      const points = interpolatePoints(lastPointRef.current, currentPoint, currentPoint.pressure);
      
      // Draw interpolated points
      if (fabricCanvas.isDrawingMode && fabricCanvas.freeDrawingBrush) {
        points.forEach(point => {
          fabricCanvas.freeDrawingBrush.onMouseMove(new fabric.Point(point.x, point.y), {
            e,
            pointer: point
          });
        });
      }

      lastPointRef.current = currentPoint;
    };

    const handlePointerUp = (e: PointerEvent) => {
      if (!isDrawingRef.current) return;
      e.preventDefault();
      
      isDrawingRef.current = false;
      lastPointRef.current = null;

      // End path in Fabric
      if (fabricCanvas.isDrawingMode && fabricCanvas.freeDrawingBrush) {
        fabricCanvas.freeDrawingBrush.onMouseUp({ e });
      }
    };

    // Add event listeners with capture phase for lower latency
    canvas.addEventListener('pointerdown', handlePointerDown, { passive: false, capture: true });
    canvas.addEventListener('pointermove', handlePointerMove, { passive: false, capture: true });
    canvas.addEventListener('pointerup', handlePointerUp, { passive: false, capture: true });
    canvas.addEventListener('pointerout', handlePointerUp, { passive: false, capture: true });

    // Set touch-action to none to prevent scrolling
    canvas.style.touchAction = 'none';

    return () => {
      canvas.removeEventListener('pointerdown', handlePointerDown);
      canvas.removeEventListener('pointermove', handlePointerMove);
      canvas.removeEventListener('pointerup', handlePointerUp);
      canvas.removeEventListener('pointerout', handlePointerUp);
    };
  }, [canvasRef, fabricCanvas, interpolatePoints]);

  // Initialize WebGL context
  useEffect(() => {
    initializeWebGL();
  }, [initializeWebGL]);

  return {
    webglContext: webglContextRef.current
  };
};
