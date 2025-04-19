
import { useState, useCallback, useEffect, useRef } from 'react';
import { Canvas as FabricCanvas, Point } from 'fabric';
import { DrawingMode } from '@/constants/drawingModes';

export interface UseOptimizedDrawingProps {
  canvas: FabricCanvas | null;
  tool: DrawingMode;
  lineColor: string;
  lineThickness: number;
}

export function useOptimizedDrawing({
  canvas,
  tool,
  lineColor,
  lineThickness
}: UseOptimizedDrawingProps) {
  const [isDrawing, setIsDrawing] = useState(false);
  const [objectCount, setObjectCount] = useState(0);
  const [metrics, setMetrics] = useState<{
    fps: number;
    renderTime: number;
    objectsRendered: number;
  } | null>(null);
  
  // Track performance
  useEffect(() => {
    if (!canvas) return;
    
    // Count objects
    setObjectCount(canvas.getObjects().length);
    
    // Track performance on object changes
    const handleObjectAdded = () => {
      setObjectCount(canvas.getObjects().length);
    };
    
    const handleObjectRemoved = () => {
      setObjectCount(canvas.getObjects().length);
    };
    
    canvas.on('object:added', handleObjectAdded);
    canvas.on('object:removed', handleObjectRemoved);
    
    // Performance monitoring
    let lastTime = performance.now();
    let frames = 0;
    const fpsInterval = setInterval(() => {
      const now = performance.now();
      const elapsed = now - lastTime;
      frames++;
      
      if (elapsed >= 1000) {
        const fps = Math.round((frames * 1000) / elapsed);
        setMetrics({
          fps,
          renderTime: elapsed / frames,
          objectsRendered: objectCount
        });
        
        frames = 0;
        lastTime = now;
      }
    }, 500);
    
    return () => {
      canvas.off('object:added', handleObjectAdded);
      canvas.off('object:removed', handleObjectRemoved);
      clearInterval(fpsInterval);
    };
  }, [canvas, objectCount]);
  
  // Mouse event handlers
  const handleMouseDown = useCallback((event: MouseEvent, targetCanvas: FabricCanvas) => {
    if (tool !== DrawingMode.DRAW && tool !== DrawingMode.LINE) return;
    
    setIsDrawing(true);
    
    const pointer = targetCanvas.getPointer(event);
    
    if (tool === DrawingMode.LINE) {
      // Start drawing a line
      const line = new fabric.Line([pointer.x, pointer.y, pointer.x, pointer.y], {
        stroke: lineColor,
        strokeWidth: lineThickness
      });
      
      targetCanvas.add(line);
      targetCanvas.setActiveObject(line);
    }
  }, [tool, lineColor, lineThickness]);
  
  const handleMouseMove = useCallback((event: MouseEvent, targetCanvas: FabricCanvas) => {
    if (!isDrawing) return;
    
    const pointer = targetCanvas.getPointer(event);
    
    if (tool === DrawingMode.LINE) {
      // Update line end point
      const activeObject = targetCanvas.getActiveObject();
      if (activeObject && activeObject.type === 'line') {
        const line = activeObject as any;
        line.set({
          x2: pointer.x,
          y2: pointer.y
        });
        
        line.setCoords();
        targetCanvas.renderAll();
      }
    }
  }, [isDrawing, tool]);
  
  const handleMouseUp = useCallback((event: MouseEvent, targetCanvas: FabricCanvas) => {
    setIsDrawing(false);
    
    if (tool === DrawingMode.LINE) {
      // Finalize line
      targetCanvas.discardActiveObject();
      targetCanvas.renderAll();
    }
  }, [tool]);
  
  return {
    isDrawing,
    objectCount,
    metrics,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp
  };
}
