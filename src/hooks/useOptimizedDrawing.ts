
import { useState, useCallback, useEffect } from 'react';
import { Canvas as FabricCanvas, Point as FabricPoint } from 'fabric';
import { DrawingMode } from '@/constants/drawingModes';

// Use the performance monitoring hook if available
let usePerformanceMonitoring: any;
try {
  usePerformanceMonitoring = require('./usePerformanceMonitoring').usePerformanceMonitoring;
} catch (e) {
  usePerformanceMonitoring = () => ({ fps: 60, memory: null });
}

interface UseOptimizedDrawingProps {
  canvas: FabricCanvas | null;
  tool?: DrawingMode;
  lineColor?: string;
  lineThickness?: number;
}

export const useOptimizedDrawing = ({
  canvas,
  tool = DrawingMode.SELECT,
  lineColor = '#000000',
  lineThickness = 2
}: UseOptimizedDrawingProps) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [objectCount, setObjectCount] = useState(0);
  const [metrics, setMetrics] = useState<any>({ fps: 60 });
  
  // Monitor performance if available
  const performance = typeof usePerformanceMonitoring === 'function' 
    ? usePerformanceMonitoring() 
    : { fps: 60, memory: null };
  
  // Update metrics from performance monitoring
  useEffect(() => {
    setMetrics(performance);
  }, [performance]);
  
  // Update object count
  useEffect(() => {
    if (!canvas) return;
    
    const updateObjectCount = () => {
      setObjectCount(canvas.getObjects().length);
    };
    
    canvas.on('object:added', updateObjectCount);
    canvas.on('object:removed', updateObjectCount);
    
    // Initial count
    updateObjectCount();
    
    return () => {
      canvas.off('object:added', updateObjectCount);
      canvas.off('object:removed', updateObjectCount);
    };
  }, [canvas]);
  
  // Handle mouse down event
  const handleMouseDown = useCallback((event: MouseEvent, canvas: FabricCanvas) => {
    if (!canvas || tool !== DrawingMode.DRAW) return;
    
    setIsDrawing(true);
  }, [tool]);
  
  // Handle mouse move event
  const handleMouseMove = useCallback((event: MouseEvent, canvas: FabricCanvas) => {
    if (!canvas || !isDrawing || tool !== DrawingMode.DRAW) return;
    
    // Drawing logic would go here for custom drawing
  }, [isDrawing, tool]);
  
  // Handle mouse up event
  const handleMouseUp = useCallback((event: MouseEvent, canvas: FabricCanvas) => {
    if (!canvas) return;
    
    setIsDrawing(false);
    
    // If we're in drawing mode, create a new fabric object
    if (tool === DrawingMode.DRAW) {
      const pointer = canvas.getPointer(event);
      const point = new FabricPoint(pointer.x, pointer.y);
      
      // Example: Add a small circle at mouse up position
      const circle = new fabric.Circle({
        left: point.x,
        top: point.y,
        radius: 5,
        fill: lineColor,
        selectable: true
      });
      
      canvas.add(circle);
      canvas.renderAll();
    }
  }, [tool, lineColor]);
  
  return {
    isDrawing,
    objectCount,
    metrics,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp
  };
};
